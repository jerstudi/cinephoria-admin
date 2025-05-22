/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import type { Halls } from "../../data/schema";
import type { Cinema } from "../data/schema";
import { updateCinemaAction } from "./update-cinema.action";

export const UpdateCinemaSchema = z.object({
  id: z.string(),
  name: z.string(),
  city: z.string(),
});

export type UpdateCinemaType = z.infer<typeof UpdateCinemaSchema>;

export type DataTableCinemaUpdateProps<TData extends Cinema> = {
  row: Row<TData>;
  type?: AddButton;
  children?: React.ReactNode;
  isDialogOpen?: boolean;
  icon?: boolean;
  className?: string;
  onClose?: () => void;
};

export function UpdateCinemaForm<TData extends Cinema>({
  row,
  type,
  children,
  isDialogOpen,
  icon = false,
  className,
  onClose,
}: DataTableCinemaUpdateProps<TData>) {
  const [open, setOpen] = React.useState<boolean>(isDialogOpen ?? false);
  const [comboBoxOpen, setComboBoxOpen] = React.useState<boolean>(false);

  const queryClient = useQueryClient();
  const session = useSession();
  const router = useRouter();

  const halls = queryClient.getQueryData<Halls>(["halls"]);
  const cities = halls?.cities ?? [];

  const cinemaData = row.original;

  const form = useZodForm({
    schema: UpdateCinemaSchema,
    defaultValues: {
      id: cinemaData.id,
      name: cinemaData.name,
      city: cinemaData.city,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: UpdateCinemaType) => {
      const result = await updateCinemaAction(values);
      if (result?.serverError) {
        toast.error(result.serverError);
        return;
      }
    },
    // onSuccess: async () => {
    //   toast.success("City updated successfully");
    //   form.reset();
    //   setOpen(false);
    //   // await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    //   router.refresh();
    // },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["halls"] });
      toast.success("Cinema updated successfully");
      form.reset();
      setOpen(false);
      onClose?.();
      router.refresh();
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast.error(
        error.message || "An error occurred while updating the cinema",
      );
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
              <p>Edit cinema</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="p-2">
          <DialogTitle className="flex items-center gap-2">
            <ListPlus className="size-5" />
            Modifier le cinéma
          </DialogTitle>
          <DialogDescription>
            Modifier les informations de ce cinéma
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Name
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg group-hover:bg-muted">
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Entrez le nom de la ville"
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
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        City
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
                                    ? cities.find(
                                        (city) => city.name === field.value,
                                      )?.name
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
                                    {cities.map((city) => (
                                      <CommandItem
                                        key={city.name}
                                        value={city.name}
                                        onSelect={() => {
                                          form.setValue("city", city.name);
                                          setComboBoxOpen(false);
                                        }}
                                      >
                                        {city.name}
                                        <Check
                                          className={cn(
                                            "ml-auto size-4 shrink-0",
                                            city.name === field.value
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
