"use client";

import type { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DuplicateHall } from "../create/duplicate/duplicate-hall";
import { type Hall } from "../data/schema";
import { DeleteHallForm } from "../delete/delete-hall-form";
import { UpdateHallForm } from "../update/update-hall-form";

type DataTableRowActionsProps<TData extends Hall> = {
  row: Row<TData>;
};

export function DataTableRowActions<TData extends Hall>({
  row,
}: DataTableRowActionsProps<TData>) {
  // const hall = HallSchema.parse(row.original);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex size-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem asChild>
          <UpdateHallForm row={row} />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <DuplicateHall row={row} />
        </DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Gender</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {/* <DropdownMenuRadioGroup value={city.name}>
              {city.map((city) => (
                <DropdownMenuRadioItem key={city.value} value={city.value}>
                  {city.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup> */}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <DeleteHallForm hall={row} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
