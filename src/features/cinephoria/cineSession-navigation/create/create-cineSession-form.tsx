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
import { DatetimePicker } from "@/components/ui/datetime-picker";
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
import type { Halls } from "../../halls-navigation/data/schema";
import type { Movie } from "../../movie-navigation/movies/data/schema";
import { createCineSessionAction } from "./create-cineSession.action";

export const CreateCineSessionSchema = z.object({
  movieId: z.string(),
  hallId: z.string(),
  sessionStart: z.coerce.date(),
  sessionEnd: z.coerce.date(),
  date: z.coerce.date(),
  cineId: z.string(),
  note: z.preprocess((val) => Number(val), z.number()),
  pricing: z.preprocess((val) => Number(val), z.number()),
});

export type CreateCineSessionType = z.infer<typeof CreateCineSessionSchema>;

type CreateCineSessionFormProps = {
  movies: Movie[];
  halls: Halls;
  type?: AddButton;
  children?: React.ReactNode;
  className?: string;
};

export function CreateCineSessionForm({
  movies,
  halls,
  type,
  children,
  className,
}: CreateCineSessionFormProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [comboBoxOpen, setComboBoxOpen] = React.useState<boolean>(false);
  // const [title, setTitle] = React.useState<string>("");

  const queryClient = useQueryClient();
  const session = useSession();
  const router = useRouter();

  const form = useZodForm({
    schema: CreateCineSessionSchema,
    defaultValues: {
      movieId: "",
      hallId: "",
      sessionStart: new Date(),
      sessionEnd: new Date(),
      date: new Date(),
      cineId: "",
      note: 0,
      pricing: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: CreateCineSessionType) => {
      const utcValues = {
        ...values,
        sessionStart: values.sessionStart,
        sessionEnd: values.sessionEnd,
        date: values.date,
      };

      const result = await createCineSessionAction(utcValues);
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
      await queryClient.invalidateQueries({ queryKey: ["cineSessions"] });
      toast.success("Cine Session created successfully");
      form.reset();
      setOpen(false);
      router.refresh();
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast.error(
        error.message || "An error occurred while creating the cine session",
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
            Nouvelle Session
          </DialogTitle>
          <DialogDescription>
            Pour ajouter une nouvelle session de cinéma, veuillez remplir tous
            les champs.
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
                name="movieId"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Movie Title
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
                                    ? movies.find(
                                        (movie) => movie.id === field.value,
                                      )?.title
                                    : "Select movie..."}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search movie..."
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>No movie found</CommandEmpty>
                                  <CommandGroup>
                                    {movies.map((movie) => (
                                      <CommandItem
                                        key={movie.id}
                                        value={movie.id}
                                        onSelect={() => {
                                          form.setValue("movieId", movie.id);
                                          setComboBoxOpen(false);
                                        }}
                                      >
                                        {movie.title}
                                        <Check
                                          className={cn(
                                            "ml-auto size-4 shrink-0",
                                            movie.id === field.value
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
                name="hallId"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Salle
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
                                    ? halls.hall.find(
                                        (hall) => hall.id === field.value,
                                      )?.hallNumber
                                    : "Select hall..."}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search hall..."
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>No hall found</CommandEmpty>
                                  <CommandGroup>
                                    {halls.hall.map((hall) => (
                                      <CommandItem
                                        key={hall.id}
                                        value={hall.id}
                                        onSelect={() => {
                                          form.setValue("hallId", hall.id);
                                          setComboBoxOpen(false);
                                        }}
                                      >
                                        {hall.hallNumber}
                                        <Check
                                          className={cn(
                                            "ml-auto size-4 shrink-0",
                                            hall.id === field.value
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
                name="sessionStart"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Heure de début
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg">
                        <FormControl>
                          <DatetimePicker
                            value={field.value}
                            onChange={(date) => field.onChange(date)}
                            format={[[], ["hours", "minutes", "am/pm"]]}
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
                name="sessionEnd"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Heure de fin
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg">
                        <FormControl>
                          <DatetimePicker
                            value={field.value}
                            onChange={(date) => field.onChange(date)}
                            format={[[], ["hours", "minutes", "am/pm"]]}
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
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Date
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg">
                        <FormControl>
                          <DatetimePicker
                            value={field.value}
                            onChange={(date) => field.onChange(date)}
                            format={[["days", "months", "years"], []]}
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
                name="cineId"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Cinéma
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
                                    ? halls.cinema.find(
                                        (cinema) => cinema.id === field.value,
                                      )?.name
                                    : "Select cinema..."}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search cinema..."
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>No cinema found</CommandEmpty>
                                  <CommandGroup>
                                    {halls.cinema.map((cinema) => (
                                      <CommandItem
                                        key={cinema.id}
                                        value={cinema.id}
                                        onSelect={() => {
                                          form.setValue("cineId", cinema.id);
                                          setComboBoxOpen(false);
                                        }}
                                      >
                                        {cinema.name}
                                        <Check
                                          className={cn(
                                            "ml-auto size-4 shrink-0",
                                            cinema.id === field.value
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
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Note
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg group-hover:bg-muted">
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Note"
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
                name="pricing"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Prix
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="pricing"
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
