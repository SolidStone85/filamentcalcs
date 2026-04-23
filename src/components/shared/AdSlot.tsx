import { cn } from "@/lib/utils";

type Props = {
  slot: "top" | "inline" | "sidebar";
  className?: string;
};

// Placeholder ad slot. Renders an empty marker during development
// (and post-launch until AdSense is approved). Once AdSense is
// active, swap this for a real <ins className="adsbygoogle" /> block
// per approved placement. Leaving the placeholder in production is
// intentional: it reserves layout space so there's no CLS when
// ads start serving.

const HEIGHTS: Record<Props["slot"], string> = {
  top: "h-24",
  inline: "h-32",
  sidebar: "h-64",
};

export function AdSlot({ slot, className }: Props) {
  // Hide entirely in production until ads are live, no visual noise for users.
  // Flip this flag once AdSense approval lands.
  const ADS_ENABLED = false;

  if (!ADS_ENABLED && process.env.NODE_ENV === "production") return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center rounded-md border border-dashed border-border/60 bg-muted/30 text-xs text-muted-foreground",
        HEIGHTS[slot],
        className,
      )}
    >
      ad slot ({slot})
    </div>
  );
}
