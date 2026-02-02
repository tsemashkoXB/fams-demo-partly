'use client';

import * as React from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export type VehicleRowData = {
  id: number;
  plateNumber: string;
  modelName: string;
  type: string;
  imageUrl?: string;
};

interface VehicleRowProps {
  vehicle: VehicleRowData;
  children: React.ReactNode;
}

export function VehicleRow({ vehicle, children }: VehicleRowProps) {
  const initials = vehicle.modelName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-stretch border-b border-border last:border-b-0">
      {/* Vehicle info - fixed width */}
      <div className="flex w-[200px] flex-shrink-0 items-center gap-3 border-r border-border bg-muted/30 px-4 py-3">
        <Avatar className="h-10 w-10 rounded-lg">
          {vehicle.imageUrl ? (
            <Image
              src={vehicle.imageUrl}
              alt={vehicle.modelName}
              width={40}
              height={40}
              className="rounded-lg object-cover"
            />
          ) : (
            <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-medium">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-foreground">
            {vehicle.modelName}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="truncate">{vehicle.plateNumber}</span>
            <span className="text-border">•</span>
            <span className="truncate">{vehicle.type}</span>
          </div>
        </div>
      </div>

      {/* Timeline area - flexible width */}
      <div className="relative min-h-[56px] flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export const MemoizedVehicleRow = React.memo(VehicleRow);
