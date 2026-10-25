import { PostForm } from "@/components/admin/PostForm";
import { requireAdmin } from "@/lib/auth";

export default async function NewPostPage() {
  await requireAdmin();
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Nuevo artículo ✍️</h1>
      <PostForm />
    </div>
  );
}
