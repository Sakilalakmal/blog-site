"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function BlogPage() {
  const blogData = useQuery(api.posts.getBlogPosts);
  console.log(blogData);

  return <div>hello blog</div>;
}
