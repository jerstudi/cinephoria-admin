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
import { MultiSelect } from "@/components/ui/multiselect";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { type AddButton, AddButtonStyle } from "@/features/cinephoria/types";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ListPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { createMovieAction } from "./create-movie.action";

const movieGenders = [
  { value: "action", label: "Action" },
  { value: "aventure", label: "Aventure" },
  { value: "animation", label: "Animation" },
  { value: "comedie", label: "Comédie" },
  { value: "drame", label: "Drame" },
  { value: "fantastique", label: "Fantastique" },
  { value: "horreur", label: "Horreur" },
  { value: "romance", label: "Romance" },
  { value: "science-fiction", label: "Science-fiction" },
  { value: "thriller", label: "Thriller" },
] as const;

export const CreateMovieSchema = z.object({
  title: z.string().min(1, " Title is required"),
  poster: z.string(),
  description: z.string(),
  actors: z.string(),
  directors: z.string(),
  musicComposer: z.string(),
  synopsis: z.string(),
  movieDate: z
    .number()
    .min(1900, "L'année doit être supérieure à 1900")
    .max(new Date().getFullYear(), "L'année ne peut pas être dans le futur"),
  gender: z.string(),
  ageLimit: z.preprocess((val) => Number(val), z.number()),
  duration: z.preprocess((val) => Number(val), z.number()),
  favorite: z.boolean().default(false),
  active: z.boolean().default(true),
});

export type CreateMovieType = z.infer<typeof CreateMovieSchema>;

type CreateMovieFormProps = {
  type?: AddButton;
  children?: React.ReactNode;
  className?: string;
};

export function CreateMovieForm({
  type,
  children,
  className,
}: CreateMovieFormProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>("");

  const queryClient = useQueryClient();
  const session = useSession();
  const router = useRouter();

  const form = useZodForm({
    schema: CreateMovieSchema,
    defaultValues: {
      title: "",
      poster: "",
      description: "",
      actors: "",
      directors: "",
      musicComposer: "",
      synopsis: "",
      movieDate: 1900,
      gender: "",
      ageLimit: 0,
      duration: 0,
      favorite: false,
      active: true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: CreateMovieType) => {
      const result = await createMovieAction(values);
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
      await queryClient.invalidateQueries({ queryKey: ["movies"] });
      toast.success("Movie created successfully");
      form.reset();
      setOpen(false);
      router.refresh();
    },
    // mutationKey: ["movies"],
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast.error(
        error.message || "An error occurred while creating the movie",
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
            Nouveau film
          </DialogTitle>
          <DialogDescription>
            Pour ajouter un nouveau film à la programmation en salle, veuillez
            remplir tous les champs.
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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Title
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg group-hover:bg-muted">
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Entrez le titre du film"
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
                name="poster"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Affiche
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg group-hover:bg-muted">
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Indiquez l'url de l'affiche du film"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Description
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg group-hover:bg-muted">
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Description courte..."
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
                name="actors"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Acteurs
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg group-hover:bg-muted">
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Indiquez les principaux acteurs séparés par une virgule"
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
                name="directors"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Direction
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg group-hover:bg-muted">
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Indiquez les principaux directeurs séparés par une virgule"
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
                name="musicComposer"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Compositeur
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg group-hover:bg-muted">
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Indiquez le compositeur de la bande originale"
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
                name="synopsis"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Sinopsis
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg group-hover:bg-muted">
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Sinopsis du film..."
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
                name="movieDate"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Date de production
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg">
                        <FormControl>
                          <select
                            {...field}
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            className="rounded-lg border-none px-4 py-2 text-sm text-muted-foreground"
                          >
                            <option value="">Sélectionnez une année</option>
                            {Array.from(
                              { length: 125 },
                              (_, i) => new Date().getFullYear() - i,
                            ).map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Genres
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg">
                        <FormControl>
                          <MultiSelect
                            placeholder="Sélectionnez les genres..."
                            selected={field.value ? field.value.split(",") : []}
                            onChange={(values) => {
                              field.onChange(values.join(","));
                            }}
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
                name="ageLimit"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Âge limite
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg group-hover:bg-muted">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Âge limite"
                            {...field}
                            value={field.value as number}
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
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Durée du film
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg group-hover:bg-muted">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Durée du film (en minutes, ex: 120)"
                            {...field}
                            value={field.value as number}
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
                name="favorite"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Favoris
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
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
                name="active"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Film activé
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
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
