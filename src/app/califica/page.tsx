"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function CalificaPage() {
  const supabase = createClient();

  const [customerName, setCustomerName] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSending(true);
    setError("");

    const { error: insertError } = await supabase.from("reviews").insert({
      customer_name: customerName.trim(),
      vehicle: vehicle.trim(),
      rating,
      comment: comment.trim(),
      approved: false,
    });

    setSending(false);

    if (insertError) {
      console.error(insertError);
      setError("No pudimos enviar tu reseña. Inténtalo nuevamente.");
      return;
    }

    setSent(true);
    setCustomerName("");
    setVehicle("");
    setRating(5);
    setComment("");
  }

  if (sent) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-xl text-center">
          <p className="text-5xl mb-6">★★★★★</p>

          <h1 className="text-3xl font-bold mb-4">
            ¡Gracias por tu opinión!
          </h1>

          <p className="text-gray-400">
            Tu reseña fue enviada correctamente y será publicada después de
            revisarla.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">
            ¿Cómo fue tu experiencia con Zamu Autos?
          </h1>

          <p className="text-gray-400">
            Tu opinión nos ayuda a seguir mejorando.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6"
        >
          <div>
            <label className="block mb-2 text-sm text-gray-300">
              Tu nombre
            </label>

            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 outline-none focus:border-gray-500"
              placeholder="Nombre"
            />
          </div>
<div>
  <label className="block mb-2 text-sm text-gray-300">
    Vehículo adquirido
  </label>

  <input
    type="text"
    required
    value={vehicle}
    onChange={(e) => setVehicle(e.target.value)}
    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white"
    placeholder="Ej. Toyota RAV4 2018"
  />
</div>
          <div>
            <label className="block mb-3 text-sm text-gray-300">
              Calificación
            </label>

            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-4xl ${
                    star <= rating ? "text-amber-400" : "text-gray-700"
                  }`}
                  aria-label={`${star} estrellas`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300">
              Cuéntanos tu experiencia
            </label>

            <textarea
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              className="w-full resize-none rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 outline-none focus:border-gray-500"
              placeholder="Escribe aquí tu experiencia con Zamu Autos..."
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-lg bg-white px-5 py-3 font-semibold text-black transition hover:bg-gray-200 disabled:opacity-50"
          >
            {sending ? "Enviando..." : "Enviar reseña"}
          </button>

          <p className="text-center text-xs text-gray-500">
            Las reseñas son revisadas antes de publicarse.
          </p>
        </form>
      </div>
    </main>
  );
}