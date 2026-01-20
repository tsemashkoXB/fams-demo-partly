"use client";

import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-8 py-4 shadow-sm">
      <div className="text-sm font-medium text-muted-foreground">
        Fleet autopark dashboard
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="bg-primary/10 text-primary hover:bg-primary/20"
          aria-label="Alerts"
        >
          <Bell className="h-5 w-5" />
        </Button>
        <Avatar className="h-9 w-9">
          <AvatarImage
            src="https://i.pravatar.cc/100?img=12"
            alt="Admin avatar"
          />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
