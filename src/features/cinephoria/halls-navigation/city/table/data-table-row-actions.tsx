/* eslint-disable @typescript-eslint/no-unused-vars */
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

import { DuplicateCity } from "../create/duplicate/duplicate-city";
import { type City } from "../data/schema";
import { DeleteCityForm } from "../delete/delete-city-form";
import { UpdateCityForm } from "../update/update-city-form";

type DataTableRowActionsProps<TData extends City> = {
  row: Row<TData>;
};

export function DataTableRowActions<TData extends City>({
  row,
}: DataTableRowActionsProps<TData>) {
  // const city = CitySchema.parse(row.original);

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
          <UpdateCityForm row={row} />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <DuplicateCity row={row} />
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
          <DeleteCityForm city={row} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
