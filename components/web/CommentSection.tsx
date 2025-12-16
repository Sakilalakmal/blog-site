"use client";

import { Loader2Icon, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentSchema } from "@/schemas/comment";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { z } from "zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

export function CommentSection(props: {
  preloadedComments: Preloaded<typeof api.comment.getCommentsForPost>;
}) {
  const params = useParams<{ blogId: Id<"posts"> }>();
  const data = usePreloadedQuery(props.preloadedComments);
  const [isPending, startTransition] = useTransition();

  const createCommentMutation = useMutation(api.comment.createComment);
  const form = useForm({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      body: "",
      postId: params.blogId,
    },
  });

  async function onSubmit(values: z.infer<typeof CommentSchema>) {
    startTransition(async () => {
      try {
        await createCommentMutation(values);
        form.reset();
        toast.success("Comment added successfully!");
      } catch (error) {
        console.error("Error creating comment:", error);
        toast.error("Failed to add comment. Please try again.");
      }
    });
  }

  if (data === undefined) {
    return <div>Loading...</div>;
  }
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 border-b">
        <MessageSquare className="size-4" />
        <h2 className="text-xl font-bold">{data.length} comments</h2>
      </CardHeader>
      <CardContent className="space-y-8">
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>write a comment</FieldLabel>
                <Textarea
                  aria-invalid={fieldState.invalid}
                  placeholder="share you thoughts..."
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button disabled={isPending}>
            {isPending ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Comment"
            )}
          </Button>
        </form>

        {data?.length > 0 && <Separator />}
        <section className="space-y-6">
          {data?.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar className="size-10 shrink-0">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${comment.authorName}`}
                  alt={comment.authorName}
                />
                <AvatarFallback>
                  {comment.authorName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{comment.authorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment._creationTime).toLocaleString("en-US")}
                  </p>
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {comment.body}
                </p>
              </div>
            </div>
          ))}
        </section>
      </CardContent>
    </Card>
  );
}
