import Link from "next/link";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SITE, TOOLS } from "@/lib/tools";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight"
        >
          {SITE.name}
          <span className="text-muted-foreground">.com</span>
        </Link>

        <nav className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="sm" className="gap-1">
                  Tools
                  <ChevronDown className="h-4 w-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-64">
              {TOOLS.map((tool) =>
                tool.available ? (
                  <DropdownMenuItem
                    key={tool.slug}
                    render={<Link href={`/tools/${tool.slug}`} />}
                  >
                    {tool.shortTitle}
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem key={tool.slug} disabled>
                    {tool.shortTitle}
                    <span className="ml-auto text-xs text-muted-foreground">
                      soon
                    </span>
                  </DropdownMenuItem>
                ),
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/guides"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Guides
          </Link>
          <Link
            href="/about"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            About
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
