import { Fragment } from "react";

import type { SpoolAnswerTile } from "@/lib/spoolBrands";
import { cn } from "@/lib/utils";

// The short answer on each brand page, shown before the calculator and the
// evidence table. Values must match the sourced rows (tests check this).
// Phones get one compact box with a line per figure; wider screens get a
// row of tiles with the + and = drawn between them.
export function SpoolAnswerTiles({ tiles }: { tiles: SpoolAnswerTile[] }) {
  return (
    <div className="mt-5 overflow-hidden rounded-lg border sm:flex sm:gap-2 sm:overflow-visible sm:rounded-none sm:border-0">
      {tiles.map((tile) => (
        <Fragment key={tile.label}>
          {tile.joinBefore && (
            <div
              aria-hidden="true"
              className="hidden items-center justify-center text-lg font-semibold text-muted-foreground sm:flex"
            >
              {tile.joinBefore}
            </div>
          )}
          <div
            className={cn(
              "flex items-baseline justify-between gap-3 border-b px-4 py-2 last:border-b-0 sm:block sm:flex-1 sm:rounded-lg sm:border sm:py-3 sm:last:border-b",
              tile.emphasis
                ? "bg-primary/5 sm:border-primary/40"
                : "sm:bg-background/70",
            )}
          >
            <div className="text-xs text-muted-foreground">
              {tile.joinBefore && (
                <span aria-hidden="true" className="mr-1.5 font-semibold sm:hidden">
                  {tile.joinBefore}
                </span>
              )}
              {tile.label}
            </div>
            <div
              className={cn(
                "font-mono text-base font-semibold whitespace-nowrap tabular-nums sm:mt-1 sm:text-xl",
                tile.emphasis && "text-primary",
              )}
            >
              {tile.value}
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
