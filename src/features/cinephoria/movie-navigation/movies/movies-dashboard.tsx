"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { CreateMovieForm } from "./create/create-movie-form";
import {
  moviesFilteredByFavorite,
  moviesFilteredByGender,
  moviesFilteredByStatus,
} from "./data/filters";
import type { Movie } from "./data/schema";
import { DataTableChartFavorite } from "./monitoring/data-table-chart-favorite";
import { DataTableChartGender } from "./monitoring/data-table-chart-gender";
import { DataTableChartStatus } from "./monitoring/data-table-chart-status";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
};

export function MoviesDashboardLayout<TData extends Movie, TValue>({
  data,
}: DataTableProps<TData, TValue>) {
  const moviesByStatusFiltered = moviesFilteredByStatus(data);
  const moviesByFavoriteFiltered = moviesFilteredByFavorite(data);
  const moviesByGenderFiltered = moviesFilteredByGender(data);
  console.log("GENDERS", moviesByGenderFiltered);

  return (
    <div>
      <div className="flex items-center justify-start gap-10 rounded-lg border-none border-primary p-4">
        <div>
          <p className="text-xl font-semibold text-white/70">
            Ajouter rapidement des films à programmer en salle
          </p>
          <p className="text-sm font-normal text-white/70">
            Gérer et éditer vos films dans les différentes vues disponibles.
          </p>
        </div>
        <div>
          <CreateMovieForm type={"icon"} className="">
            Ajouter un film
          </CreateMovieForm>
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
        {/* @todo: Monitoring */}
        <DataTableChartStatus table={moviesByStatusFiltered} />
        <DataTableChartGender table={moviesByGenderFiltered} />
        <DataTableChartFavorite table={moviesByFavoriteFiltered} />
      </div>
    </div>
  );
}
