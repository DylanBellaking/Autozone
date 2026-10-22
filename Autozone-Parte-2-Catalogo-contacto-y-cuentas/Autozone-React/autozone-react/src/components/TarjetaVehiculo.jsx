import { estadoStock, formatearPrecio } from "../utils/formato";
import { tituloVehiculo } from "../utils/contacto";

// =====================================================
// COMPONENTE: TarjetaVehiculo
// =====================================================
// Muestra UN vehículo nuevo del catálogo. El mismo componente se reutiliza para
// cada auto: lo único que cambia son sus props.
// Props:
//   producto      → objeto con los datos del vehículo
//   onVerDetalle  → abre la ficha completa (función del componente padre)
//   onContactar   → abre "Contacta al vendedor(a)" directamente
//   esFavorito    → true si el auto está marcado con ♥
//   onFavorito    → marca o desmarca el auto como favorito (opcional)
function TarjetaVehiculo({ producto, onVerDetalle, onContactar, esFavorito = false, onFavorito }) {
    const estado = estadoStock(producto);

    // Datos de la ficha corta (ícono + texto), como en los portales de autos.
    const ficha = [
        { icono: "🚘", texto: producto.categoria },
        { icono: "⛽", texto: producto.combustible },
        { icono: "⚙️", texto: producto.transmision },
        { icono: "🛣️", texto: producto.kilometraje || "0 km" },
    ];

    return (
        <article className="tarjeta-auto h-100 d-flex flex-column">
            <div className="imagen-auto">
                <img src={producto.imagen} alt={producto.nombre} />
                <span className="etiqueta-nuevo badge">{producto.condicion || "Nuevo"}</span>
                {/* La etiqueta cambia según el stock: Disponible / Últimas unidades / Agotado */}
                <span className={`etiqueta badge ${estado.clase}`}>{estado.texto}</span>
            </div>

            <div className="info-auto d-flex flex-column flex-grow-1">
                <div className="d-flex justify-content-between align-items-start gap-2">
                    <div>
                        <h3 className="titulo-auto">{tituloVehiculo(producto)}</h3>
                        <p className="version-auto">{producto.version}</p>
                    </div>
                    {onFavorito && (
                        <button type="button" className={`boton-favorito ${esFavorito ? "activo" : ""}`}
                            aria-pressed={esFavorito} aria-label={`${esFavorito ? "Quitar de" : "Agregar a"} favoritos ${producto.nombre}`}
                            onClick={() => onFavorito(producto.id)}>
                            {esFavorito ? "♥" : "♡"}
                        </button>
                    )}
                </div>

                <p className="precio-auto"><strong>{formatearPrecio(producto.precio)}</strong> <span>CLP</span></p>

                <ul className="ficha-auto">
                    {ficha.map((dato) => (
                        <li key={dato.icono}><span aria-hidden="true">{dato.icono}</span> {dato.texto}</li>
                    ))}
                </ul>

                <p className="vendedor-auto">
                    <strong>AUTOZONE / Vehículo nuevo</strong>
                    <span>📍 Región Metropolitana</span>
                </p>

                {/* mt-auto empuja los botones al final: todas las tarjetas quedan alineadas */}
                <div className="acciones-auto mt-auto">
                    <button type="button" className="boton-contactar" onClick={() => onContactar(producto)}>
                        ✉ Contactar vendedor
                    </button>
                    <button type="button" className="boton-auto" onClick={() => onVerDetalle(producto)}>
                        Ver detalles
                    </button>
                </div>
            </div>
        </article>
    );
}

export default TarjetaVehiculo;
