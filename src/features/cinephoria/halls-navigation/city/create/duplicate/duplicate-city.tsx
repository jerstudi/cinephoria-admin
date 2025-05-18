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
import type { City } from "../../data/schema";
import { createCityAction } from "../create-city.actions";

export const DuplicateCitySchema = z.object({
  name: z.string(),
  cp: z.preprocess((val) => Number(val), z.number()),
  country: z.string(),
  region: z.string(),
  userId: z.string(),
});

export type DuplicateCityType = z.infer<typeof DuplicateCitySchema>;

export type DuplicateCityProps<TData extends City> = {
  row: Row<TData>;
  className?: string;
};

export function DuplicateCity<TData extends City>({
  row,
  className,
}: DuplicateCityProps<TData>) {
  const queryClient = useQueryClient();
  const session = useSession();
  const router = useRouter();

  const form = useZodForm({
    schema: DuplicateCitySchema,
    defaultValues: {
      name: row.original.name,
      cp: row.original.cp,
      country: row.original.country,
      region: row.original.region,
      userId: session.data?.user?.id ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: DuplicateCityType) => {
      const result = await createCityAction(values);

      if (result?.serverError) {
        toast.error(result.serverError);
        return;
      }
      return result;
    },
    // onSuccess: () => {
    //   toast.success("City duplicated successfully");
    //   router.refresh();
    // },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["halls"] });
      toast.success("City duplicated successfully");
      form.reset();
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "An error occurred while duplicating the city",
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
