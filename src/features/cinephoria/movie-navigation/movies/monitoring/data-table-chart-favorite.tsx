"use client";

import { TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

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
import { type MoviesFilteredByFavorite } from "../data/filters";

const chartConfig = {
  favoriteCount: {
    label: "Favorite",
    color: "hsl(var(--chart-1))",
  },
  noFavoriteCount: {
    label: "no favorite",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type DataTableChartProps = {
  table: MoviesFilteredByFavorite[];
};

export function DataTableChartFavorite({ table }: DataTableChartProps) {
  const moviesFavorite = Number(table.map((t) => t.count));
  const moviesNoFavorite =
    Number(table.map((t) => t.totalCount)) - Number(table.map((t) => t.count));
  const chartData = [
    {
      totalCount: moviesFavorite + moviesNoFavorite,
      favoriteCount: moviesFavorite,
      noFavoriteCount: moviesNoFavorite,
    },
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Nombre de films favoris</CardTitle>
        <CardDescription>Année 2025</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {moviesFavorite.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 4}
                          className="fill-muted-foreground font-semibold"
                        >
                          films favoris
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 22}
                          className="fill-muted-foreground"
                        >
                          {`Total : ${chartData[0].totalCount} films`}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="favoriteCount"
              stackId="a"
              cornerRadius={5}
              fill={chartConfig.favoriteCount.color}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="noFavoriteCount"
              fill={chartConfig.noFavoriteCount.color}
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
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
