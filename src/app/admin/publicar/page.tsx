import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AdminVehicleForm from "@/components/AdminVehicleForm";

export default async function PublicarVehiculoPage() {
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
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-4xl font-bold mb-2">
          Publicar nuevo vehículo
        </div>

        <p className="text-gray-400 mb-8">
          Ingresa la información del vehículo
        </p>

        <AdminVehicleForm />
      </div>
    </main>
  );
}
