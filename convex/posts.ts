import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./auth";

// Create a new task with the given text
export const createBlogPost = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Unauthorized");
    }
    const blogArticle = await ctx.db.insert("posts", {
      title: args.title,
      content: args.content,
      authorId: user._id,
      imageStorageId: args.imageStorageId,
    });

    return blogArticle;
  },
});

export const getBlogPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect();
    return await Promise.all(
      posts.map(async (post) => {
        const resolveImageUrl =
          post.imageStorageId !== undefined
            ? await ctx.storage.getUrl(post.imageStorageId)
            : null;

        return {
          ...post,
          imageUrl: resolveImageUrl,
        };
      })
    );
  },
});

export const generateImageUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

export const getpostById = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const posts = await ctx.db.get(args.postId);

    if (!posts) {
      throw new ConvexError("Post not found");
    }

    const resolvedImageUrl = posts?.imageStorageId
      ? await ctx.storage.getUrl(posts.imageStorageId)
      : null;

    return {
      ...posts,
      imageUrl: resolvedImageUrl,
    };
  },
});
