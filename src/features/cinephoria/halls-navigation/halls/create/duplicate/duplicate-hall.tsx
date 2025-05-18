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
import type { Hall } from "../../data/schema";
import { createHallAction } from "../create-hall.action";

export const DuplicateHallSchema = z.object({
  hallNumber: z.preprocess((val) => Number(val), z.number()),
  type: z.string(),
  capacity: z.preprocess((val) => Number(val), z.number()),
  disabled_places: z.preprocess((val) => Number(val), z.number()),
  userId: z.string(),
});

export type DuplicateHallType = z.infer<typeof DuplicateHallSchema>;

export type DuplicateHallProps<TData extends Hall> = {
  row: Row<TData>;
  className?: string;
};

export function DuplicateHall<TData extends Hall>({
  row,
  className,
}: DuplicateHallProps<TData>) {
  const queryClient = useQueryClient();
  const session = useSession();
  const router = useRouter();

  const form = useZodForm({
    schema: DuplicateHallSchema,
    defaultValues: {
      hallNumber: row.original.hallNumber,
      type: row.original.type,
      capacity: row.original.capacity,
      disabled_places: row.original.disabled_places,
      userId: session.data?.user?.id ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: DuplicateHallType) => {
      const result = await createHallAction(values);

      if (result?.serverError) {
        toast.error(result.serverError);
        return;
      }
      return result;
    },
    // onSuccess: () => {
    //   toast.success("Hall duplicated successfully");
    //   router.refresh();
    // },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["halls"] });
      toast.success("Hall duplicated successfully");
      form.reset();
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "An error occurred while duplicating the hall",
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
