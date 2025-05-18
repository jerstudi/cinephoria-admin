/* eslint-disable react-hooks/rules-of-hooks */

"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { useLocalStorage } from "usehooks-ts";
import type { CineSession } from "../data/schema";
import { UpdateCineSessionForm } from "../update/update-cineSession-form";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const cineSessionColumns: ColumnDef<CineSession>[] = [
  {
    // Add a virtual column with all data to filter on
    id: "global",
    accessorFn: (row) =>
      `
       ${row.identifier} 
       ${row.movieId} 
       ${row.hallId} 
       ${row.pricing} 
      `,
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId) as string;
      return value.toLowerCase().includes(filterValue.toLowerCase());
    },
    enableHiding: false,
    enableSorting: false,
    enableColumnFilter: false,
    header: () => null,
    cell: () => null,
  },
  {
    id: "select",
    header: ({ table }) => {
      const [rowChecked, setRowChecked, removeRowChecked] = useLocalStorage<
        CineSession[]
      >("rowChecked", []);

      return (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);

            if (value) {
              setRowChecked(
                table.getRowModel().rows.map((row) => row.original),
              );
            } else {
              setRowChecked([]);
            }
          }}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      );
    },
    cell: ({ row }) => {
      const [rowChecked, setRowChecked, removeRowChecked] = useLocalStorage<
        CineSession[]
      >("rowChecked", []);

      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            if (value) {
              setRowChecked([...rowChecked, row.original]);
            } else {
              setRowChecked(
                rowChecked.filter(
                  (cineSession) => cineSession.id !== row.original.id,
                ),
              );
            }
          }}
          // onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "identifier",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Identifier" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[80px] text-muted-foreground">
          {row.getValue("identifier")}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Actions",
    header: () => (
      // <DataTableColumnHeader column={column} title="Actions" />
      <div className="text-xs">Quick Actions</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <UpdateCineSessionForm row={row} isDialogOpen={false} icon={true} />
        </div>
      );
    },
  },
  {
    accessorKey: "movieId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Movie Title" />
    ),
    cell: ({ row }) => {
      // const gender = genders.find(
      //   (label) => label.value === row.original.gender,
      // );

      return (
        <div className="flex space-x-2">
          {/* {gender && <Badge variant="outline">{gender.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
            {/* {row.getValue("movieId")} */}
            {row.original.movie?.title ?? row.getValue("movieId")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "cinema",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cinema" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.original.cinema?.name ?? row.getValue("cineId")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "cineId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="City" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.original.cinema?.city ?? row.getValue("cineId")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "hallId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hall Number" />
    ),
    cell: ({ row }) => {
      // const gender = genders.find(
      //   (label) => label.value === row.original.gender,
      // );

      return (
        <div className="flex space-x-2">
          {/* {gender && <Badge variant="outline">{gender.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
            {row.original.hall?.hallNumber ?? row.getValue("hallId")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "pricing",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pricing" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[80px] text-muted-foreground">
          {row.getValue("pricing")}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
