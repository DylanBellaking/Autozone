import { formatearPrecio } from "../utils/formato";
import { crearEnlaceWhatsApp, tituloVehiculo } from "../utils/contacto";
import CarruselVehiculo from "./CarruselVehiculo";

// =====================================================
// COMPONENTE: DetalleVehiculo (ventana con la ficha del auto)
// =====================================================
// La venta NO se hace en la página: desde aquí el cliente elige cómo seguir.
//   1) "Contactar vendedor" → abre el formulario para que un vendedor lo llame o escriba.
//   2) "Chatear por WhatsApp" → abre WhatsApp con un mensaje ya escrito sobre este auto.
// Props:
//   producto    → vehículo a mostrar
//   onCerrar    → cierra la ventana
//   onContactar → abre "Contacta al vendedor(a)"
// En la versión HTML la ventana se abría con #id y :target.
// En React se muestra porque el componente PADRE la renderiza según su estado.
function DetalleVehiculo({ producto, onCerrar, onContactar }) {
    const especificaciones = [
        { nombre: "Año", valor: producto.anio },
        { nombre: "Versión", valor: producto.version },
        { nombre: "Condición", valor: producto.condicion || "Nuevo" },
        { nombre: "Transmisión", valor: producto.transmision },
        { nombre: "Combustible", valor: producto.combustible },
        { nombre: "Kilometraje", valor: producto.kilometraje || "0 km" },
    ];

    return (
        <section className="detalle-auto abierta" role="dialog" aria-modal="true" aria-label={`Detalle ${producto.nombre}`}>
            <div className="detalle-contenedor">
                <button type="button" className="detalle-cerrar" aria-label="Cerrar" onClick={onCerrar}>×</button>

                <div className="detalle-imagen">
                    {producto.imagenesInterior?.length > 0 ? (
                        <CarruselVehiculo key={producto.id} nombre={producto.nombre} imagenes={[
                            { src: producto.imagen, alt: producto.nombre },
                            ...producto.imagenesInterior,
                        ]} />
                    ) : (
                        <img src={producto.imagen} alt={producto.nombre} />
                    )}
                </div>

                <div className="detalle-informacion">
                    <p className="detalle-marca">{producto.marca} · {producto.condicion || "Nuevo"}</p>
                    <h2>{tituloVehiculo(producto)}</h2>
                    <p className="detalle-descripcion">{producto.descripcion}</p>
                    {producto.notaGaleria && <p className="small text-secondary">{producto.notaGaleria}</p>}

                    <div className="especificaciones">
                        {especificaciones.map((dato) => (
                            <div key={dato.nombre}>
                                <span>{dato.nombre}</span>
                                <strong>{dato.valor}</strong>
                            </div>
                        ))}
                    </div>

                    <div className="detalle-precio">
                        <span>Precio</span>
                        <strong>{formatearPrecio(producto.precio)}</strong>
                    </div>

                    <p className="stock-detalle">
                        {producto.stock > 0 ? `Unidades disponibles: ${producto.stock}` : "Sin stock por ahora: consúltanos por la próxima llegada"}
                    </p>

                    <div className="botones-compra">
                        <button type="button" className="boton-consultar" onClick={onContactar}>
                            ✉ Contactar vendedor
                        </button>
                        {/* Enlace externo: target="_blank" abre WhatsApp en otra pestaña;
                            rel="noopener noreferrer" es una buena práctica de seguridad */}
                        <a className="boton-comprar boton-chat" href={crearEnlaceWhatsApp(producto)} target="_blank" rel="noopener noreferrer">
                            💬 Chatear por WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default DetalleVehiculo;
