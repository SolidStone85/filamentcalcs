import { EVIDENCE_LABEL, type EvidenceType } from "@/lib/reference";
import { cn } from "@/lib/utils";

// Small pill that says how solid a published number is, so readers can
// tell a manufacturer spec from a forum measurement at a glance.
const STYLES: Record<EvidenceType, string> = {
  manufacturer: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  "community-db": "bg-primary/10 text-primary",
  community: "bg-muted text-foreground",
  unverified: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
};

export function EvidenceBadge({ evidence }: { evidence: EvidenceType }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        STYLES[evidence],
      )}
    >
      {EVIDENCE_LABEL[evidence]}
    </span>
  );
}
