import { createClient } from "@/utils/supabase/server";

const OWNER_ID = "78b04881-da55-4064-bee2-61082a88c4a4";
export default async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner = user?.id === OWNER_ID;
  return (
    <nav className="bg-transparent text-white px-4 py-4 md:px-8 md:py-5">
      <div className="max-w-7xl mx-auto">

        {/* MENÚ CELULAR */}
        <div className="flex items-center justify-between md:hidden">
          <div>
            <h1 className="text-xl font-bold whitespace-nowrap">
              ZAMU AUTOS
            </h1>

            <a
              href="/login"
              className="text-sm text-gray-400 hover:text-white"
            >
              Administración
            </a>
          </div>

          <details className="relative">
            <summary className="cursor-pointer list-none rounded-lg border border-gray-700 px-3 py-2">
              ☰ Menú
            </summary>

            <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-gray-700 bg-black p-2">
              <a
                href="/"
                className="block rounded-lg px-3 py-2 hover:bg-gray-800"
              >
                Inicio
              </a>

              <a
                href="/inventario"
                className="block rounded-lg px-3 py-2 hover:bg-gray-800"
              >
                Inventario
              </a>

              <a
                href="#"
                className="block rounded-lg px-3 py-2 hover:bg-gray-800"
              >
                Financiamiento
              </a>

              <a
                href="/califica"
                className="block rounded-lg px-3 py-2 hover:bg-gray-800"
              >
                Califica tu experiencia
              </a>

              <a
                href="https://wa.me/523329172778?text=Hola%2C%20me%20gustaría%20recibir%20información"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg px-3 py-2 hover:bg-gray-800"
              >
                Contacto
              </a>
            </div>
          </details>
        </div>

        {/* MENÚ LAPTOP */}
        <div className="hidden md:flex md:items-start md:justify-between">

          {/* LADO IZQUIERDO */}
          <div>
            <h1 className="text-2xl font-bold">
              ZAMU AUTOS
            </h1>

           <details className="relative">
  <summary className="cursor-pointer list-none text-sm text-gray-400 hover:text-white">
    Administración ▼
  </summary>

  <div className="absolute left-0 z-50 mt-2 w-64 rounded-xl border border-gray-700 bg-black p-2">
   {isOwner && (
  <a
    href="/admin/resenas"
    className="block rounded-lg px-4 py-3 hover:bg-gray-800"
  >
    Reseñas de clientes
  </a>
)}

    <a
      href="/admin/inventario"
      className="block rounded-lg px-4 py-3 hover:bg-gray-800"
    >
      Inventario
    </a>

    <a
      href="/admin/publicar"
      className="block rounded-lg px-4 py-3 hover:bg-gray-800"
    >
      Publicar nuevo vehículo
    </a>
 <a
  href="/logout"
  className="block rounded-lg px-4 py-3 hover:bg-gray-800"
>
  Cerrar sesión
</a>
  </div>
</details>
          </div>

          {/* LADO DERECHO */}
          <div className="flex items-center gap-8">
            <a href="/" className="hover:text-gray-300">
              Inicio
            </a>

            <a href="/inventario" className="hover:text-gray-300">
              Inventario
            </a>

            <a href="#" className="hover:text-gray-300">
              Financiamiento
            </a>

            <a href="/califica" className="hover:text-gray-300">
              Califica tu experiencia
            </a>

            <a
              href="https://wa.me/523329172778?text=Hola%2C%20me%20gustaría%20recibir%20información"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              Contacto
            </a>
          </div>
        </div>

      </div>
    </nav>
  );
}