// Compact byline rendered in guide headers.
// Shows the real author name (E-E-A-T signal) and the last-updated date.
// Use directly under the guide title.

import Link from "next/link";

import { AUTHOR } from "@/lib/author";

type Props = {
  // Display string like "Updated April 2026". Caller passes whatever is
  // already on the page so we don't have to change every guide's date.
  updatedLabel: string;
};

export function AuthorByline({ updatedLabel }: Props) {
  return (
    <p className="text-sm text-muted-foreground">
      By{" "}
      <Link
        href="/about"
        className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
      >
        {AUTHOR.name}
      </Link>
      {" · "}
      <span>{updatedLabel}</span>
    </p>
  );
}
