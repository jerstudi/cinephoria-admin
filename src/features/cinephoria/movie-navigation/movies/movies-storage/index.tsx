"use client";

import { LoaderCircle } from "@/components/ui/loader-circle";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { MovieNavigation } from "../..";
import { getMovies } from "../../../../../../app/orgs/[orgSlug]/(navigation)/movie/movies.action";
import type { Movie } from "../data/schema";

type Props = {
  movies: Movie[];
  columns: ColumnDef<Movie>[];
  members: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
  }[];
};

export const MoviesStorage = ({ movies, columns, members }: Props) => {
  const queryClient = useQueryClient();

  const {
    isPending,
    isError,
    data: moviesData,
    error,
  } = useQuery({
    queryKey: ["movies"],
    // queryFn: () => movies,
    queryFn: getMovies,
    staleTime: 0,
  });

  if (isPending) {
    return <LoaderCircle className="size-4" />;
  }

  if (isError) {
    return (
      <span className="text-sm font-medium text-red-500">
        Error: {error.message}
      </span>
    );
  }

  return (
    <MovieNavigation movies={moviesData} columns={columns} members={members} />
  );
};
