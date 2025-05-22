/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardBody } from "@heroui/card";
import { Tab, Tabs } from "@heroui/tabs";
import type { ColumnDef } from "@tanstack/react-table";
import { Film, Landmark, LayoutDashboard, Theater } from "lucide-react";
import React from "react";
import type { Cinema } from "./cinema/data/schema";
import { CinemaDataTable } from "./cinema/table/cinema-data-table";
import { cinemaColumns } from "./cinema/table/columns";
import type { City } from "./city/data/schema";
import { CitiesDataTable } from "./city/table/cities-data-table";
import { cityColumns } from "./city/table/columns";
import {
  cinemaDataTableFilter,
  citiesDataTableFilter,
  hallDataTableFilter,
} from "./data/filters";
import type { Halls } from "./data/schema";
import { HallsNavigationLayout } from "./halls-navigation";
import type { Hall } from "./halls/data/schema";
import { hallColumns } from "./halls/table/columns";
import { HallsDataTable } from "./halls/table/halls-data-table";
type Props = {
  halls: Halls;
  // columns: ColumnDef<Halls>[];
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

export const HallsNavigation = ({ halls, members }: Props) => {
  const citiesDataTable = citiesDataTableFilter(halls);
  const hallsDataTable = hallDataTableFilter(halls);
  const cinemaDataTable = cinemaDataTableFilter(halls);

  const citiesColumns = cityColumns as ColumnDef<City>[];
  const hallsColumns = hallColumns as ColumnDef<Hall>[];
  const cinemasColumns = cinemaColumns as ColumnDef<Cinema>[];

  const tabs: Tabs[] = [
    {
      id: "dashboard",
      label: (
        <div className="flex items-center space-x-2">
          <LayoutDashboard className="size-4" />
          <span>Dashboard</span>
        </div>
      ),
      content: <HallsNavigationLayout data={halls} />,
    },
    {
      id: "Hall",
      label: (
        <div className="flex items-center space-x-2">
          <Theater className="size-4" />
          <span>Hall</span>
        </div>
      ),
      content: <HallsDataTable columns={hallsColumns} data={hallsDataTable} />,
    },
    {
      id: "Cinema",
      label: (
        <div className="flex items-center space-x-2">
          <Film className="size-4" />
          <span>Cinema</span>
        </div>
      ),
      content: (
        <CinemaDataTable columns={cinemasColumns} data={cinemaDataTable} />
      ),
    },
    {
      id: "City",
      label: (
        <div className="flex items-center space-x-2">
          <Landmark className="size-4" />
          <span>City</span>
        </div>
      ),
      content: (
        <CitiesDataTable columns={citiesColumns} data={citiesDataTable} />
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
