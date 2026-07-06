import { ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AMAZON_DISCLOSURE, getAffiliatePicks } from "@/lib/commerce";
import { cn } from "@/lib/utils";

type Props = {
  pagePath: string;
  className?: string;
};

function buildAmazonUrl(rawUrl: string, tag: string) {
  const url = new URL(rawUrl);
  url.searchParams.set("tag", tag);
  return url.toString();
}

export function AffiliatePicks({ pagePath, className }: Props) {
  const tag = process.env.NEXT_PUBLIC_AMZN_TAG?.trim();

  if (process.env.VERCEL_ENV === "production" && !tag) {
    throw new Error("NEXT_PUBLIC_AMZN_TAG is required for Amazon affiliate links.");
  }

  const picks = getAffiliatePicks(pagePath);

  if (picks.length === 0 || !tag) return null;

  return (
    <aside
      aria-label="Related Amazon product picks"
      className={cn("rounded-lg border bg-muted/20 p-4", className)}
    >
      <div className="mb-4 space-y-1">
        <p className="text-xs font-medium uppercase text-muted-foreground">
          Amazon picks
        </p>
        <p className="text-xs text-muted-foreground">{AMAZON_DISCLOSURE}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {picks.map((product) => (
          <a
            key={product.id}
            href={buildAmazonUrl(product.url, tag)}
            target="_blank"
            rel="sponsored nofollow"
            className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Card className="glass-card fc-card-lift h-full hover:border-primary/60">
              <CardHeader>
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  {product.eyebrow}
                </p>
                <CardTitle className="flex items-start justify-between gap-3 text-sm">
                  <span>{product.title}</span>
                  <ExternalLink
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs leading-5 text-muted-foreground">
                  {product.reason}
                </p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </aside>
  );
}
