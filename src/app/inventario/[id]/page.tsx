import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import VehicleGallery from "@/components/VehicleGallery";

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: vehicle, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !vehicle) {
    notFound();
  }

  const imageUrls = Array.isArray(vehicle.images)
    ? vehicle.images.map((imageName: string) =>
        supabase.storage
          .from("vehicle-images")
          .getPublicUrl(imageName).data.publicUrl
      )
    : [];

  const whatsappMessage = encodeURIComponent(
    `Hola, me interesa la ${vehicle.brand} ${vehicle.model} ${vehicle.year} que vi en Zamu Autos.`
  );

  const whatsappUrl = `https://wa.me/523334596891?text=${whatsappMessage}`;

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/inventario"
          className="inline-block mb-6 text-gray-300 hover:text-white"
        >
          ← Volver al inventario
        </Link>

        <div className="grid gap-10 lg:grid-cols-[3fr_2fr] items-start">
          <div>
            <VehicleGallery
              images={imageUrls}
              brand={vehicle.brand}
              model={vehicle.model}
            />
          </div>

          <div className="border border-gray-700 rounded-2xl p-7">
            <h1 className="text-[1.9rem] md:text-4xl font-bold">
              {vehicle.brand} {vehicle.model}
            </h1>

            <p className="text-[1.6rem] md:text-3xl font-bold mt-3 mb-7">
              ${vehicle.price?.toLocaleString()}
            </p>

            <div className="grid grid-cols-[0.8fr_1fr_1.25fr] gap-2 mb-8 md:grid-cols-3 md:gap-3">
              <div className="border border-gray-700 rounded-xl p-4 text-center">
                <p className="text-xs md:text-sm text-gray-400">
                  Año
                </p>

                <p className="text-[0.95rem] md:text-lg font-bold mt-1">
                  {vehicle.year}
                </p>
              </div>

              <div className="border border-gray-700 rounded-xl p-4 text-center">
                <p className="text-xs md:text-sm text-gray-400">
                  Kilometraje
                </p>

                <p className="text-[0.95rem] md:text-lg font-bold mt-1">
                  {vehicle.mileage?.toLocaleString()} km
                </p>
              </div>

              <div className="border border-gray-700 rounded-xl p-4 text-center">
                <p className="text-xs md:text-sm text-gray-400">
                  Transmisión
                </p>

                <p className="text-[0.95rem] md:text-lg font-bold mt-1">
                  {vehicle.transmission}
                </p>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold mb-4">
              Características
            </h2>

            <div className="space-y-3 text-[0.95rem] md:text-lg">
              <p>Color: {vehicle.color}</p>
              <p>Combustible: {vehicle.fuel}</p>
            </div>

            <div className="border-t border-gray-700 mt-7 pt-7">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                Descripción
              </h2>

              <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                {vehicle.description}
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
             className="block w-[64%] mx-auto mt-16 md:mt -8 text-center bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-3 text-xs md:w-full md:py-4 md:px-6 md:text-base rounded-xl transition"
            >
              Solicitar información por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}