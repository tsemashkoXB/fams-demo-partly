"use client";

import * as React from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
        />
        <div className="flex min-h-screen flex-1 flex-col">
          <Header />
          <main className="flex-1 px-8 py-6">
            <div className="min-h-full rounded-2xl bg-card p-6 shadow-soft">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
