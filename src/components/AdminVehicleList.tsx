"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type Vehicle = {
  id: number;
  brand: string | null;
  model: string | null;
  year: number | null;
  price: number | null;
  available: boolean | null;
  status: string | null;
  featured: boolean | null;
  images: string[] | null;
};

type VehicleStatus = "Disponible" | "Apartado" | "Vendido";

function getVehicleStatus(vehicle: Vehicle): VehicleStatus {
  const status = (vehicle.status ?? "").trim().toLowerCase();

  if (status === "apartado") return "Apartado";
  if (status === "vendido") return "Vendido";
  if (status === "disponible") return "Disponible";

  return vehicle.available === false ? "Vendido" : "Disponible";
}

export default function AdminVehicleList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVehicles() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("vehicles")
        .select(
          "id, brand, model, year, price, available, status, featured, images"
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        alert(`Error al cargar vehículos: ${error.message}`);
      } else {
        setVehicles((data ?? []) as Vehicle[]);
      }

      setLoading(false);
    }

    loadVehicles();
  }, []);

  async function changeStatus(
    vehicle: Vehicle,
    newStatus: VehicleStatus
  ) {
    const supabase = createClient();

    const { error } = await supabase
      .from("vehicles")
      .update({
        status: newStatus,
        available: newStatus === "Disponible",
      })
      .eq("id", vehicle.id);

    if (error) {
      console.error(error);
      alert(`No se pudo actualizar el estado: ${error.message}`);
      return;
    }

    setVehicles((current) =>
      current.map((item) =>
        item.id === vehicle.id
          ? {
              ...item,
              status: newStatus,
              available: newStatus === "Disponible",
            }
          : item
      )
    );
  }

  async function toggleFeatured(vehicle: Vehicle) {
    const supabase = createClient();
    const newFeatured = vehicle.featured !== true;

    if (newFeatured) {
      const { error: clearError } = await supabase
        .from("vehicles")
        .update({ featured: false })
        .eq("featured", true);

      if (clearError) {
        console.error(clearError);
        alert("No se pudo cambiar el vehículo destacado.");
        return;
      }
    }

    const { error } = await supabase
      .from("vehicles")
      .update({ featured: newFeatured })
      .eq("id", vehicle.id);

    if (error) {
      console.error(error);
      alert("No se pudo cambiar el vehículo destacado.");
      return;
    }

    setVehicles((current) =>
      current.map((item) =>
        item.id === vehicle.id
          ? { ...item, featured: newFeatured }
          : newFeatured
            ? { ...item, featured: false }
            : item
      )
    );
  }

  async function deleteVehicle(vehicle: Vehicle) {
    const confirmed = window.confirm(
      `¿Eliminar definitivamente ${vehicle.brand} ${vehicle.model}? Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    const supabase = createClient();

    // Primero eliminamos el registro. Si falla, conservamos
    // las fotografías y el vehículo.
    const { error } = await supabase
      .from("vehicles")
      .delete()
      .eq("id", vehicle.id);

    if (error) {
      console.error(error);
      alert("No se pudo eliminar el vehículo.");
      return;
    }

    setVehicles((current) =>
      current.filter((item) => item.id !== vehicle.id)
    );

    if (vehicle.images && vehicle.images.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("vehicle-images")
        .remove(vehicle.images);

      if (storageError) {
        console.error(storageError);
        alert(
          "Se eliminó el vehículo, pero algunas fotografías requieren limpieza."
        );
      }
    }
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">
        Vehículos publicados
      </h2>

      {loading ? (
        <p className="text-gray-400">
          Cargando vehículos...
        </p>
      ) : vehicles.length === 0 ? (
        <p className="text-gray-400">
          No hay vehículos publicados.
        </p>
      ) : (
        <div className="space-y-4">
          {vehicles.map((vehicle) => {
            const status = getVehicleStatus(vehicle);

            return (
              <div
                key={vehicle.id}
                className="border border-gray-700 rounded-xl p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xl font-semibold">
                      {vehicle.brand} {vehicle.model}
                    </p>

                    <p className="text-gray-400">
                      {vehicle.year} ·{" "}
                      {vehicle.price !== null
                        ? `$${vehicle.price.toLocaleString("es-MX")}`
                        : "Sin precio"}
                    </p>
                  </div>

                  <span
                    className={`text-sm font-semibold ${
                      status === "Disponible"
                        ? "text-green-400"
                        : status === "Apartado"
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <select
                    aria-label={`Estado de ${vehicle.brand} ${vehicle.model}`}
                    value={status}
                    onChange={(event) =>
                      changeStatus(
                        vehicle,
                        event.target.value as VehicleStatus
                      )
                    }
                    className="border border-gray-600 rounded-lg px-4 py-2 bg-gray-900 text-white"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Apartado">Apartado</option>
                    <option value="Vendido">Vendido</option>
                  </select>

                  <a
                    href={`/admin/editar/${vehicle.id}`}
                    className="border border-gray-600 rounded-lg px-4 py-2 inline-block"
                  >
                    Editar
                  </a>

                  <button
                    type="button"
                    onClick={() => toggleFeatured(vehicle)}
                    className="border border-yellow-500 text-yellow-400 rounded-lg px-4 py-2"
                  >
                    {vehicle.featured
                      ? "Quitar destacado"
                      : "Destacar"}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteVehicle(vehicle)}
                    className="border border-red-600 text-red-400 rounded-lg px-4 py-2"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}