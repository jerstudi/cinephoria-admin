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
import { type AddButton, AddButtonStyle } from "@/features/cinephoria/types";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsUpDown, ListPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";
import type { City } from "../../city/data/schema";
import { createCinemaAction } from "./create-cinema.actions";

export const CreateCinemaSchema = z.object({
  id: z.string(),
  name: z.string(),
  city: z.string(),
});

export type CreateCinemaType = z.infer<typeof CreateCinemaSchema>;

type CreateCinemaFormProps = {
  cities: City[];
  type?: AddButton;
  children?: React.ReactNode;
  className?: string;
};

export function CreateCinemaForm({
  cities,
  type,
  children,
  className,
}: CreateCinemaFormProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [comboBoxOpen, setComboBoxOpen] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>("");

  const queryClient = useQueryClient();
  const session = useSession();
  const router = useRouter();

  const form = useZodForm({
    schema: CreateCinemaSchema,
    defaultValues: {
      id: "",
      name: "",
      city: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: CreateCinemaType) => {
      const result = await createCinemaAction(values);
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
      toast.success("Cinema created successfully");
      form.reset();
      setOpen(false);
      router.refresh();
    },
    // mutationKey: ["cities"],
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast.error(
        error.message || "An error occurred while creating the cinema",
      );
    },
  });

  if (!session.data?.user) {
    toast.error("User not found");
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        <Button
          variant={type === "icon" || type === "simple" ? "outline" : "ghost"}
          size={"sm"}
          className={cn(
            type === "icon"
              ? cn("flex justify-between bg-orange-500 mr-2", className)
              : cn("flex w-full items-center justify-start text-sm", className),
          )}
        >
          {type === "icon" ? (
            <AddButtonStyle.icon className={cn("size-auto")} />
          ) : type === "simple" ? (
            <AddButtonStyle.simple className={cn("size-auto")} />
          ) : (
            <div className="flex w-full items-center justify-between">
              <span>Create</span>
              <span className="text-xs">⌘e</span>
            </div>
          )}
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="p-2">
          <DialogTitle className="flex items-center gap-2">
            <ListPlus className="size-5" />
            Nouveau cinéma
          </DialogTitle>
          <DialogDescription>
            Pour ajouter une nouveau cinéma, veuillez remplir tous les champs.
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
                            value={field.value || ""}
                            // onChange={(e) => setTitle(e.target.value)}
                            onChange={(e) => {
                              field.onChange(e);
                              // form.setValue("title", e.target.value);
                              setTitle(e.target.value);
                            }}
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
              {mutation.isPending ? <LoaderCircle /> : "Ajouter"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
