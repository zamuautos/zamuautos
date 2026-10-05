"use client";

import { useState } from "react";

export default function AdminMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-8">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-lg border border-gray-600 px-4 py-3 hover:bg-gray-900"
      >
        <span className="text-xl">☰</span>
        <span>Menú de administración</span>
      </button>

   {open && (
  <div className="mt-3 rounded-xl border border-gray-700 bg-gray-950 p-3">
    <a
      href="/admin/publicar"
      className="block rounded-lg px-4 py-3 hover:bg-gray-900"
      onClick={() => setOpen(false)}
    >
      Publicar vehículo
    </a>

    <a
      href="#vehiculos"
      className="block rounded-lg px-4 py-3 hover:bg-gray-900"
      onClick={() => setOpen(false)}
    >
      Vehículos publicados
    </a>

    <a
      href="/admin/resenas"
      className="block rounded-lg px-4 py-3 hover:bg-gray-900"
      onClick={() => setOpen(false)}
    >
      Reseñas de clientes
    </a>
  </div>
)}
    </div>
  );
}