"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  sublabel?: string;
  copyValue?: string;
  prominent?: boolean;
};

export function ResultDisplay({
  label,
  value,
  sublabel,
  copyValue,
  prominent = false,
}: Props) {
  const [copied, setCopied] = useState(false);
  const canCopy = Boolean(copyValue);

  async function handleCopy() {
    if (!copyValue) return;
    try {
      await navigator.clipboard.writeText(copyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be blocked; silently ignore.
    }
  }

  return (
    <Card
      className={cn(
        "glass-card gap-2 p-5",
        prominent && "border-primary/40 ring-1 ring-primary/20",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        {canCopy && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleCopy}
            aria-label={`Copy ${label}`}
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      <div
        className={cn(
          "font-mono tabular-nums",
          prominent ? "text-4xl font-semibold" : "text-2xl font-medium",
        )}
      >
        {value}
      </div>
      {sublabel && (
        <div className="text-xs text-muted-foreground">{sublabel}</div>
      )}
    </Card>
  );
}
