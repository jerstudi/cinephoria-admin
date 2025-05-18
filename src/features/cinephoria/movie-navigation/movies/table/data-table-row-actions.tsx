"use client";

import type { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DuplicateMovie } from "../create/duplicate/duplicate-movie";
import { genders } from "../data/data";
import { type Movie, MovieSchema } from "../data/schema";
import { DeleteMovieForm } from "../delete/delete-movie-form";
import { UpdateMovieForm } from "../update/update-movie-form";

type DataTableRowActionsProps<TData extends Movie> = {
  row: Row<TData>;
};

export function DataTableRowActions<TData extends Movie>({
  row,
}: DataTableRowActionsProps<TData>) {
  const movie = MovieSchema.parse(row.original);

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
          <UpdateMovieForm row={row} />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <DuplicateMovie row={row} />
        </DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Gender</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={movie.gender}>
              {genders.map((gender) => (
                <DropdownMenuRadioItem key={gender.value} value={gender.value}>
                  {gender.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <DeleteMovieForm movie={row} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
