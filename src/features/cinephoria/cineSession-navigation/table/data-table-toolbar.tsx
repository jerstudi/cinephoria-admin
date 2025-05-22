/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";

import { getCineSessions } from "../../../../../app/orgs/[orgSlug]/(navigation)/cineSession/cineSession.action";
import type { Halls } from "../../halls-navigation/data/schema";
import type { Movie } from "../../movie-navigation/movies/data/schema";
import { CreateCineSessionForm } from "../create/create-cineSession-form";
import type { CineSession } from "../data/schema";
import { DeleteManyCineSessions } from "../delete/delete-many-cineSession-form";

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
};

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [rowChecked, setRowChecked, removeRowChecked] = useLocalStorage<
    CineSession[]
  >("rowChecked", []);
  const queryClient = useQueryClient();

  const isFiltered = table.getState().columnFilters.length > 0;
  const { data: cineSessions } = useQuery<CineSession[]>({
    queryKey: ["cineSessions"],
    queryFn: getCineSessions,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // const cities = halls?.hall;
  // const setHalls = halls?.hall;

  const halls = queryClient.getQueryData<Halls>(["halls"]) ?? {
    hall: [],
    cinema: [],
    cities: [],
  };
  const movies = queryClient.getQueryData<Movie[]>(["movies"]) ?? [];

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
          placeholder="Filter session..."
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
        {/* {table.getColumn("active") && (
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
        )} */}
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
          <DeleteManyCineSessions
            cineSessions={cineSessions ?? []}
            table={table}
          />
        ) : null}
        {/* <CreateCinemaForm type={"icon"} cities={cities ?? []} /> */}
        <CreateCineSessionForm
          type={"icon"}
          className=""
          movies={movies}
          halls={halls}
        />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
