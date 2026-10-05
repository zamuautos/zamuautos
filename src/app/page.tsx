
import { createClient } from "@/utils/supabase/server";
export const dynamic = "force-dynamic";
export default async function Home() {
  const supabase = await createClient();

  const { data: featuredVehicle } = await supabase
    .from("vehicles")
    .select("id, brand, model, year, price, mileage, transmission, images")
    .eq("featured", true)
    .eq("available", true)
    .limit(1)
    .maybeSingle();
const { data: reviews } = await supabase
    .from("reviews")
    .select("id, customer_name, vehicle, rating, comment")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(3);

    const { data: ratingReviews } = await supabase
  .from("reviews")
  .select("rating")
  .eq("approved", true);

const averageRating =
  ratingReviews && ratingReviews.length > 0
    ? ratingReviews.reduce((sum, review) => sum + review.rating, 0) /
      ratingReviews.length
    : 0;

  return (
<main className="min-h-screen bg-transparent">

<section className="min-h-[calc(100vh-88px)] flex items-end text-white pb-0 bg-[url('/images/zamu-logo-header.jpg')] bg-cover bg-center bg-no-repeat">
<div className="max-w-6xl mx-auto w-full text-center px-6 relative top-80 md:top-55">
        <h2 className="text-3xl md:text-6xl font-bold">
            Encuentra tu próximo auto
          </h2>

         <p className="text-xl mt-6 text-gray-300">
  Seminuevos seleccionados !<br />
  Seminuevos listos para ti !
</p>
  <div className="mt-2 md:mt-10 flex justify-center gap-3 md:gap-5">
   <a href="/inventario" className="bg-white text-black px-4 py-2 text-sm md:px-8 md:py-4 md:text-base rounded-xl font-semibold hover:bg-gray-200 inline-block">
  Ver Inventario
</a>

      <a
  href="https://wa.me/523334596891?text=Hola%2C%20me%20gustar%C3%ADa%20recibir%20informaci%C3%B3n%20sobre%20los%20veh%C3%ADculos%20de%20Zamu%20Autos."
  target="_blank"
  rel="noopener noreferrer"
className="border border-white px-4 py-2 text-sm md:px-8 md:py-4 md:text-base rounded-xl hover:bg-white hover:text-black inline-block"
>
  Contáctanos
</a>
          </div>
        </div>
      </section>

<section className="max-w-7xl mx-auto pt-96 md:pt-55 pb-20 px-6">
<h2 className="text-3xl md:text-4xl font-black italic tracking-wide mb-10 text-amber-500">
          Vehículo Destacado
        </h2>
{featuredVehicle ? (
  <a
    href={`/inventario/${featuredVehicle.id}`}
  className="block max-w-[320px] md:max-w-xl mx-auto overflow-hidden rounded-2xl bg-white shadow-lg"
  >
    {featuredVehicle.images?.[0] && (
      <img
  src={
  supabase.storage
    .from("vehicle-images")
    .getPublicUrl(featuredVehicle.images[0]).data.publicUrl
} 
        alt={`${featuredVehicle.brand} ${featuredVehicle.model}`}
      className="h-48 md:h-72 w-full object-cover"
      />
    )}

    <div className="p-6 text-black">
      <h3 className="text-2xl font-bold">
        {featuredVehicle.brand} {featuredVehicle.model} {featuredVehicle.year}
      </h3>

      <p className="mt-3 text-gray-600">
        {featuredVehicle.mileage?.toLocaleString()} km ·{" "}
        {featuredVehicle.transmission}
      </p>

      <p className="mt-6 text-3xl font-bold">
        ${featuredVehicle.price?.toLocaleString()}
      </p>
    </div>
  </a>
) : (
  <p className="text-gray-500">
    Aún no hay un vehículo destacado.
  </p>
)}
        
      </section>{/* TESTIMONIOS Y CALIFICACIÓN */}
<section className="max-w-7xl mx-auto px-6 py-16 md:py-20 text-white">
  <div className="text-center mb-10">
    <h2 className="text-3xl md:text-4xl font-bold">
      Lo que dicen nuestros clientes
    </h2>

    <p className="mt-3 text-gray-400 text-sm md:text-base">
      La confianza de nuestros clientes es parte de cada entrega.
    </p>
  </div>

{reviews && reviews.length > 0 && (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
    {reviews.map((review) => (
      <div
        key={review.id}
        className="border border-gray-700 rounded-2xl p-6 bg-black/40"
      >
        <p className="text-amber-400 text-lg mb-3">
          {"★".repeat(review.rating)}
          {"☆".repeat(5 - review.rating)}
        </p>

 <p className="text-gray-300 leading-relaxed">
    {review.comment}
  </p>
  <p className="mt-3 text-sm text-gray-400">
    Vehículo: {review.vehicle}
  </p>
        <p className="mt-5 text-sm text-gray-500">
          {review.customer_name}
        </p>
      </div>
    ))}
  </div>
)}

  <div className="mt-10 border border-gray-700 rounded-2xl p-7 text-center bg-black/40">
    <p className="text-sm uppercase tracking-widest text-gray-400">
      Calificación de nuestros clientes
    </p>

   <div className="mt-3 text-amber-400 text-3xl md:text-4xl">
  {"★".repeat(Math.round(averageRating))}
  {"☆".repeat(5 - Math.round(averageRating))}
</div>

   <p className="mt-3 text-gray-400 text-sm md:text-base">
  {ratingReviews && ratingReviews.length > 0
    ? `${averageRating.toFixed(1)} de 5 · ${ratingReviews.length} ${
        ratingReviews.length === 1 ? "reseña aprobada" : "reseñas aprobadas"
      }`
    : "Aún no hay reseñas aprobadas."}
</p>
  </div>
</section>
    </main>
  );
}