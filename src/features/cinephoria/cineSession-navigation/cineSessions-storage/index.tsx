"use client";

import { LoaderCircle } from "@/components/ui/loader-circle";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { CineSessionsNavigation } from "..";
import { getCineSessions } from "../../../../../app/orgs/[orgSlug]/(navigation)/cineSession/cineSession.action";
import { retrieveAllFromHallsData } from "../../../../../app/orgs/[orgSlug]/(navigation)/hall/hall.action";
import { getMovies } from "../../../../../app/orgs/[orgSlug]/(navigation)/movie/movies.action";
import type { CineSession } from "../data/schema";

type Props = {
  cineSessions: CineSession[];
  // columns: ColumnDef<CineSession>[];
  members: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
  }[];
};

export const CineSessionsStorage = ({
  cineSessions,
  // columns,
  members,
}: Props) => {
  const queryClient = useQueryClient();

  const {
    isPending: isPendingCineSessions,
    isError: isErrorCineSessions,
    data: cineSessionsData,
    error: cineSessionsError,
  } = useQuery({
    queryKey: ["cineSessions"],
    queryFn: getCineSessions,
    staleTime: 0,
  });

  const {
    isPending: isPendingMovies,
    isError: isErrorMovies,
    data: moviesData,
    error: moviesError,
  } = useQuery({
    queryKey: ["movies"],
    queryFn: getMovies,
  });

  const {
    isPending: isPendingHalls,
    isError: isErrorHalls,
    data: hallsData,
    error: hallsError,
  } = useQuery({
    queryKey: ["halls"],
    queryFn: retrieveAllFromHallsData,
  });

  if (isPendingCineSessions || isPendingMovies || isPendingHalls) {
    return <LoaderCircle className="size-4" />;
  }

  if (isErrorCineSessions) {
    return (
      <span className="text-sm font-medium text-red-500">
        Error: {cineSessionsError.message}
      </span>
    );
  }

  if (isErrorMovies) {
    return (
      <span className="text-sm font-medium text-red-500">
        Error: {moviesError.message}
      </span>
    );
  }

  if (isErrorHalls) {
    return (
      <span className="text-sm font-medium text-red-500">
        Error: {hallsError.message}
      </span>
    );
  }

  return (
    <CineSessionsNavigation
      cineSessions={cineSessionsData}
      movies={moviesData}
      halls={hallsData}
      // columns={columns}
      members={members}
    />
  );
};
