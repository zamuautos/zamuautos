"use client";

import { FormEvent, useRef,  useState } from "react";
import { createClient } from "@/utils/supabase/client";

type Vehicle = {
  id: number;
  brand: string | null;
  model: string | null;
  year: number | null;
  price: number | null;
  mileage: number | null;
  transmission: string | null;
  color: string | null;
  fuel: string | null;
  description: string | null;
  images: string[] | null;
};

export default function AdminEditVehicleForm({
  vehicle,
}: {
  vehicle: Vehicle;
}) {
  const [brand, setBrand] = useState(vehicle.brand ?? "");
  const [model, setModel] = useState(vehicle.model ?? "");
  const [year, setYear] = useState(String(vehicle.year ?? ""));
  const [price, setPrice] = useState(String(vehicle.price ?? ""));
  const [mileage, setMileage] = useState(String(vehicle.mileage ?? ""));
  const [transmission, setTransmission] = useState(
    vehicle.transmission ?? ""
  );
  const [color, setColor] = useState(vehicle.color ?? "");
  const [fuel, setFuel] = useState(vehicle.fuel ?? "");
  const [description, setDescription] = useState(
    vehicle.description ?? ""
  );
  const [currentImages, setCurrentImages] = useState<string[]>(
  vehicle.images ?? []
);
const [newFiles, setNewFiles] = useState<File[]>([]);
 const fileInputRef = useRef<HTMLInputElement | null>(null);
const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    const supabase = createClient();
const uploadedImagePaths: string[] = [];

for (const file of newFiles) {
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

  const filePath =
    `${vehicle.id}/${crypto.randomUUID()}-${cleanName}`;

  const { error: uploadError } = await supabase.storage
    .from("vehicle-images")
    .upload(filePath, file);

  if (uploadError) {
    console.error(uploadError);
    setMessage("No se pudieron subir las nuevas fotografías.");
    setSaving(false);
    return;
  }

  uploadedImagePaths.push(filePath);
}

const allImages = [...currentImages, ...uploadedImagePaths];
    const { error } = await supabase
      .from("vehicles")
      .update({
      images: allImages,
        brand,
        model,
        year: Number(year),
        price: Number(price),
        mileage: Number(mileage),
        transmission,
        color,
        fuel,
        description,
      })
      .eq("id", vehicle.id);

    if (error) {
      setMessage("No se pudieron guardar los cambios.");
      setSaving(false);
      return;
    }

    setMessage("Cambios guardados correctamente.");
    setCurrentImages(allImages);
setNewFiles([]); 
if (fileInputRef.current) {
  fileInputRef.current.value = "";
}   
setSaving(false);
  }

async function deleteCurrentImage(imagePath: string) {
  const confirmed = window.confirm(
    "¿Eliminar esta fotografía? Esta acción no se puede deshacer."
  );

  if (!confirmed) {
    return;
  }

  const newImages = currentImages.filter(
    (path) => path !== imagePath
  );

  const supabase = createClient();

  const { error: updateError } = await supabase
    .from("vehicles")
    .update({ images: newImages })
    .eq("id", vehicle.id);

  if (updateError) {
    console.error(updateError);
    alert("No se pudo eliminar la fotografía.");
    return;
  }

  const { error: storageError } = await supabase.storage
    .from("vehicle-images")
    .remove([imagePath]);

  if (storageError) {
    console.error(storageError);
  }

  setCurrentImages(newImages);
}

const supabaseForImages = createClient();

const currentImageUrls = currentImages.map(
  (imagePath) =>
    supabaseForImages.storage
      .from("vehicle-images")
      .getPublicUrl(imagePath).data.publicUrl
);
  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {currentImageUrls.length > 0 && (
  <div>
    <h2 className="text-xl font-semibold mb-3">
      Fotografías actuales

    </h2>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
     {currentImageUrls.map((imageUrl, index) => (
  <div key={currentImages[index] ?? index}>
    <img
      src={imageUrl}
      alt={`Foto ${index + 1} de ${vehicle.brand} ${vehicle.model}`}
      className="w-full h-40 object-cover rounded-lg border border-gray-700"
    />
{index > 0 && (
  <button
    type="button"
    onClick={async () => {
      const selectedImage = currentImages[index];

      const reorderedImages = [
        selectedImage,
        ...currentImages.filter( 
          (_, imageIndex) => imageIndex !== index
        ),
      ];

      const supabase = createClient();

      const { error } = await supabase
        .from("vehicles")
        .update({ images: reorderedImages })
        .eq("id", vehicle.id);

      if (error) {
        console.error(error);
        alert("No se pudo cambiar la foto principal.");
        return;
      }

      setCurrentImages(reorderedImages);
    }}
    className="mt-2 w-full border border-green-600 text-green-400 rounded-lg p-2"
  >
    Hacer principal
  </button>
)}
    <button
      type="button"
      onClick={() => deleteCurrentImage(currentImages[index])}
      className="mt-2 w-full border border-red-600 text-red-400 rounded-lg px-3 py-2"
    >
      Eliminar foto
    </button>
  </div>
))}
    </div>
  </div>
)}
      <div>
  <label className="block mb-2 font-medium">
    Agregar nuevas fotografías
  </label>

  <input
    type="file"
    ref={fileInputRef}
    accept="image/*"
    multiple
    onChange={(e) =>
      setNewFiles(Array.from(e.target.files ?? []))
    }
    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3"
  />

  {newFiles.length > 0 && (
    <p className="mt-2 text-sm text-gray-400">
      {newFiles.length} fotografía(s) seleccionada(s)
    </p>
  )}
</div>
      <input
        value={brand}
  
        onChange={(e) => setBrand(e.target.value)}
        placeholder="Marca"
        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3"
      />

      <input
        value={model}
        onChange={(e) => setModel(e.target.value)}
        placeholder="Modelo"
        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3"
      />

      <input
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder="Año"
        type="number"
        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3"
      />

      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Precio"
        type="number"
        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3"
      />

      <input
        value={mileage}
        onChange={(e) => setMileage(e.target.value)}
        placeholder="Kilometraje"
        type="number"
        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3"
      />

      <input
        value={transmission}
        onChange={(e) => setTransmission(e.target.value)}
        placeholder="Transmisión"
        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3"
      />

      <input
        value={color}
        onChange={(e) => setColor(e.target.value)}
        placeholder="Color"
        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3"
      />

      <input
        value={fuel}
        onChange={(e) => setFuel(e.target.value)}
        placeholder="Combustible"
        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción"
        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 min-h-32"
      />

      {message && (
        <p className="text-sm text-gray-300">{message}</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-white text-black font-semibold rounded-lg p-3"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}