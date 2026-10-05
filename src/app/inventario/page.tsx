import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function InventarioPage() {
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
  const { data: vehicles, error } = await supabase
.from("vehicles")
.select("*")
.eq("available", true);
  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Inventario</h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {vehicles?.map((vehicle) => {
          const imageName =
            Array.isArray(vehicle.images) && vehicle.images.length > 0
              ? vehicle.images[0]
              : null;

          const imageUrl = imageName
            ? supabase.storage
                .from("vehicle-images")
                .getPublicUrl(imageName).data.publicUrl
            : null;

          return (
            <div
              key={vehicle.id}
             className="w-full max-w-[320px] mx-auto md:max-w-none border border-gray-700 rounded-2xl overflow-hidden ..."
            >
              <Link href={`/inventario/${vehicle.id}`}>
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-48 md:h-64 object-cover"
                  />
                )}
              </Link>

              <div className="p-5">
              <h2 className="text-xl md:text-2xl font-bold">
                  {vehicle.brand} {vehicle.model}
                </h2>

                <p className="mt-2 text-sm md:text-base">Año: {vehicle.year}</p>

                <p className="text-sm md:text-base">
                  Kilometraje: {vehicle.mileage?.toLocaleString()} km
                </p>

              <p className="text-sm md:text-base">
                  ${vehicle.price?.toLocaleString()}
                </p>

                <Link
                  href={`/inventario/${vehicle.id}`}
                  className="inline-block mt-5 border border-white rounded-lg px-5 py-2 hover:bg-white hover:text-black"
                >
                  Ver vehículo
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}