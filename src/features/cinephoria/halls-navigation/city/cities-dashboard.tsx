"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { CreateCityForm } from "./create/create-city-form";
import type { City } from "./data/schema";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
};

export function CitiesDashboardLayout<TData extends City, TValue>({
  data,
}: DataTableProps<TData, TValue>) {
  // const moviesByStatusFiltered = moviesFilteredByStatus(data);
  // const moviesByFavoriteFiltered = moviesFilteredByFavorite(data);
  // const moviesByGenderFiltered = moviesFilteredByGender(data);
  // console.log("GENDERS", moviesByGenderFiltered);
  console.log("data-dashboard", data);

  return (
    <div>
      <div className="flex items-center justify-start gap-10 rounded-lg border-none border-primary p-4">
        <div>
          <p className="text-xl font-semibold text-white/70">
            Ajouter rapidement une ville associée au groupe Cinephoria.
          </p>
          {/* <p className="text-sm font-normal text-white/70">
            Gérer et éditer vos films dans les différentes vues disponibles.
          </p> */}
        </div>
        <div>
          <CreateCityForm type={"icon"} className="">
            Ajouter une ville
          </CreateCityForm>
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
        {/* @todo: Monitoring */}
      </div>
    </div>
  );
}
