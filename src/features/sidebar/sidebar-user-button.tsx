import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { ChevronsUpDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { UserDropdown } from "../auth/user-dropdown";

export const SidebarUserButton = () => {
  const session = useSession();
  const data = session.data?.user;
  return (
    <UserDropdown>
      {/* <Button variant="outline">
        <Avatar className="size-6">
          <AvatarFallback>{data?.name?.[0] ?? "-"}</AvatarFallback>
          {data?.image && <AvatarImage src={data.image} />}
        </Avatar>
        <span>{data?.name}</span>
      </Button> */}
      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <Avatar className="size-8 rounded-lg">
          <AvatarImage src={data?.image ?? ""} alt={data?.name?.[0]} />
          <AvatarFallback className="rounded-lg">
            {data?.name?.[0] ?? "U"}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{data?.name}</span>
          <span className="truncate text-xs">{data?.email}</span>
        </div>
        <ChevronsUpDown className="ml-auto size-4" />
      </SidebarMenuButton>
    </UserDropdown>
  );
};
