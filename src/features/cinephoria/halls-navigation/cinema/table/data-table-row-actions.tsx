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

import { DuplicateCinema } from "../create/duplicate/duplicate-cinema";
import type { Cinema } from "../data/schema";
import { DeleteCinemaForm } from "../delete/delete-cinema-form";
import { UpdateCinemaForm } from "../update/update-cinema-form";

type DataTableRowActionsProps<TData extends Cinema> = {
  row: Row<TData>;
};

export function DataTableRowActions<TData extends Cinema>({
  row,
}: DataTableRowActionsProps<TData>) {
  // const cinema = CinemaSchema.parse(row.original);

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
          <UpdateCinemaForm row={row} />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <DuplicateCinema row={row} />
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
          <DeleteCinemaForm cinema={row} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
