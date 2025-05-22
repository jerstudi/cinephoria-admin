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
import { Form, useZodForm } from "@/components/ui/form";
import { LoaderCircle } from "@/components/ui/loader-circle";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Row } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";
import type { CineSession } from "../data/schema";
import { deleteCineSessionAction } from "./delete-cineSession.actions";

export const DeleteCineSessionSchema = z.object({
  id: z.string().min(1, { message: "CineSession ID is required" }),
  name: z.string().optional(),
  userId: z.string(),
});

export type DeleteCineSessionType = z.infer<typeof DeleteCineSessionSchema>;

export type DeleteCineSessionProps<TData extends CineSession> = {
  cineSession: Row<TData>;
  className?: string;
};

export function DeleteCineSessionForm<TData extends CineSession>({
  cineSession,
  className,
}: DeleteCineSessionProps<TData>) {
  const [open, setOpen] = React.useState<boolean>(false);
  // const [name, setName] = React.useState<string>("");

  const queryClient = useQueryClient();
  const session = useSession();
  const router = useRouter();

  const form = useZodForm({
    schema: DeleteCineSessionSchema,
    defaultValues: {
      id: cineSession.original.id,
      name:
        cineSession.original.movie?.title ?? cineSession.original.identifier,
      userId: session.data?.user?.id ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: DeleteCineSessionType) => {
      const result = await deleteCineSessionAction(values);
      if (result?.serverError) {
        toast.error(result.serverError);
        return;
      }
    },
    // onSuccess: () => {
    //   toast.success("Cinema deleted successfully");
    //   form.reset();
    //   setOpen(false);
    //   router.refresh();
    // },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cineSessions"] });
      toast.success("Session deleted successfully");
      form.reset();
      setOpen(false);
      router.refresh();
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast.error(
        error.message || "An error occurred while deleting the session",
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
          variant={"ghost"}
          size={"sm"}
          className={cn(
            "flex w-full items-center justify-start text-sm",
            className,
          )}
        >
          <div className="flex w-full items-center justify-between">
            <span>Delete</span>
            <span className="text-xs">⌘⌫</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="size-5 text-zinc-300" />
            <span>Delete session</span>
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form
          form={form}
          onSubmit={async (v) => {
            await mutation.mutateAsync(v);
          }}
        >
          <div className="flex w-full flex-col gap-4">
            <div className="font-semibold">
              Are you sure to delete this session ?
            </div>
            <div className="flex flex-col gap-1 rounded-lg border border-muted p-4">
              <div className="flex items-center space-x-4">
                <span className="text-muted-foreground">
                  {cineSession.original.identifier}
                </span>
                <span>{cineSession.original.movie?.title ?? "No movie"}</span>
                {/* {status.icon && (
                  <status.icon className="mr-2 size-4 text-muted-foreground" />
                )} */}
                {/* <span>{movie.original.active}</span> */}
                {/* <span className="text-zinc-500">{statusWithIcon([movie])}</span>
                <span className="text-zinc-500">
                  {priorityWithIcon([movie])}
                </span> */}
              </div>
            </div>
          </div>
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
              variant={"destructive"}
              disabled={mutation.isPending}
              className="w-24"
            >
              {mutation.isPending ? <LoaderCircle /> : "Delete"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
