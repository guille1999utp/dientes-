import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function EditPostPage({ params }: PageProps<"/admin/blog/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const post = await db.post.findUnique({ where: { id: Number(id) || 0 } });
  if (!post) notFound();

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Editar artículo ✏️</h1>
      <PostForm
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          emoji: post.emoji,
          color: post.color,
          readMinutes: post.readMinutes,
          published: post.published,
        }}
      />
    </div>
  );
}
