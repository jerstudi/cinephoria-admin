"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Typography } from "@/components/ui/typography";
import { calculateRequiredReservationsForPercentage } from "@/lib/utils";
import {
  MoreVertical,
  PanelTopClose,
  PanelTopOpen,
  Save,
  SaveOff,
} from "lucide-react";
import React from "react";
import { useLocalStorage } from "usehooks-ts";
import { CreateCinemaForm } from "./cinema/create/create-cinema-form";
import { CreateCityForm } from "./city/create/create-city-form";
import type { Halls } from "./data/schema";
import { CreateHallForm } from "./halls/create/create-hall-form";
import { TableHallType } from "./monitoring/table-hall-type";

type DataTableProps<TData, TValue> = {
  // columns: ColumnDef<TData, TValue>[];
  data: TData;
  className?: string;
};

const defaultResetTarget: { value: number; isDefault: boolean } = {
  value: 3,
  isDefault: false,
};

const DefineTargetMenu = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex size-8 text-sm data-[state=open]:bg-muted"
        >
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="left" className="relative top-11">
        <DropdownMenuItem asChild>
          <DefineResetTarget />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DefineResetTarget = () => {
  const [open, setOpen] = React.useState(false);
  const [resetValue, setResetValue] = React.useState(defaultResetTarget.value);
  const [defaultTarget, setDefaultTarget] = useLocalStorage<number>(
    "defaultTarget",
    defaultResetTarget.value,
  );

  const handleSave = () => {
    defaultResetTarget.value = resetValue;
    setDefaultTarget(resetValue);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          size={"xs"}
          className="w-[222px] px-2 py-0 text-xs"
        >
          Define Reset Target
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Define Reset Target Value</DialogTitle>
          <DialogDescription>
            Définissez la valeur de l'objectif par défaut pour le nombre de
            places réservées pour chaque salle.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Value (%)
            </Label>
            <Input
              id="name"
              type="number"
              value={resetValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setResetValue(Number(e.target.value))
              }
              className="col-span-3"
            />
          </div>
          <p className="text-sm text-white/70">
            Afin d'affecter la nouvelle valeur par défaut, cliquez sur le bouton{" "}
            <span className="flex items-center gap-1">
              <SaveOff className="size-4 text-destructive" />
              <code className="text-white/50">Reset Default</code>{" "}
            </span>
          </p>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function HallsNavigationLayout<TData extends Halls, TValue>({
  data,
}: DataTableProps<TData, TValue>) {
  const [isPanelOpen, setIsPanelOpen] = React.useState<boolean>(true);
  const [defaultTarget, setDefaultTarget, removeDefaultTarget] =
    useLocalStorage<number>("defaultTarget", defaultResetTarget.value);
  const [target, setTarget] = React.useState<number>(defaultTarget);
  // const moviesByStatusFiltered = moviesFilteredByStatus(data);
  // const moviesByFavoriteFiltered = moviesFilteredByFavorite(data);
  // const moviesByGenderFiltered = moviesFilteredByGender(data);
  // console.log("GENDERS", moviesByGenderFiltered);
  // console.log("data-dashboard", data);

  const cities = data.cities;

  // Calcul du nombre total de places nécessaires pour atteindre l'objectif
  const totalRequiredReservations = data.hall.reduce((total, hall) => {
    return (
      total + calculateRequiredReservationsForPercentage(hall.capacity, target)
    );
  }, 0);

  return (
    <div>
      {isPanelOpen ? (
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-white/5 px-4 py-7">
            <Typography
              variant={"p"}
              className="flex flex-col items-center justify-center text-sm font-semibold text-white/70"
            >
              <span>Ajouter</span>
              <span>des</span>
              <span>éléments</span>
            </Typography>
          </div>
          <div className="mx-1 flex w-fit items-center justify-start gap-8 rounded-lg border border-solid border-white/10 p-4">
            {/* <div>
          <p className="text-xl font-semibold text-white/70">
          Ajouter rapidement une ville associée au groupe Cinephoria.
          </p>
          </div> */}
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg p-1 text-white/70 hover:cursor-default hover:bg-white/5">
              <Typography
                variant={"p"}
                className="flex flex-col items-center gap-0 text-[10px] uppercase text-white/70"
              >
                <span>Ajouter</span>
                <span>une salle</span>
              </Typography>
              <CreateHallForm type={"icon"} className="mr-0" />
            </div>
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg p-1 text-white/70 hover:cursor-default hover:bg-white/5">
              <Typography
                variant={"p"}
                className="flex flex-col items-center gap-0 text-[10px] uppercase text-white/70"
              >
                <span>Ajouter</span>
                <span>un cinéma</span>
              </Typography>
              <CreateCinemaForm
                type={"icon"}
                cities={cities}
                className="mr-0"
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg p-1 text-white/70 hover:cursor-default hover:bg-white/5">
              <Typography
                variant={"p"}
                className="flex flex-col items-center gap-0 text-[10px] uppercase text-white/70"
              >
                <span>Ajouter</span>
                <span>une ville</span>
              </Typography>
              <CreateCityForm type={"icon"} className="mr-0" />
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"outline"}
                  className="cursor-default rounded-lg bg-white/5 px-4 py-14"
                  onClick={() => setIsPanelOpen(false)}
                >
                  <Typography
                    variant={"p"}
                    className="text-sm font-semibold text-white/70"
                  >
                    <PanelTopClose className="size-4" />
                  </Typography>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Close the panel</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ) : (
        <Button
          variant={"outline"}
          className="flex w-fit cursor-default items-center justify-center gap-2 rounded-lg bg-white/5 p-4"
          onClick={() => setIsPanelOpen(true)}
        >
          <div>
            <PanelTopOpen className="size-4" />
          </div>
          <div>
            <Typography
              variant={"p"}
              className="cursor-default text-xs font-semibold text-white/70"
            >
              Ouvrir le panneau pour ajouter des éléments
            </Typography>
          </div>
        </Button>
      )}
      <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2">
        {/* @todo: Monitoring */}
        <TableHallType hallsData={data} />
        <div>
          <div className="mt-4 flex flex-col items-start justify-center gap-0">
            <Label>
              Objectif du nombre de places réservées pour chaque salle :{" "}
            </Label>
            <div className="flex items-center justify-center gap-2">
              <Input
                type="number"
                value={target}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTarget(Number(e.target.value))
                }
                className="w-24"
              />
              <Typography variant="p" className="mb-5 text-sm font-semibold">
                %
              </Typography>
              <div className="mx-4 flex items-center justify-center gap-0 rounded-lg border border-solid border-white/10">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        onClick={() => setDefaultTarget(target)}
                        className="flex items-center justify-center gap-2 text-white/70"
                      >
                        <Save className="size-4" />
                        {/* <p className="text-xs font-semibold">Save by default</p> */}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Save by default</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          removeDefaultTarget();
                          setTarget(defaultResetTarget.value);
                        }}
                        className="flex items-center justify-center gap-2 text-destructive hover:bg-destructive hover:text-white/70"
                      >
                        <SaveOff className="size-4" />
                        {/* <p className="text-xs font-semibold">Reset default</p> */}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset default</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DefineTargetMenu />
              </div>
            </div>
          </div>
          <Typography
            variant={"p"}
            className="!mt-10 text-sm font-semibold text-white/70"
          >
            Si l'objectif est de {target}%, alors il faut{" "}
            {totalRequiredReservations} places réservées au total.
          </Typography>
          <div className="mt-4">
            <Typography
              variant={"p"}
              className="text-sm font-semibold text-white/70"
            >
              Détail par salle :
            </Typography>
            <ul className="mt-2 space-y-2">
              {data.hall.map((hall) => (
                <li key={hall.id} className="text-sm text-white/70">
                  Salle {hall.hallNumber} ({hall.capacity} places) :{" "}
                  <Badge
                    variant="secondary"
                    className="ml-2 cursor-default bg-success"
                  >
                    {calculateRequiredReservationsForPercentage(
                      hall.capacity,
                      target,
                    )}{" "}
                    places
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
