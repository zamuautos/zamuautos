import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AdminReviewList from "@/components/AdminReviewList";

export default async function ResenasPage() {
    const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const isOwner =
    user.email === "zamucars.seminuevos@gmail.com";

  if (!isOwner) {
    redirect("/admin");
  }
  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-2">
          Reseñas de clientes
        </h1>

        <p className="text-gray-400 mb-8">
          Administra las reseñas enviadas por tus clientes.
        </p>

        <AdminReviewList />
      </div>
    </main>
  );
}