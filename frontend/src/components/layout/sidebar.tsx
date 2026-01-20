"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import { navItems } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex min-h-screen flex-col gap-6 bg-[#131f2c] text-white transition-all duration-300",
        collapsed ? "w-20 px-3" : "w-72 px-6",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "mt-6 flex items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/10",
          collapsed && "justify-center",
        )}
      >
        <LayoutGrid className="h-5 w-5 text-white/80" />
        {!collapsed && (
          <span className="text-lg font-semibold tracking-tight font-[family:var(--font-sora)]">
            FAMS Demo
          </span>
        )}
      </button>

      <Separator className="bg-white/10" />
      <nav className="flex flex-1 flex-col gap-2">
        <TooltipProvider delayDuration={100}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const content = (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#2f6fed]/20 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                  collapsed && "justify-center",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );

            if (!collapsed) {
              return content;
            }

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>{content}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>
    </aside>
  );
}
