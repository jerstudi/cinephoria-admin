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

import { DuplicateCineSession } from "../create/duplicate/duplicate-cineSession";
import type { CineSession } from "../data/schema";
import { DeleteCineSessionForm } from "../delete/delete-cineSession-form";
import { UpdateCineSessionForm } from "../update/update-cineSession-form";

type DataTableRowActionsProps<TData extends CineSession> = {
  row: Row<TData>;
};

export function DataTableRowActions<TData extends CineSession>({
  row,
}: DataTableRowActionsProps<TData>) {
  // const cineSession = CineSessionSchema.parse(row.original);

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
          <UpdateCineSessionForm row={row} />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <DuplicateCineSession row={row} />
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
          <DeleteCineSessionForm cineSession={row} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
