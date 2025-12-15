"use client";

import { createBlogAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { blogSchema } from "@/schemas/blog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function CreateBlogPage() {
  const [isPending, startTransition] = useTransition();
  const mutation = useMutation(api.posts.createBlogPost);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  function onSubmit(values: z.infer<typeof blogSchema>) {
    console.log(values);
    startTransition(async () => {
      await createBlogAction(values);
      toast.success("Blog post created successfully!");
      form.reset();
    });
  }

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Create post
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Create your own blog post
        </p>
      </div>
      <Card className="w-full mw-xl mx-auto">
        <CardHeader>
          <CardTitle>Create Blog Page</CardTitle>
          <CardDescription>
            create a new blog article and share your blogs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-y-4">
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>title</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="enter the title of the blog"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>content</FieldLabel>
                    <Textarea
                      aria-invalid={fieldState.invalid}
                      placeholder="super exciting blog content"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <Button className="w-full mt-4" disabled={isPending}>
              {isPending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                "Create blog"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
