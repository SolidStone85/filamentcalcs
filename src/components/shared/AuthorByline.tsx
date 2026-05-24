// Compact byline rendered in guide headers.
// Shows the editorial update date and a link to methodology. Keeps the
// page from looking anonymously published without putting a personal name
// on it.

import Link from "next/link";

type Props = {
  // Display string like "Updated April 2026". Caller passes whatever is
  // already on the page so we don't have to change every guide's date.
  updatedLabel: string;
};

export function AuthorByline({ updatedLabel }: Props) {
  return (
    <p className="text-sm text-muted-foreground">
      <span>{updatedLabel}</span>
      {" · "}
      <Link
        href="/methodology"
        className="underline underline-offset-4 hover:text-primary"
      >
        Methodology and sources
      </Link>
    </p>
  );
}
