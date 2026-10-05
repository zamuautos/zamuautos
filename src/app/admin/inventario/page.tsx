import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AdminVehicleList from "@/components/AdminVehicleList";
export default async function AdminInventarioPage() {
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
  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">
          Inventario
        </h1>

        <AdminVehicleList />
      </div>
    </main>
  );
}