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

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type AddButton } from "@/features/cinephoria/types";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import { ListPlus, SquarePen } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";
import type { City } from "../data/schema";
import { updateCityAction } from "./update-city.action";

export const UpdateCitySchema = z.object({
  id: z.string(),
  name: z.string(),
  cp: z.preprocess((val) => Number(val), z.number()),
  country: z.string(),
  region: z.string(),
});

export type UpdateCityType = z.infer<typeof UpdateCitySchema>;

export type DataTableCityUpdateProps<TData extends City> = {
  row: Row<TData>;
  type?: AddButton;
  children?: React.ReactNode;
  isDialogOpen?: boolean;
  icon?: boolean;
  className?: string;
  onClose?: () => void;
};

export function UpdateCityForm<TData extends City>({
  row,
  type,
  children,
  isDialogOpen,
  icon = false,
  className,
  onClose,
}: DataTableCityUpdateProps<TData>) {
  const [open, setOpen] = React.useState<boolean>(isDialogOpen ?? false);

  const queryClient = useQueryClient();
  const session = useSession();
  const router = useRouter();

  const cityData = row.original;

  const form = useZodForm({
    schema: UpdateCitySchema,
    defaultValues: {
      id: cityData.id,
      name: cityData.name,
      cp: cityData.cp,
      country: cityData.country,
      region: cityData.region,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: UpdateCityType) => {
      const result = await updateCityAction(values);
      if (result?.serverError) {
        toast.error(result.serverError);
        return;
      }
    },
    // onSuccess: async () => {
    //   toast.success("City updated successfully");
    //   form.reset();
    //   setOpen(false);
    //   // await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    //   router.refresh();
    // },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["halls"] });
      toast.success("City updated successfully");
      form.reset();
      setOpen(false);
      onClose?.();
      router.refresh();
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast.error(error.message || "An error occurred while updating the city");
    },
  });

  if (!session.data?.user) {
    toast.error("User not found");
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant={icon ? "ghost" : "ghost"}
                size={"sm"}
                className={cn(
                  icon
                    ? cn("flex justify-between mr-2", className)
                    : cn(
                        "flex w-full items-center justify-start text-sm",
                        className,
                      ),
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
          </TooltipTrigger>
          {icon && (
            <TooltipContent>
              <p>Edit city</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="p-2">
          <DialogTitle className="flex items-center gap-2">
            <ListPlus className="size-5" />
            Modifier la ville
          </DialogTitle>
          <DialogDescription>
            Modifier les informations de cette ville
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Name
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg group-hover:bg-muted">
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Entrez le nom de la ville"
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
                name="cp"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        CP
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg group-hover:bg-muted">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Indiquez le code postal"
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
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Pays
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg group-hover:bg-muted">
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Entrez le nom du pays"
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
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <div className="group flex items-center gap-4">
                      <FormLabel className="w-1/5 text-muted-foreground">
                        Région
                      </FormLabel>
                      <div className="w-full flex-col gap-2 rounded-lg group-hover:bg-muted">
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Indiquez la région"
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
