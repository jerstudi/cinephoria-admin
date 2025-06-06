/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { env } from "@/lib/env";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { contactSupportAction } from "./contact-support.action";
import type { ContactSupportSchemaType } from "./contact-support.schema";
import { ContactSupportSchema } from "./contact-support.schema";

type ContactSupportDialogProps = PropsWithChildren;

export const ContactSupportDialog = (props: ContactSupportDialogProps) => {
  const [open, setOpen] = useState(false);
  const session = useSession();
  const email = session.data?.user ? (session.data.user.email ?? "") : "";
  const form = useZodForm({
    schema: ContactSupportSchema,
    defaultValues: {
      email: email,
    },
  });

  const onSubmit = async (values: ContactSupportSchemaType) => {
    const result = await contactSupportAction(values);

    if (!result?.data) {
      toast.error(result?.serverError);
      return;
    }

    toast.success("Your message has been sent.");
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        {props.children ? (
          props.children
        ) : (
          <Button variant="outline">Contact support</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact Support</DialogTitle>
          <DialogDescription>
            Fill the form bellow or send an email to{" "}
            <Link
              className="text-primary"
              href={`mailto:${env.NEXT_PUBLIC_EMAIL_CONTACT}`}
            >
              {env.NEXT_PUBLIC_EMAIL_CONTACT}
            </Link>
            .
          </DialogDescription>
        </DialogHeader>
        <Form
          form={form}
          onSubmit={async (v) => onSubmit(v)}
          className="flex flex-col gap-4"
        >
          {email ? null : (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Send</Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
