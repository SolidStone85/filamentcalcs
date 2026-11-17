"""Reproduce software predictions only; no printer/network connection."""
import argparse
import hashlib
import json
import re
import subprocess
from pathlib import Path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--slicer', type=Path, required=True)
    parser.add_argument('--output-dir', type=Path, required=True)
    args = parser.parse_args()
    package = Path(__file__).resolve().parent
    for line in (package / 'SHA256SUMS.txt').read_text(encoding='utf-8').splitlines():
        expected, name = line.split('  ', 1)
        if Path(name).name != name:
            raise ValueError('Checksum entry must be a local filename')
        if hashlib.sha256((package / name).read_bytes()).hexdigest() != expected:
            raise ValueError('Package checksum mismatch: ' + name)
    executable = str(args.slicer.resolve())
    version = subprocess.run([executable, '--help'], capture_output=True, text=True, timeout=30)
    if version.returncode or not version.stdout.startswith('PrusaSlicer-2.9.4 '):
        raise ValueError('Use the official PrusaSlicer 2.9.4 executable')
    output = args.output_dir.resolve()
    output.mkdir(parents=True, exist_ok=False)
    data = output / 'isolated-data'
    data.mkdir()
    expected = json.loads((package / 'predictions.json').read_text(encoding='utf-8'))
    actual = []
    for row in expected['profiles']:
        label = row['id']
        gcode = output / (label + '.gcode')
        command = [executable, '--datadir', str(data), '--threads', '2', '--load',
                   str(package / (label + '.ini')), '--center', '125,105',
                   '--export-gcode', '--output', str(gcode), str(package / 'model.stl')]
        result = subprocess.run(command, capture_output=True, text=True, timeout=180)
        log = result.stdout + result.stderr
        for private, replacement in [(str(output), '<output>'), (str(package), '<package>'),
                                     (executable, '<slicer>')]:
            log = log.replace(private, replacement).replace(private.replace('\\', '/'), replacement)
        (output / (label + '.log')).write_text(log, encoding='utf-8', newline='\n')
        if result.returncode or not gcode.exists():
            raise RuntimeError('Slice failed; inspect the local log: ' + label)
        text = gcode.read_text(encoding='utf-8')
        time = re.search(r'^; estimated printing time \(normal mode\) = (.+)$', text, re.M)
        grams = re.search(r'^; filament used \[g\] = (.+)$', text, re.M)
        if not time or not grams:
            raise ValueError('Missing generated predictions: ' + label)
        item = {'id': label, 'normal_mode_prediction': time.group(1),
                'predicted_filament_g': grams.group(1), 'physical_print_time': None}
        item['matches_record'] = (item['normal_mode_prediction'] == row['normal_mode_prediction']
                                  and item['predicted_filament_g'] == row['predicted_filament_g'])
        actual.append(item)
    report = {'application': 'PrusaSlicer 2.9.4', 'kind': 'software predictions only', 'profiles': actual}
    (output / 'actual-predictions.json').write_text(json.dumps(report, indent=2) + '\n',
                                                      encoding='utf-8', newline='\n')
    print(json.dumps(report, indent=2))
    if not all(row['matches_record'] for row in actual):
        raise SystemExit('Predictions differ: compare application and settings before claiming reproduction')


if __name__ == '__main__':
    main()
