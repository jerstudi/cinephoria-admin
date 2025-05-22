/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { CreateHallForm } from "./create/create-hall-form";
import type { Hall } from "./data/schema";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
};

export function HallsDashboardLayout<TData extends Hall, TValue>({
  data,
}: DataTableProps<TData, TValue>) {
  // const moviesByStatusFiltered = moviesFilteredByStatus(data);
  // const moviesByFavoriteFiltered = moviesFilteredByFavorite(data);
  // const moviesByGenderFiltered = moviesFilteredByGender(data);
  // console.log("GENDERS", moviesByGenderFiltered);
  // console.log("data-dashboard", data);

  return (
    <div>
      <div className="flex items-center justify-start gap-10 rounded-lg border-none border-primary p-4">
        <div>
          <p className="text-xl font-semibold text-white/70">
            Ajouter rapidement un type salle pour un cinéma.
          </p>
          {/* <p className="text-sm font-normal text-white/70">
            Gérer et éditer vos films dans les différentes vues disponibles.
          </p> */}
        </div>
        <div>
          <CreateHallForm type={"icon"} className="">
            Ajouter une salle
          </CreateHallForm>
          {/* <Button variant={"outline"}>Ajouter une salle</Button> */}
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
        {/* @todo: Monitoring */}
      </div>
    </div>
  );
}
