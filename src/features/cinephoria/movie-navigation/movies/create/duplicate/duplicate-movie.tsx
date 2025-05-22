/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { DotPending } from "@/components/svg/dot-pending";
import { Button } from "@/components/ui/button";
import { Form, useZodForm } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import type { Movie } from "../../data/schema";
import { createMovieAction } from "../create-movie.action";

export const DuplicateMovieSchema = z.object({
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
  userId: z.string(),
});

export type DuplicateMovieType = z.infer<typeof DuplicateMovieSchema>;

export type DuplicateMovieProps<TData extends Movie> = {
  row: Row<TData>;
  className?: string;
};

export function DuplicateMovie<TData extends Movie>({
  row,
  className,
}: DuplicateMovieProps<TData>) {
  const queryClient = useQueryClient();
  const session = useSession();
  const router = useRouter();

  const form = useZodForm({
    schema: DuplicateMovieSchema,
    defaultValues: {
      title: row.original.title,
      poster: row.original.poster,
      description: row.original.description,
      actors: row.original.actors,
      directors: row.original.directors,
      musicComposer: row.original.musicComposer,
      synopsis: row.original.synopsis,
      movieDate: row.original.movieDate,
      gender: row.original.gender,
      ageLimit: row.original.ageLimit,
      duration: row.original.duration,
      favorite: row.original.favorite,
      active: row.original.active,
      userId: session.data?.user?.id ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: DuplicateMovieType) => {
      const result = await createMovieAction(values);

      if (result?.serverError) {
        toast.error(result.serverError);
        return;
      }
      return result;
    },
    // onSuccess: () => {
    //   toast.success("Movie duplicated successfully");
    //   router.refresh();
    // },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["movies"] });
      toast.success("Movie duplicated successfully");
      form.reset();
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "An error occurred while duplicating the movie",
      );
    },
  });

  if (!session.data?.user) {
    toast.error("User not found");
    return null;
  }

  return (
    <Form
      form={form}
      onSubmit={async (v) => {
        await mutation.mutateAsync(v);
      }}
    >
      <Button
        type="submit"
        disabled={mutation.isPending}
        variant={"ghost"}
        size={"sm"}
        className="flex w-full items-center justify-start text-sm"
      >
        {mutation.isPending ? (
          <span className="inline-flex items-end gap-1">
            Duplicating
            <DotPending />
          </span>
        ) : (
          <div className="flex w-full items-center justify-between">
            <span>Duplicate</span>
            <span className="text-xs">⌘d</span>
          </div>
        )}
      </Button>
    </Form>
  );
}
