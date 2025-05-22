/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";

import { retrieveAllFromHallsData } from "../../../../../../app/orgs/[orgSlug]/(navigation)/hall/hall.action";
import type { Halls } from "../../data/schema";
import { CreateCityForm } from "../create/create-city-form";
import type { City } from "../data/schema";
import { DeleteManyCities } from "../delete/delete-many-cities-form";

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
};

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [rowChecked, setRowChecked, removeRowChecked] = useLocalStorage<City[]>(
    "rowChecked",
    [],
  );
  const isFiltered = table.getState().columnFilters.length > 0;
  const { data: halls } = useQuery<Halls>({
    queryKey: ["halls"],
    queryFn: retrieveAllFromHallsData,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  const cities = halls?.cities;

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
          placeholder="Filter city..."
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
          <DeleteManyCities cities={cities ?? []} table={table} />
        ) : null}
        <CreateCityForm type={"icon"} />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
