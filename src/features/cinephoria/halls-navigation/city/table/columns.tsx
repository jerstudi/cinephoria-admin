/* eslint-disable react-hooks/rules-of-hooks */

"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { useLocalStorage } from "usehooks-ts";
import type { City } from "../data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { UpdateCityForm } from "../update/update-city-form";

export const cityColumns: ColumnDef<City>[] = [
  {
    // Add a virtual column with all data to filter on
    id: "global",
    accessorFn: (row) =>
      `
       ${row.name} 
       ${row.cp} 
       ${row.country} 
       ${row.region} 
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
        City[]
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
        City[]
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
                rowChecked.filter((city) => city.id !== row.original.id),
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
          <UpdateCityForm row={row} isDialogOpen={false} icon={true} />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      // const gender = genders.find(
      //   (label) => label.value === row.original.gender,
      // );

      return (
        <div className="flex space-x-2">
          {/* {gender && <Badge variant="outline">{gender.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "cp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CP" />
    ),
    cell: ({ row }) => {
      // const gender = genders.find(
      //   (label) => label.value === row.original.gender,
      // );

      return (
        <div className="flex space-x-2">
          {/* {gender && <Badge variant="outline">{gender.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("cp")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "country",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pays" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center justify-center">
          {/* {status.icon && (
            <status.icon className="mr-2 size-4 text-muted-foreground" />
          )} */}
          {/* <span>{status.label}</span> */}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("country")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "region",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Région" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          {/* {favorite.icon && (
            <favorite.icon className="mr-2 size-4 text-muted-foreground" />
          )} */}
          {/* <span>{favorite.label}</span> */}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("region")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
