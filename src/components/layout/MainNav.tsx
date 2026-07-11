"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TOOLS } from "@/lib/tools";
import { cn } from "@/lib/utils";

const PAGE_LINKS = [
  { href: "/guides", label: "Guides" },
  { href: "/glossary", label: "Glossary" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
];

export function MainNav() {
  const pathname = usePathname();
  const toolsActive = pathname.startsWith("/tools");

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-1 text-muted-foreground",
                  toolsActive && "bg-primary/10 text-foreground",
                )}
              >
                Tools
                <ChevronDown className="size-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuItem render={<Link href="/tools" />}>
              All calculators
            </DropdownMenuItem>
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

        {PAGE_LINKS.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "fc-ghost-hover inline-flex h-7 items-center rounded-lg px-2.5 text-[0.8rem] font-medium",
                active
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile nav: everything behind one menu so the bar never overflows */}
      <nav className="flex items-center md:hidden" aria-label="Main">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuItem render={<Link href="/tools" />}>
              All calculators
            </DropdownMenuItem>
            {TOOLS.filter((t) => t.available).map((tool) => {
              const href = `/tools/${tool.slug}`;
              return (
                <DropdownMenuItem
                  key={tool.slug}
                  render={
                    <Link
                      href={href}
                      aria-current={pathname === href ? "page" : undefined}
                    />
                  }
                >
                  {tool.shortTitle}
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            {PAGE_LINKS.map((link) => (
              <DropdownMenuItem
                key={link.href}
                render={
                  <Link
                    href={link.href}
                    aria-current={
                      pathname.startsWith(link.href) ? "page" : undefined
                    }
                  />
                }
              >
                {link.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </>
  );
}
