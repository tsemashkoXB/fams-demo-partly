"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen overflow-hidden bg-background text-foreground">
        <div className="flex h-full">
          <Sidebar
            collapsed={collapsed}
            onToggle={() => setCollapsed((prev) => !prev)}
          />
          <div className="flex h-full min-h-0 flex-1 flex-col">
            <Header />
            <main className="flex-1 min-h-0 overflow-hidden px-8 py-6">
              <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-card p-6 shadow-soft">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}
