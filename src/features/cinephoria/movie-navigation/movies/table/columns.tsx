/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { favorites, statuses } from "../data/data";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { parseStringToArray } from "@/lib/utils";
import { useLocalStorage } from "usehooks-ts";
import type { Movie } from "../data/schema";
import { MovieView } from "../movie-view/movie-view";
import { UpdateMovieForm } from "../update/update-movie-form";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<Movie>[] = [
  {
    // Add a virtual column with all data to filter on
    id: "global",
    accessorFn: (row) =>
      `
       ${row.title} 
       ${row.directors} 
       ${row.actors} 
       ${row.musicComposer} 
       ${row.movieDate} 
       ${row.gender}  
       ${row.duration}
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
        Movie[]
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
        Movie[]
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
                rowChecked.filter((movie) => movie.id !== row.original.id),
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
      <DataTableColumnHeader column={column} title="Movie" />
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
          <MovieView row={row} />
          <UpdateMovieForm row={row} isDialogOpen={false} icon={true} />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      // const gender = genders.find(
      //   (label) => label.value === row.original.gender,
      // );

      return (
        <div className="flex space-x-2">
          {/* {gender && <Badge variant="outline">{gender.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "directors",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Directors" />
    ),
    cell: ({ row }) => {
      // const gender = genders.find(
      //   (label) => label.value === row.original.gender,
      // );

      return (
        <div className="flex space-x-2">
          {/* {gender && <Badge variant="outline">{gender.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("directors")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => {
      const getRowGenders = row.getValue("gender") as string;
      const parseRowGenders = parseStringToArray({ str: getRowGenders });

      // const gender = genders.find((gender) => gender.value === getRowGender);

      // if (!gender) {
      //   return null;
      // }

      const rowGendersMapped = parseRowGenders.map((gender) => (
        <Badge
          key={gender}
          variant={"secondary"}
          className="hover:cursor-default"
        >
          {gender}
        </Badge>
      ));

      return (
        <div className="flex flex-wrap items-center gap-1">
          {/* {label.icon && (
            <label.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )} */}
          {/* <span>{parseRowGenders.join(", ")}</span> */}
          {rowGendersMapped}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const getStatus = row.getValue("active") as boolean;

      const statusValue = getStatus ? "active" : "disabled";

      const status = statuses.find((status) => status.value === statusValue);

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center justify-center">
          {status.icon && (
            <status.icon className="mr-2 size-4 text-muted-foreground" />
          )}
          {/* <span>{status.label}</span> */}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "favorite",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Favorite" />
    ),
    cell: ({ row }) => {
      const getFavorite = row.getValue("favorite") as boolean;

      const favoriteValue = getFavorite ? "favorite" : "others";

      const favorite = favorites.find(
        (favorite) => favorite.value === favoriteValue,
      );

      if (!favorite) {
        return null;
      }

      return (
        <div className="flex items-center">
          {favorite.icon && (
            <favorite.icon className="mr-2 size-4 text-muted-foreground" />
          )}
          {/* <span>{favorite.label}</span> */}
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
