"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardBody } from "@heroui/card";
import { Tab, Tabs } from "@heroui/tabs";
import type { ColumnDef } from "@tanstack/react-table";
import { Film, LayoutDashboard } from "lucide-react";
import React from "react";
import { MoviesDashboardLayout } from "./movies";
import type { Movie } from "./movies/data/schema";
import { DataTable } from "./movies/table/data-table";

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

type Tabs = {
  id: string;
  label: string | React.ReactNode;
  content: string | React.ReactNode;
};

export const MovieNavigation = ({ movies, columns, members }: Props) => {
  const tabs: Tabs[] = [
    {
      id: "dashboard",
      label: (
        <div className="flex items-center space-x-2">
          <LayoutDashboard className="size-4" />
          <span>Dashboard</span>
        </div>
      ),
      content: <MoviesDashboardLayout columns={columns} data={movies} />,
    },
    {
      id: "Films",
      label: (
        <div className="flex items-center space-x-2">
          <Film className="size-4" />
          <span>Films</span>
        </div>
      ),
      content: <DataTable columns={columns} data={movies} />,
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
