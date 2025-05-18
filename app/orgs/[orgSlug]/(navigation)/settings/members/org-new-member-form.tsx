import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingButton } from "@/features/form/submit-button";
import { useMutation } from "@tanstack/react-query";
import { Mail, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { addUserInOrganizationAction } from "../org.action";

const Schema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["OWNER", "ADMIN", "MEMBER"]),
});

type SchemaType = z.infer<typeof Schema>;

export const OrganizationNewMemberForm = () => {
  const [open, setOpen] = React.useState(false);
  const form = useZodForm({
    schema: Schema,
    defaultValues: {
      name: "",
      email: "",
      role: "MEMBER",
    },
  });
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (values: SchemaType) => {
      const result = await addUserInOrganizationAction(values);

      if (!result || result.serverError) {
        toast.error(result?.serverError ?? "Failed to add member");
        return;
      }

      toast.success("New member added");
      setOpen(false);
      router.refresh();
    },
  });

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          <Mail className="mr-2" size={16} />
          Add a member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a member</DialogTitle>
        </DialogHeader>
        <Form
          form={form}
          onSubmit={async (v) => mutation.mutateAsync(v)}
          className="flex w-full flex-col items-end gap-4"
        >
          <div className="flex w-full flex-col justify-center gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ADMIN">ADMIN</SelectItem>
                      <SelectItem value="MEMBER">MEMBER</SelectItem>
                      <SelectItem value="CUSTOMER">INTERN</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
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
            <LoadingButton loading={mutation.isPending} type="submit">
              <Plus size={16} className="mr-2" />
              Add
            </LoadingButton>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
