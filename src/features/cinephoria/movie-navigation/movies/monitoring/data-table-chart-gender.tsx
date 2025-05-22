"use client";

import { TrendingUp } from "lucide-react";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { genders } from "../data/data";
import { type MoviesFilteredByGender } from "../data/filters";

const chartConfig = genders.reduce(
  (acc, { value, label }, index) => {
    acc[value] = {
      label,
      color: `hsl(var(--chart-${index + 1}))`, // Generate a dynamic color
    };
    return acc;
  },
  {} as Record<string, { label: string; color: string }>,
) satisfies ChartConfig;

type DataTableChartProps = {
  table: MoviesFilteredByGender[];
};

export function DataTableChartGender({ table }: DataTableChartProps) {
  const totalGenders = React.useMemo(() => {
    return table.reduce((acc, curr) => acc + curr.count, 0);
  }, [table]);

  // Générer dynamiquement un mapping des genders vers des valeurs de fill
  const uniqueGenders = Array.from(new Set(table.map((entry) => entry.gender))); // Liste unique des genders

  const fillTable = uniqueGenders.reduce(
    (acc, gender) => {
      acc[gender] = `var(--color-${gender})`; // Génération dynamique de fill
      return acc;
    },
    {} as Record<string, string>,
  );

  // Ajouter `fill` à `table` en fonction de `gender`
  const updatedTable = table.map((entry) => ({
    ...entry,
    fill: fillTable[entry.gender], // Associe la valeur `fill` générée dynamiquement
  }));
  // console.log(updatedTable);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Répartition par genre</CardTitle>
        <CardDescription>Année 2025</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={updatedTable}
              dataKey="count"
              nameKey="gender"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalGenders.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Genders
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
