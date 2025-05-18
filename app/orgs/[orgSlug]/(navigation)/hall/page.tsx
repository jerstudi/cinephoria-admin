import { HallsStorage } from "@/features/cinephoria/halls-navigation/halls-storage";
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
import { retrieveAllFromHallsData } from "./hall.action";

export const generateMetadata = combineWithParentMetadata({
  title: "Hall",
  description: "Hall Manager",
});

export default async function RoutePage(props: PageParams) {
  const { org } = await getRequiredCurrentOrgCache(["ADMIN"]);
  const members = await getOrgsMembers(org.id);

  const hallsDataResult = await retrieveAllFromHallsData();

  // const hallsData = hallsDataResult ? hallsDataResult : [];
  // console.log("HALLS DATA", hallsDataResult);

  return (
    <Layout size="xl" className="mx-auto my-0">
      <LayoutHeader>
        <LayoutTitle className="font-sans">Gestion des salles</LayoutTitle>
      </LayoutHeader>
      {/* <LayoutActions className="flex gap-2">
        <Button variant="outline">Delete</Button>
        <Button variant="default">Create</Button>
      </LayoutActions> */}
      <LayoutContent className="flex flex-col gap-4 lg:gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
          <HallsStorage
            halls={hallsDataResult}
            // columns={columns as ColumnDef<Halls>[]}
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
