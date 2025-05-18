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
import { hallTypes } from "../data/data";
import { createHallAction } from "./create-hall.action";

export const CreateHallSchema = z.object({
  hallNumber: z.preprocess((val) => Number(val), z.number()),
  type: z.string(),
  capacity: z.preprocess((val) => Number(val), z.number()),
  disabled_places: z.preprocess((val) => Number(val), z.number()),
});

export type CreateHallType = z.infer<typeof CreateHallSchema>;

type CreateHallFormProps = {
  type?: AddButton;
  children?: React.ReactNode;
  className?: string;
};

export function CreateHallForm({
  type,
  children,
  className,
}: CreateHallFormProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [comboBoxOpen, setComboBoxOpen] = React.useState<boolean>(false);
  const [valueSelected, setValueSelected] = React.useState<string>("");

  const queryClient = useQueryClient();
  const session = useSession();
  const router = useRouter();

  const form = useZodForm({
    schema: CreateHallSchema,
    defaultValues: {
      hallNumber: 0,
      type: "",
      capacity: 0,
      disabled_places: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: CreateHallType) => {
      const result = await createHallAction(values);
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
      toast.success("Hall created successfully");
      form.reset();
      setOpen(false);
      router.refresh();
    },
    // mutationKey: ["cities"],
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast.error(error.message || "An error occurred while creating the hall");
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
            Nouvelle salle
          </DialogTitle>
          <DialogDescription>
            Pour ajouter une nouvelle salle, veuillez remplir tous les champs.
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
                            value={field.value || ""}
                            // onChange={(e) => setTitle(e.target.value)}
                            onChange={(e) => {
                              field.onChange(e);
                              // form.setValue("title", e.target.value);
                              // setTitle(e.target.value);
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
                            value={field.value || ""}
                            // onChange={(e) => setTitle(e.target.value)}
                            onChange={(e) => {
                              field.onChange(e);
                              // form.setValue("title", e.target.value);
                              // setTitle(e.target.value);
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
                            value={field.value || ""}
                            // onChange={(e) => setTitle(e.target.value)}
                            onChange={(e) => {
                              field.onChange(e);
                              // form.setValue("title", e.target.value);
                              // setTitle(e.target.value);
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
