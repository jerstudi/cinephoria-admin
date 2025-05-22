/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useZodForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "@/components/ui/loader-circle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type AddButton } from "@/features/cinephoria/types";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import { Check, ChevronsUpDown, ListPlus, SquarePen } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { hallTypes } from "../data/data";
import type { Hall } from "../data/schema";
import { updateHallAction } from "./update-hall.action";

export const UpdateHallSchema = z.object({
  id: z.string(),
  hallNumber: z.preprocess((val) => Number(val), z.number()),
  type: z.string(),
  capacity: z.preprocess((val) => Number(val), z.number()),
  disabled_places: z.preprocess((val) => Number(val), z.number()),
});

export type UpdateHallType = z.infer<typeof UpdateHallSchema>;

export type DataTableHallUpdateProps<TData extends Hall> = {
  row: Row<TData>;
  type?: AddButton;
  children?: React.ReactNode;
  isDialogOpen?: boolean;
  icon?: boolean;
  className?: string;
  onClose?: () => void;
};

export function UpdateHallForm<TData extends Hall>({
  row,
  type,
  children,
  isDialogOpen,
  icon = false,
  className,
  onClose,
}: DataTableHallUpdateProps<TData>) {
  const [open, setOpen] = React.useState<boolean>(isDialogOpen ?? false);
  const [comboBoxOpen, setComboBoxOpen] = React.useState<boolean>(false);
  const [valueSelected, setValueSelected] = React.useState<string>("");

  const queryClient = useQueryClient();
  const session = useSession();
  const router = useRouter();

  const hallData = row.original;

  const form = useZodForm({
    schema: UpdateHallSchema,
    defaultValues: {
      id: hallData.id,
      hallNumber: hallData.hallNumber,
      type: hallData.type,
      capacity: hallData.capacity,
      disabled_places: hallData.disabled_places,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: UpdateHallType) => {
      const result = await updateHallAction(values);
      if (result?.serverError) {
        toast.error(result.serverError);
        return result;
      }
    },
    // onSuccess: async () => {
    //   toast.success("Movie created successfully");
    //   form.reset();
    //   setOpen(false);
    //   // await queryClient.invalidateQueries({ queryKey: ["movie"] });
    //   router.refresh();
    // },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["halls"] });
      toast.success("Hall updated successfully");
      form.reset();
      setOpen(false);
      router.refresh();
    },
    // mutationKey: ["cities"],
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast.error(error.message || "An error occurred while updating the hall");
    },
  });

  if (!session.data?.user) {
    toast.error("User not found");
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant={icon ? "ghost" : "ghost"}
                size={"sm"}
                className={cn(
                  icon
                    ? cn("flex justify-between mr-2", className)
                    : cn(
                        "flex w-full items-center justify-start text-sm",
                        className,
                      ),
                )}
              >
                {icon ? (
                  <SquarePen className="size-5" />
                ) : (
                  <div className="flex w-full items-center justify-between">
                    <span>Edit</span>
                    <span className="text-xs">⌘e</span>
                  </div>
                )}
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          {icon && (
            <TooltipContent>
              <p>Edit hall</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="p-2">
          <DialogTitle className="flex items-center gap-2">
            <ListPlus className="size-5" />
            Modifier la salle
          </DialogTitle>
          <DialogDescription>
            Modifier les caractéristiques de la salle
          </DialogDescription>
        </DialogHeader>
        <Form
          form={form}
          onSubmit={async (v) => {
            await mutation.mutateAsync(v);
          }}
        >
          <ScrollArea className="h-96 rounded-md">
            <div className="flex w-full flex-col gap-1 p-4">
              <FormField
                control={form.control}
                name="hallNumber"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Numéro de salle
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg group-hover:bg-muted">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Entrez le numéro de la salle"
                            {...field}
                            className="border-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Type
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg">
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={comboBoxOpen}
                                  className={cn(
                                    "w-[200px] justify-between",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value
                                    ? hallTypes.find(
                                        (hallType) =>
                                          hallType.value === field.value,
                                      )?.label
                                    : "Select type..."}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search type..."
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>No type found</CommandEmpty>
                                  <CommandGroup>
                                    {hallTypes.map((hallType) => (
                                      <CommandItem
                                        key={hallType.value}
                                        value={hallType.label}
                                        onSelect={() => {
                                          form.setValue("type", hallType.value);
                                          setComboBoxOpen(false);
                                        }}
                                      >
                                        {hallType.label}
                                        <Check
                                          className={cn(
                                            "ml-auto size-4 shrink-0",
                                            hallType.value === field.value
                                              ? "opacity-100"
                                              : "opacity-0",
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Capacité
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg group-hover:bg-muted">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Entrez la capacité en nombre de places assises de la salle"
                            {...field}
                            className="border-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="disabled_places"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Places réservées
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg group-hover:bg-muted">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Indiquez le nombre de places réservées PMR"
                            {...field}
                            className="border-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </ScrollArea>
          <DialogFooter className="mt-10 sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-24"
            >
              {mutation.isPending ? <LoaderCircle /> : "Modifier"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
