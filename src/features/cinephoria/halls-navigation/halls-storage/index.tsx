"use client";

import { LoaderCircle } from "@/components/ui/loader-circle";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { HallsNavigation } from "..";
import { retrieveAllFromHallsData } from "../../../../../app/orgs/[orgSlug]/(navigation)/hall/hall.action";
import type { Halls } from "../data/schema";

type Props = {
  halls: Halls;
  // columns: ColumnDef<Halls>;
  members: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
  }[];
};

export const HallsStorage = ({ halls, members }: Props) => {
  const queryClient = useQueryClient();

  const {
    isPending,
    isError,
    data: hallsData,
    error,
  } = useQuery<Halls>({
    queryKey: ["halls"],
    queryFn: retrieveAllFromHallsData,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
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

  return <HallsNavigation halls={hallsData as Halls} members={members} />;
};
