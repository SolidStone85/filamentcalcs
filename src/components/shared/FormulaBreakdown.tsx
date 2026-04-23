"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Row = { label: string; value: string };

type Props = {
  formula: string;
  steps: Row[];
  note?: string;
};

export function FormulaBreakdown({ formula, steps, note }: Props) {
  return (
    <Accordion className="w-full">
      <AccordionItem value="breakdown" className="border-b-0">
        <AccordionTrigger className="text-sm font-medium">
          Show the math
        </AccordionTrigger>
        <AccordionContent className="space-y-3">
          <div className="rounded-md bg-muted p-3 font-mono text-sm">
            {formula}
          </div>
          <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1.5 text-sm">
            {steps.map((step) => (
              <div key={step.label} className="contents">
                <dt className="text-muted-foreground">{step.label}</dt>
                <dd className="font-mono tabular-nums">{step.value}</dd>
              </div>
            ))}
          </dl>
          {note && (
            <p className="text-xs italic text-muted-foreground">{note}</p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
