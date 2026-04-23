"use client";

import { Check, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type Props = {
  className?: string;
};

export function ShareButton({ className }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ url, title: document.title });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // User cancelled share dialog or clipboard failed; ignore.
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className={className}
    >
      {copied ? (
        <>
          <Check className="mr-1.5 h-4 w-4 text-emerald-500" />
          Link copied
        </>
      ) : (
        <>
          <LinkIcon className="mr-1.5 h-4 w-4" />
          Share this result
        </>
      )}
    </Button>
  );
}
