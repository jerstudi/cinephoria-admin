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
import type { Cinema } from "../../data/schema";
import { createCinemaAction } from "../create-cinema.actions";

export const DuplicateCinemaSchema = z.object({
  name: z.string(),
  city: z.string(),
  userId: z.string(),
});

export type DuplicateCinemaType = z.infer<typeof DuplicateCinemaSchema>;

export type DuplicateCityProps<TData extends Cinema> = {
  row: Row<TData>;
  className?: string;
};

export function DuplicateCinema<TData extends Cinema>({
  row,
  className,
}: DuplicateCityProps<TData>) {
  const queryClient = useQueryClient();
  const session = useSession();
  const router = useRouter();

  const form = useZodForm({
    schema: DuplicateCinemaSchema,
    defaultValues: {
      name: row.original.name,
      city: row.original.city,
      userId: session.data?.user?.id ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: DuplicateCinemaType) => {
      const result = await createCinemaAction(values);

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
      await queryClient.invalidateQueries({ queryKey: ["halls"] });
      toast.success("Cinema duplicated successfully");
      form.reset();
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "An error occurred while duplicating the cinema",
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
