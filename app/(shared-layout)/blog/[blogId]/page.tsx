import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "@/components/web/CommentSection";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

interface BlogIdPageProps {
  params: Promise<{ blogId: Id<"posts"> }>;
}

export async function generateMetadata({
  params,
}: BlogIdPageProps): Promise<Metadata> {
  const { blogId } = await params;
  const post = await fetchQuery(api.posts.getpostById, { postId: blogId });
  if (!post) {
    return {
      title: "Blog not found",
    };
  }
  return {
    title: post.title,
    description: post.content,
  };
}

export default async function BlogIdPage({ params }: BlogIdPageProps) {
  const { blogId } = await params;

  const [posts, preLoadedComments] = await Promise.all([
    fetchQuery(api.posts.getpostById, { postId: blogId }),
    preloadQuery(api.comment.getCommentsForPost, {
      postId: blogId,
    }),
  ]);

  if (!posts) {
    return (
      <div className="flex items-center text-4xl text-muted-foreground">
        no data found
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
      <Link
        className={buttonVariants({
          className: "mb-4",
          variant: "outline",
        })}
        href={"/blog"}
      >
        <ArrowLeft className="size-4" />
        Back to blogs
      </Link>

      <div className="relative w-full h-100 mb-8 rounded-xl overflow-hidden shadow-sm">
        <Image
          src={posts?.imageUrl ?? ""}
          alt="blog image"
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="space-y-4 flex flex-col ">
        <h1 className="text-4xl font-bold tracking-tight text-muted-foreground">
          {posts?.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          Posted on : {new Date(posts?._creationTime).toLocaleDateString()}
        </p>
      </div>

      <Separator className="my-8" />

      <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
        {posts?.content}
      </p>

      <Separator className="my-8" />

      <CommentSection preloadedComments={preLoadedComments} />
    </div>
  );
}
