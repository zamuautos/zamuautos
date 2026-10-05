"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function AdminVehicleForm() {
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const brand = String(formData.get("brand") || "");
    const model = String(formData.get("model") || "");
    const year = Number(formData.get("year"));
    const price = Number(formData.get("price"));
    const mileage = Number(formData.get("mileage"));
    const transmission = String(formData.get("transmission") || "");
    const color = String(formData.get("color") || "");
    const fuel = String(formData.get("fuel") || "");
    const description = String(formData.get("description") || "");

    const files = formData.getAll("images") as File[];

    try {
      const imagePaths: string[] = [];
      const vehicleFolder = crypto.randomUUID();

      for (const file of files) {
        if (!file || file.size === 0) continue;

        const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const filePath = `${vehicleFolder}/${crypto.randomUUID()}-${cleanName}`;

        const { error: uploadError } = await supabase.storage
          .from("vehicle-images")
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        imagePaths.push(filePath);
      }

      const { error: insertError } = await supabase
        .from("vehicles")
        .insert({
          brand,
          model,
          year,
          price,
          mileage,
          transmission,
          color,
          fuel,
          description,
          images: imagePaths,
          available: true,
          featured: false,
        });

      if (insertError) {
        throw insertError;
      }

      form.reset();
      setMessage("Vehículo publicado correctamente.");
    } catch (error) {
      console.error(error);
      setMessage("No se pudo publicar el vehículo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-gray-700 rounded-2xl p-6"
    >
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block mb-2">Marca</label>
          <input
            name="brand"
            type="text"
            required
            className="w-full bg-zinc-900 border border-gray-700 rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2">Modelo</label>
          <input
            name="model"
            type="text"
            required
            className="w-full bg-zinc-900 border border-gray-700 rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2">Año</label>
          <input
            name="year"
            type="number"
            required
            className="w-full bg-zinc-900 border border-gray-700 rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2">Precio</label>
          <input
            name="price"
            type="number"
            required
            className="w-full bg-zinc-900 border border-gray-700 rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2">Kilometraje</label>
          <input
            name="mileage"
            type="number"
            required
            className="w-full bg-zinc-900 border border-gray-700 rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2">Transmisión</label>
          <input
            name="transmission"
            type="text"
            required
            className="w-full bg-zinc-900 border border-gray-700 rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2">Color</label>
          <input
            name="color"
            type="text"
            required
            className="w-full bg-zinc-900 border border-gray-700 rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2">Combustible</label>
          <input
            name="fuel"
            type="text"
            required
            className="w-full bg-zinc-900 border border-gray-700 rounded-lg p-3"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="block mb-2">Descripción</label>
        <textarea
          name="description"
          rows={5}
          className="w-full bg-zinc-900 border border-gray-700 rounded-lg p-3"
        />
      </div>

      <div className="mt-5">
        <label className="block mb-2">Fotografías</label>
        <input
          name="images"
          type="file"
          multiple
          accept="image/*"
          required
          className="w-full bg-zinc-900 border border-gray-700 rounded-lg p-3"
        />
      </div>

      {message && (
        <p className="mt-5 text-center">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-8 bg-white text-black font-bold py-4 rounded-xl disabled:opacity-50"
      >
        {loading ? "Publicando..." : "Publicar vehículo"}
      </button>
    </form>
  );
}