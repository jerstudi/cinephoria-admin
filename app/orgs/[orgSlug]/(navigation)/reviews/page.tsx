/* eslint-disable @typescript-eslint/no-unused-vars */
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

export const generateMetadata = combineWithParentMetadata({
  title: "Tasks",
  description: "Tasks manager",
});

export default async function RoutePage(props: PageParams) {
  // const tasks = await getDemoTasks();
  const { org } = await getRequiredCurrentOrgCache(["ADMIN"]);
  const members = await getOrgsMembers(org.id);

  return (
    <Layout size="xl" className="mx-auto my-0">
      <LayoutHeader>
        <LayoutTitle className="font-sans">Avis client</LayoutTitle>
      </LayoutHeader>
      {/* <LayoutActions className="flex gap-2">
        <Button variant="outline">Delete</Button>
        <Button variant="default">Create</Button>
      </LayoutActions> */}
      <LayoutContent className="flex flex-col gap-4 lg:gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">Avis</div>
        {/* <DonutChart /> */}
      </LayoutContent>
    </Layout>
  );
}
