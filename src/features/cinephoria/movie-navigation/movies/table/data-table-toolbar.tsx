"use client";

import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";
import { getMovies } from "../../../../../../app/orgs/[orgSlug]/(navigation)/movie/movies.action";
import { CreateMovieForm } from "../create/create-movie-form";
import { favorites, statuses } from "../data/data";
import type { Movie } from "../data/schema";
import { DeleteManyMovies } from "../delete/delete-many-movie-form";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
};

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [rowChecked, setRowChecked, removeRowChecked] = useLocalStorage<
    Movie[]
  >("rowChecked", []);
  const isFiltered = table.getState().columnFilters.length > 0;
  const { data: movies } = useQuery<Movie[]>({
    queryKey: ["movies"],
    queryFn: getMovies,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* <Input
          placeholder="Filter movie..."
          value={(table.getColumn("title")?.getFilterValue() as string) || ""}
          onChange={(event) => {
            table.getColumn("title")?.setFilterValue(event.target.value);
            table.getColumn("directors")?.setFilterValue(event.target.value);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        /> */}
        <Input
          placeholder="Filter movie..."
          value={(table.getColumn("global")?.getFilterValue() as string) || ""}
          onChange={(event) => {
            table.getColumn("global")?.setFilterValue(event.target.value);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/* {table.getColumn("directors") && (
          <DataTableFacetedFilter
            column={table.getColumn("directors")}
            title="Directors"
            options={statuses}
          />
        )} */}
        {table.getColumn("active") && (
          <DataTableFacetedFilter
            column={table.getColumn("active")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("favorite") && (
          <DataTableFacetedFilter
            column={table.getColumn("favorite")}
            title="Favorite"
            options={favorites}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-0">
        {rowChecked.length > 0 ? (
          <DeleteManyMovies movies={movies ?? []} table={table} />
        ) : null}
        <CreateMovieForm type={"icon"} />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
