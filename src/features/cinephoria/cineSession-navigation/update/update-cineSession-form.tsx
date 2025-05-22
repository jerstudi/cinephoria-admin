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
import type { Halls } from "../../halls-navigation/data/schema";
import type { Movie } from "../../movie-navigation/movies/data/schema";
import type { CineSession } from "../data/schema";
import { updateCineSessionAction } from "./update-cineSession.action";

export const UpdateCineSessionSchema = z.object({
  id: z.string(),
  movieId: z.string(),
  hallId: z.string(),
  sessionStart: z.coerce.date(),
  sessionEnd: z.coerce.date(),
  date: z.coerce.date(),
  cineId: z.string(),
  note: z.preprocess((val) => Number(val), z.number()),
  pricing: z.preprocess((val) => Number(val), z.number()),
});

export type UpdateCineSessionType = z.infer<typeof UpdateCineSessionSchema>;

type UpdateCineSessionFormProps<TData extends CineSession> = {
  row: Row<TData>;
  type?: AddButton;
  children?: React.ReactNode;
  isDialogOpen?: boolean;
  icon?: boolean;
  className?: string;
  onClose?: () => void;
};

export function UpdateCineSessionForm<TData extends CineSession>({
  row,
  type,
  children,
  isDialogOpen,
  icon = false,
  className,
  onClose,
}: UpdateCineSessionFormProps<TData>) {
  const [open, setOpen] = React.useState<boolean>(isDialogOpen ?? false);
  const [comboBoxOpen, setComboBoxOpen] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>("");

  const queryClient = useQueryClient();
  const session = useSession();
  const router = useRouter();

  const halls = queryClient.getQueryData<Halls>(["halls"]) ?? {
    hall: [],
    cinema: [],
  };
  const movies = queryClient.getQueryData<Movie[]>(["movies"]) ?? [];

  // const hallsData = halls.hall.map((hall) => hall.hallNumber);
  // const moviesData = movies.map((movie) => movie.title);

  const cineSessionData = row.original;

  const form = useZodForm({
    schema: UpdateCineSessionSchema,
    defaultValues: {
      id: cineSessionData.id,
      movieId: cineSessionData.movieId,
      hallId: cineSessionData.hallId,
      sessionStart: new Date(cineSessionData.sessionStart),
      sessionEnd: new Date(cineSessionData.sessionEnd),
      date: new Date(cineSessionData.date),
      cineId: cineSessionData.cineId,
      note: cineSessionData.note,
      pricing: cineSessionData.pricing,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: UpdateCineSessionType) => {
      // Les dates sont déjà en UTC grâce au DatetimePicker
      const utcValues = {
        ...values,
        sessionStart: values.sessionStart,
        sessionEnd: values.sessionEnd,
        date: values.date,
      };

      const result = await updateCineSessionAction(utcValues);
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
      toast.success("Cine Session updated successfully");
      form.reset();
      setOpen(false);
      router.refresh();
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast.error(
        error.message || "An error occurred while updating the cineSession",
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
          variant={icon ? "ghost" : "ghost"}
          size={"sm"}
          className={cn(
            icon
              ? cn("flex justify-between mr-2", className)
              : cn("flex w-full items-center justify-start text-sm", className),
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
      <DialogContent className="max-w-3xl">
        <DialogHeader className="p-2">
          <DialogTitle className="flex items-center gap-2">
            <ListPlus className="size-5" />
            Update Session
          </DialogTitle>
          <DialogDescription>
            Pour modifier une session de cinéma, veuillez remplir tous les
            champs.
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
