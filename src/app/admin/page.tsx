import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AdminVehicleForm from "@/components/AdminVehicleForm";
import AdminVehicleList from "@/components/AdminVehicleList";
import AdminReviewList from "@/components/AdminReviewList";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
  const allowedUsers = [
    "78b04881-da55-4064-bee2-61082a88c4a4",
    "47fa725d-7a68-4c1f-9d4d-51cd6a4685f0",
  ];

  if (!allowedUsers.includes(user.id)) {
    redirect("/");
  }
const isOwner = user.email === "zamucars.seminuevos@gmail.com";
  async function signOut() {
    "use server";

    const supabase = await createClient();
    await supabase.auth.signOut();

    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-start justify-between gap-4">
          <h1 className="text-4xl font-bold">
            Administración Zamu Autos
          </h1>

          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg border border-gray-600 px-4 py-2 text-sm hover:bg-gray-900"
            >
              Cerrar sesión
            </button>
          </form>
        </div>

        <section id="publicar">
          <p className="text-gray-400 mb-8">
            Publicar nuevo vehículo
          </p>

          <AdminVehicleForm />
        </section>

        <section id="vehiculos">
          <AdminVehicleList />
        </section>

        <section id="resenas">
          <AdminReviewList />
        </section>
      </div>
    </main>
  );
}