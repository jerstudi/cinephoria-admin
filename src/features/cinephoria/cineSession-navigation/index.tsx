"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardBody } from "@heroui/card";
import { Tab, Tabs } from "@heroui/tabs";
import type { ColumnDef } from "@tanstack/react-table";
import { LayoutDashboard, Projector } from "lucide-react";
import React from "react";
import type { Halls } from "../halls-navigation/data/schema";
import type { Movie } from "../movie-navigation/movies/data/schema";
import { CineSessionsDashboardLayout } from "./cineSessions-dashboard";
import type { CineSession } from "./data/schema";
import { CineSessionDataTable } from "./table/cineSession-data-table";
import { cineSessionColumns } from "./table/columns";

type Props = {
  cineSessions: CineSession[];
  movies: Movie[];
  halls: Halls;
  // columns: ColumnDef<CineSession>[];
  members: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
  }[];
};

type Tabs = {
  id: string;
  label: string | React.ReactNode;
  content: string | React.ReactNode;
};

export const CineSessionsNavigation = ({
  cineSessions,
  movies,
  halls,
  // columns,
  members,
}: Props) => {
  // const movies = cineSessions.map((cineSession) => cineSession.movie);
  // const halls = cineSessions.map((cineSession) => cineSession.hall);
  // const cinemas = cineSessions.map((cineSession) => cineSession.cinema);
  // console.log("movies", movies);

  const cineSessionColumnsDef = cineSessionColumns as ColumnDef<CineSession>[];

  const tabs: Tabs[] = [
    {
      id: "dashboard",
      label: (
        <div className="flex items-center space-x-2">
          <LayoutDashboard className="size-4" />
          <span>Dashboard</span>
        </div>
      ),
      content: (
        <CineSessionsDashboardLayout
          // columns={columns}
          data={cineSessions}
          movies={movies}
          halls={halls}
        />
      ),
    },
    {
      id: "CineSessions",
      label: (
        <div className="flex items-center space-x-2">
          <Projector className="size-4" />
          <span>Sessions</span>
        </div>
      ),
      content: (
        <CineSessionDataTable
          columns={cineSessionColumnsDef}
          data={cineSessions}
        />
      ),
    },
  ];

  return (
    <div className="flex w-full flex-col bg-transparent">
      <Tabs
        aria-label="Dynamic tabs"
        items={tabs}
        variant="solid"
        radius="sm"
        size="sm"
        classNames={{
          tabList:
            "animate-gradient bg-gradient-to-r from-orange-700 via-orange-500 to-orange-700 bg-[length:var(--bg-size)_100%] rounded-lg",
          cursor: "group-data-[selected=true]:bg-zinc-900 rounded-lg",
          tab: "text-sm",
          tabContent: "group-data-[selected=true]:text-zinc-100 text-zinc-200",
        }}
      >
        {(item) => (
          <Tab key={item.id} title={item.label}>
            {/* @todo: transform h-[800px] by dynamic value */}
            <Card className="overflow-hidden bg-transparent">
              <CardBody className="rounded-lg border-none">
                <ScrollArea className="w-full whitespace-nowrap">
                  {item.content}
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardBody>
            </Card>
          </Tab>
        )}
      </Tabs>
    </div>
  );
};
