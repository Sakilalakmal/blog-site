"use server";

import { blogSchema } from "@/schemas/blog";
import z from "zod";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth-server";
import { Id } from "@/convex/_generated/dataModel";

export async function createBlogAction(values: z.infer<typeof blogSchema>) {
  // 1. Validate form data
  const parsed = blogSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error("Invalid blog data");
  }

  // 2. Auth check
  const token = await getToken();
  if (!token) {
    throw new Error("Unauthorized");
  }

  let storageId: Id<"_storage">;

  try {
    // 3. Get upload URL
    const uploadUrl = await fetchMutation(
      api.posts.generateImageUploadUrl,
      {},
      { token }
    );

    console.log("Upload URL generated:", uploadUrl);

    // 4. Upload image
    const uploadResult = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": parsed.data.image.type,
      },
      body: await parsed.data.image.arrayBuffer(),
    });

    console.log("Upload result status:", uploadResult.status);

    if (!uploadResult.ok) {
      const errorText = await uploadResult.text();
      console.error("Upload failed with response:", errorText);
      throw new Error(
        `Image upload failed: ${uploadResult.status} - ${errorText}`
      );
    }

    // 5. Get storage ID
    const json = await uploadResult.json();
    console.log("Upload response:", json);
    storageId = json.storageId;
  } catch (error) {
    console.error("Full error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
    throw new Error("Failed to upload image");
  }

  // 6. Create blog post
  await fetchMutation(
    api.posts.createBlogPost,
    {
      title: parsed.data.title,
      content: parsed.data.content,
      imageStorageId: storageId,
    },
    { token }
  );

  // 7. Redirect after success
  redirect("/blog");
}
