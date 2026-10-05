import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AdminEditVehicleForm from "@/components/AdminEditVehicleForm";

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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
  const { data: vehicle, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !vehicle) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <a
  href="/admin"
  className="mb-6 inline-block rounded-lg border border-gray-600 px-4 py-2 text-sm hover:bg-gray-900"
>
  ← Regresar a administración
</a>
        <h1 className="text-4xl font-bold mb-2">
          Editar vehículo
        </h1>

        <p className="text-gray-400">
          {vehicle.brand} {vehicle.model}
        </p>
        <AdminEditVehicleForm vehicle={vehicle} />
      </div>
    </main>
  );
}