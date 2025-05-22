"use client";
import { DotPending } from "@/components/svg/dot-pending";
import { Button } from "@/components/ui/button";
import { Form, useZodForm } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import type { CineSession } from "../../data/schema";
import { createCineSessionAction } from "../create-cineSession.action";

export const DuplicateCineSessionSchema = z.object({
  movieId: z.string(),
  hallId: z.string(),
  sessionStart: z.coerce.date(),
  sessionEnd: z.coerce.date(),
  date: z.coerce.date(),
  cineId: z.string(),
  note: z.preprocess((val) => Number(val), z.number()),
  pricing: z.preprocess((val) => Number(val), z.number()),
  userId: z.string(),
});

export type DuplicateCineSessionType = z.infer<
  typeof DuplicateCineSessionSchema
>;

export type DuplicateCineSessionProps<TData extends CineSession> = {
  row: Row<TData>;
  className?: string;
};

export function DuplicateCineSession<TData extends CineSession>({
  row,
  className,
}: DuplicateCineSessionProps<TData>) {
  const queryClient = useQueryClient();
  const session = useSession();
  const router = useRouter();

  const form = useZodForm({
    schema: DuplicateCineSessionSchema,
    defaultValues: {
      movieId: row.original.movieId,
      hallId: row.original.hallId,
      sessionStart: row.original.sessionStart,
      sessionEnd: row.original.sessionEnd,
      date: row.original.date,
      cineId: row.original.cineId,
      note: row.original.note,
      pricing: row.original.pricing,
      userId: session.data?.user?.id ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: DuplicateCineSessionType) => {
      const result = await createCineSessionAction(values);

      if (result?.serverError) {
        toast.error(result.serverError);
        return;
      }
      return result;
    },
    // onSuccess: () => {
    //   toast.success("Cinema duplicated successfully");
    //   router.refresh();
    // },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cineSessions"] });
      toast.success("CineSession duplicated successfully");
      form.reset();
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "An error occurred while duplicating the cineSession",
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
        className={cn(
          "flex w-full items-center justify-start text-sm",
          className,
        )}
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
