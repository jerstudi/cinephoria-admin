/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Table as TableOrigin } from "@tanstack/react-table";
import { Film, Projector, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";
import { z } from "zod";
import type { CineSession } from "../data/schema";
import { deleteManyCineSessionsAction } from "./delete-cineSession.actions";

export const DeleteManyCineSessionsSchema = z.array(
  z.object({
    id: z.string().min(1, { message: "CineSession ID is required" }),
    name: z.string().optional(),
    userId: z.string(),
  }),
);

export type DeleteManyCineSessionsType = z.infer<
  typeof DeleteManyCineSessionsSchema
>;

type ActionResult =
  | { success: true; serverError?: never }
  | { success?: never; serverError: string };

export type DeleteCineSessionsProps<TData> = {
  cineSessions: CineSession[];
  table?: TableOrigin<TData>;
  className?: string;
};

export function DeleteManyCineSessions<TData>({
  cineSessions,
  table,
  className,
}: DeleteCineSessionsProps<TData>) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [rowChecked, setRowChecked, removeRowChecked] = useLocalStorage<
    CineSession[]
  >("rowChecked", []);
  // const [dot, setDot, removeDot] = useLocalStorage("dotColor", true);
  const session = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  const dataToDelete = rowChecked.map((cineSession) => ({
    id: cineSession.id,
    name: cineSession.movie?.title ?? cineSession.identifier,
    userId: session.data?.user?.id ?? "",
  }));

  const form = useZodForm({
    schema: DeleteManyCineSessionsSchema,
    values: dataToDelete,
  });

  const mutation = useMutation({
    mutationFn: async (values: DeleteManyCineSessionsType) => {
      const result = (await deleteManyCineSessionsAction(
        values,
      )) as ActionResult;

      if (result.serverError) {
        // toast.error(result.serverError);
        throw new Error(result.serverError);
      }
      return values;
    },
    onSuccess: async (deletedMovies) => {
      setOpen(false);
      removeRowChecked();
      if (table) {
        table.toggleAllPageRowsSelected(false);
      }
      form.reset();
      await queryClient.invalidateQueries({ queryKey: ["cineSessions"] });
      toast.success("CineSessions deleted successfully");
      router.refresh();
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast.error(
        error.message || "An error occurred while deleting the sessions",
      );
      setOpen(false);
      removeRowChecked();
      if (table) {
        table.toggleAllPageRowsSelected(false);
      }
    },
  });

  if (!session.data?.user) {
    toast.error("User not found");
    return null;
  }

  const rowCheckedIds = rowChecked.map((cineSession) => cineSession.id);
  const selectedCineSessions = cineSessions
    .filter((cineSession) => rowCheckedIds.includes(cineSession.id))
    .sort((a, b) => a.identifier.localeCompare(b.identifier));

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          size={"sm"}
          className={cn(
            "mr-2 flex w-full items-center justify-start text-sm",
            className,
          )}
        >
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex w-full items-center justify-between gap-2">
              <div
                className="relative flex grow items-center"
                style={{
                  width: `${18 + rowChecked.slice(0, 3).length}px`,
                }}
              >
                {rowChecked.length > 0 &&
                  rowChecked.slice(0, 3).map((row, idx) => (
                    <span
                      key={row.id}
                      className={cn("absolute")}
                      style={{ left: `${idx * 5}px` }}
                    >
                      <Projector
                        className={cn(
                          // itemStyle(row.priority),
                          "size-3 bg-zinc-700 p-[2px] rounded-sm",
                        )}
                      />
                    </span>
                  ))}
                <Film className="size-4" />
              </div>
              <div className="flex items-center">
                <span className="text-xs font-light text-zinc-300">
                  {rowChecked.length}{" "}
                  {rowChecked.length > 1 ? "sessions" : "session"}
                </span>
              </div>
            </div>
            <div>
              <Trash2 className="size-3" />
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[96vw] max-w-fit rounded-lg lg:min-w-[680px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="size-5 text-zinc-300" />
            <span>Delete cities</span>
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
              Are you sure to delete these sessions ?
            </div>
            <div className="flex flex-col gap-1 rounded-lg border border-muted p-4">
              <ScrollArea className="h-1/2 md:h-72">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-start">CineSessions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCineSessions.length > 0 ? (
                      selectedCineSessions.map((cineSession) => (
                        <TableRow
                          key={cineSession.id}
                          className="flex items-center gap-1 text-sm"
                        >
                          <div className="flex w-40 items-center justify-start">
                            <TableCell className="w-40 bg-zinc-900/50 py-2 text-start text-zinc-500">
                              {cineSession.identifier}
                            </TableCell>
                          </div>
                          <TableCell className="py-2 font-medium">
                            {/* <CircleDot
                                className={cn(itemStyle(movie.priority), "h-4")}
                              /> */}
                          </TableCell>
                          <div className="flex w-full items-center justify-between gap-1">
                            <TableCell className="flex items-center justify-start py-2 font-medium">
                              {cineSession.movie?.title}
                            </TableCell>
                            {/* <TableCell className="flex w-28 items-center justify-end py-2">
                                <Badge
                                  variant={"outline"}
                                  className="font-light text-zinc-400"
                                >
                                  {daysRemaining(
                                    cineSession.dueOfDate as Date,
                                    new Date(),
                                  )}
                                </Badge>
                              </TableCell> */}
                          </div>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">
                          No sessions found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </div>
          <DialogFooter className="mt-10 sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  form.reset();
                  removeRowChecked();
                  table?.toggleAllPageRowsSelected(false);
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
              {mutation.isPending ? <LoaderCircle /> : "Delete All"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
