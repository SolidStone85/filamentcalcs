import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRelatedLinks } from "@/lib/commerce";
import { cn } from "@/lib/utils";

type Props = {
  pagePath: string;
  className?: string;
};

export function RelatedContent({ pagePath, className }: Props) {
  const links = getRelatedLinks(pagePath);

  if (links.length === 0) return null;

  return (
    <nav
      aria-label="Related tools and guides"
      className={cn("rounded-lg border bg-muted/20 p-4", className)}
    >
      <p className="mb-4 text-xs font-medium uppercase text-muted-foreground">
        Related tools and guides
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="block">
            <Card className="glass-card h-full transition-colors duration-150 hover:border-primary/45">
              <CardHeader>
                <CardTitle className="text-sm">{link.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs leading-5 text-muted-foreground">
                  {link.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </nav>
  );
}
