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
import { Film, Theater, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";
import { z } from "zod";
import type { Hall } from "../data/schema";
import { deleteManyHallsAction } from "./delete-hall.action";

export const DeleteManyHallsSchema = z.array(
  z.object({
    id: z.string().min(1, { message: "Hall ID is required" }),
    hallNumber: z.preprocess((val) => Number(val), z.number()),
    userId: z.string(),
  }),
);

export type DeleteManyHallsType = z.infer<typeof DeleteManyHallsSchema>;

type ActionResult =
  | { success: true; serverError?: never }
  | { success?: never; serverError: string };

export type DeleteHallsProps<TData> = {
  halls: Hall[];
  table?: TableOrigin<TData>;
  className?: string;
};

export function DeleteManyHalls<TData>({
  halls,
  table,
  className,
}: DeleteHallsProps<TData>) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [rowChecked, setRowChecked, removeRowChecked] = useLocalStorage<Hall[]>(
    "rowChecked",
    [],
  );
  // const [dot, setDot, removeDot] = useLocalStorage("dotColor", true);
  const queryClient = useQueryClient();
  const session = useSession();
  const router = useRouter();

  const dataToDelete = rowChecked.map((hall) => ({
    id: hall.id,
    hallNumber: hall.hallNumber,
    userId: session.data?.user?.id ?? "",
  }));

  const form = useZodForm({
    schema: DeleteManyHallsSchema,
    values: dataToDelete,
  });

  const mutation = useMutation({
    mutationFn: async (values: DeleteManyHallsType) => {
      const result = (await deleteManyHallsAction(values)) as ActionResult;

      if (result.serverError) {
        // toast.error(result.serverError);
        throw new Error(result.serverError);
      }
      return values;
    },
    // onSuccess: async (deletedHalls) => {
    //   setOpen(false);
    //   removeRowChecked();
    //   if (table) {
    //     table.toggleAllPageRowsSelected(false);
    //   }
    //   form.reset();
    //   await queryClient.invalidateQueries({ queryKey: ["halls"] });
    //   // router.refresh();
    //   toast.success("Halls deleted successfully");
    // },
    onSettled: async () => {
      setOpen(false);
      removeRowChecked();
      if (table) {
        table.toggleAllPageRowsSelected(false);
      }
      form.reset();
      await queryClient.invalidateQueries({ queryKey: ["halls"] });
      toast.success("Hall created successfully");
      // router.refresh();
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast.error(
        error.message || "An error occurred while deleting the halls",
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

  const rowCheckedIds = rowChecked.map((hall) => hall.id);
  const selectedCities = halls
    .filter((hall) => rowCheckedIds.includes(hall.id))
    .sort((a, b) => a.identifier.localeCompare(b.identifier));

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          size={"sm"}
          className="mr-2 flex w-full items-center justify-start text-sm"
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
                      <Theater
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
                  {rowChecked.length} {rowChecked.length > 1 ? "halls" : "hall"}
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
            <span>Delete halls</span>
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
              Are you sure to delete these halls ?
            </div>
            <div className="flex flex-col gap-1 rounded-lg border border-muted p-4">
              <div className="flex">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-start">Halls</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <ScrollArea className="h-1/2 md:h-72">
                      {selectedCities.length > 0 ? (
                        selectedCities.map((hall) => (
                          <TableRow
                            key={hall.id}
                            className="flex items-center gap-1 text-sm"
                          >
                            <div className="flex w-28 items-center justify-start">
                              <TableCell className="w-28 bg-zinc-900/50 py-2 text-start text-zinc-500">
                                {hall.identifier}
                              </TableCell>
                            </div>
                            <TableCell className="py-2 font-medium">
                              {/* <CircleDot
                                className={cn(itemStyle(movie.priority), "h-4")}
                              /> */}
                            </TableCell>
                            <div className="flex w-full items-center justify-between gap-1">
                              <TableCell className="flex items-center justify-start py-2 font-medium">
                                {hall.hallNumber}
                              </TableCell>
                              {/* <TableCell className="flex w-28 items-center justify-end py-2">
                                <Badge
                                  variant={"outline"}
                                  className="font-light text-zinc-400"
                                >
                                  {daysRemaining(
                                    movie.dueOfDate as Date,
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
                            No halls found
                          </TableCell>
                        </TableRow>
                      )}
                    </ScrollArea>
                  </TableBody>
                </Table>
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
