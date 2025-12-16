import { Id } from "@/convex/_generated/dataModel";
import z from "zod";

export const CommentSchema = z.object({
  body: z.string().min(1,{message: "Comment cannot be empty"}).max(500),
  postId: z.custom<Id<"posts">>(),
});
