import type { Movie } from "@/features/cinephoria/movie-navigation/movies/data/schema";
import { MoviesStorage } from "@/features/cinephoria/movie-navigation/movies/movies-storage";
import { columns } from "@/features/cinephoria/movie-navigation/movies/table/columns";
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { combineWithParentMetadata } from "@/lib/metadata";
import { getRequiredCurrentOrgCache } from "@/lib/react/cache";
import { getOrgsMembers } from "@/query/org/get-orgs-members";
import type { PageParams } from "@/types/next";
import type { ColumnDef } from "@tanstack/react-table";
import { getMovies } from "./movies.action";

export const generateMetadata = combineWithParentMetadata({
  title: "Movies",
  description: "Movies Manager",
});

export default async function RoutePage(props: PageParams) {
  const { org } = await getRequiredCurrentOrgCache(["ADMIN"]);
  const members = await getOrgsMembers(org.id);

  const moviesDataResult = await getMovies();
  const moviesData = Array.isArray(moviesDataResult) ? moviesDataResult : [];

  return (
    <Layout size="xl" className="mx-auto my-0">
      <LayoutHeader>
        <LayoutTitle className="font-sans">Films programmés</LayoutTitle>
      </LayoutHeader>
      {/* <LayoutActions className="flex gap-2">
        <Button variant="outline">Delete</Button>
        <Button variant="default">Create</Button>
      </LayoutActions> */}
      <LayoutContent className="flex flex-col gap-4 lg:gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
          <MoviesStorage
            movies={moviesData}
            columns={columns as ColumnDef<Movie>[]}
            members={members.map((m) => ({
              role: m.roles,
              ...m.user,
              id: m.id,
            }))}
          />
          {/* <MovieNavigation /> */}
        </div>
        {/* <DonutChart /> */}
      </LayoutContent>
    </Layout>
  );
}
