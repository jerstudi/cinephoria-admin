"use client";

import type { Halls } from "../halls-navigation/data/schema";
import type { Movie } from "../movie-navigation/movies/data/schema";
import { CreateCineSessionForm } from "./create/create-cineSession-form";
import type { CineSession } from "./data/schema";
import { SessionsByDate } from "./monitoring/sessions-by-date";

type DataTableProps<TData> = {
  // columns: ColumnDef<TData, TValue>[];
  data: TData[];
  movies: Movie[];
  halls: Halls;
  className?: string;
};

export function CineSessionsDashboardLayout<TData extends CineSession>({
  data,
  movies,
  halls,
}: DataTableProps<TData>) {
  // const moviesByStatusFiltered = moviesFilteredByStatus(data);
  // const moviesByFavoriteFiltered = moviesFilteredByFavorite(data);
  // const moviesByGenderFiltered = moviesFilteredByGender(data);
  // console.log("GENDERS", moviesByGenderFiltered);

  return (
    <div>
      <div className="flex items-center justify-start gap-10 rounded-lg border-none border-primary p-4">
        <div>
          <p className="text-xl font-semibold text-white/70">
            Ajouter rapidement une session de cinéma
          </p>
          <p className="text-sm font-normal text-white/70">
            Gérer et éditer vos sessions dans les différentes vues disponibles.
          </p>
        </div>
        <div>
          <CreateCineSessionForm
            type={"icon"}
            className=""
            movies={movies}
            halls={halls}
          >
            Ajouter une session
          </CreateCineSessionForm>
          {/* <Button variant="outline">Ajouter une session</Button> */}
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
        {/* @todo: Monitoring */}
        <SessionsByDate data={data} />
      </div>
    </div>
  );
}
