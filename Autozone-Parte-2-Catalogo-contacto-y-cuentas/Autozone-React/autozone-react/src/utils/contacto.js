import { NUMERO_WHATSAPP } from "../data/empresa";
import { formatearPrecio } from "./formato";

// Nombre completo para mostrar: "2026 BMW Serie 3"
export function tituloVehiculo(producto) {
    return `${producto.anio} ${producto.nombre}`;
}

// Mensaje que aparece escrito al abrir el formulario de contacto o el chat.
export function mensajeInicial(producto) {
    return `Hola, me interesa el ${tituloVehiculo(producto)} ${producto.version || ""} nuevo (${formatearPrecio(producto.precio)}). ¿Me pueden contactar?`.replace(/\s+/g, " ");
}

// Arma el enlace de WhatsApp con el mensaje ya escrito.
// Ejemplo: https://wa.me/56912345678?text=Hola%2C%20me%20interesa...
export function crearEnlaceWhatsApp(producto, numero = NUMERO_WHATSAPP) {
    return `https://wa.me/${numero}?text=${encodeURIComponent(mensajeInicial(producto))}`;
}

// Enlace para llamar directamente desde el celular.
export function crearEnlaceLlamada(numero = NUMERO_WHATSAPP) {
    return `tel:+${numero}`;
}
