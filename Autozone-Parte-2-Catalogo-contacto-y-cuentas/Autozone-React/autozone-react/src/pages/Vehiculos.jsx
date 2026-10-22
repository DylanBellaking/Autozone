import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { guardarFavoritos, obtenerFavoritos, obtenerProductos } from "../services/almacenamiento";
import TarjetaVehiculo from "../components/TarjetaVehiculo";
import DetalleVehiculo from "../components/DetalleVehiculo";
import ContactoVendedor from "../components/ContactoVendedor";

// =====================================================
// PÁGINA: Vehículos (catálogo de autos nuevos)
// =====================================================
// No hay carrito ni compra en línea: el cliente pide que lo contacte un vendedor
// o abre un chat por WhatsApp.
// Estado de la página:
//   productos      → lista de vehículos (se lee de localStorage)
//   categoria      → filtro seleccionado ("Todas", "Sedán", "Híbrido"...)
//   favoritos      → ids de los autos marcados con ♥ (se guardan en localStorage)
//   seleccionadoId → id del vehículo abierto (null = ninguno)
//   ventana        → qué ventana se muestra: "detalle" o "contacto"
// La URL también puede abrir una ventana: /vehiculos?auto=bmw  o  ?auto=bmw&contacto=1
function Vehiculos() {
    const [parametros, setParametros] = useSearchParams();
    const [productos] = useState(() => obtenerProductos());
    const [categoria, setCategoria] = useState("Todas");
    const [favoritos, setFavoritos] = useState(() => obtenerFavoritos());
    const [seleccionadoId, setSeleccionadoId] = useState(parametros.get("auto"));
    const [ventana, setVentana] = useState(
        parametros.get("auto") ? (parametros.get("contacto") ? "contacto" : "detalle") : null
    );

    const seleccionado = productos.find((p) => p.id === seleccionadoId);
    const categorias = ["Todas", ...new Set(productos.map((p) => p.categoria))];
    const visibles = categoria === "Todas" ? productos : productos.filter((p) => p.categoria === categoria);

    function abrir(producto, tipoVentana) {
        setSeleccionadoId(producto.id);
        setVentana(tipoVentana);
    }

    function cerrarTodo() {
        setVentana(null);
        setSeleccionadoId(null);
        if (parametros.get("auto")) setParametros({});
    }

    // Agrega o quita el auto de favoritos (estado + localStorage).
    function alternarFavorito(id) {
        const nuevos = favoritos.includes(id) ? favoritos.filter((f) => f !== id) : [...favoritos, id];
        setFavoritos(nuevos);
        guardarFavoritos(nuevos);
    }

    return (
        <section className="vehiculos">
            <div className="vehiculos-titulo">
                <p>AUTOS NUEVOS · 0 KM</p>
                <h2>Encuentra tu próximo auto</h2>
                <span>Elige tu vehículo y un vendedor te asesorará por teléfono, correo o WhatsApp.</span>
            </div>

            {/* Filtro por categoría: cada botón cambia el estado "categoria" */}
            <div className="filtros d-flex flex-wrap justify-content-center gap-2 mb-4" role="group" aria-label="Filtrar por categoría">
                {categorias.map((c) => (
                    <button key={c} type="button" className={`boton-filtro ${categoria === c ? "activo" : ""}`}
                        aria-pressed={categoria === c} onClick={() => setCategoria(c)}>
                        {c}
                    </button>
                ))}
            </div>

            <div className="container-xxl">
                {/* Bootstrap: 1 columna (celular), 2 (≥576px), 3 (≥992px), 4 (≥1200px) */}
                <div className="row g-4">
                    {visibles.map((producto) => (
                        <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={producto.id}>
                            <TarjetaVehiculo producto={producto}
                                onVerDetalle={(p) => abrir(p, "detalle")} onContactar={(p) => abrir(p, "contacto")}
                                esFavorito={favoritos.includes(producto.id)} onFavorito={alternarFavorito} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Renderizado condicional de las ventanas según el estado "ventana" */}
            {seleccionado && ventana === "detalle" && (
                <DetalleVehiculo producto={seleccionado} onCerrar={cerrarTodo} onContactar={() => setVentana("contacto")} />
            )}
            {seleccionado && ventana === "contacto" && (
                <ContactoVendedor producto={seleccionado} onCerrar={cerrarTodo} />
            )}
        </section>
    );
}

export default Vehiculos;
