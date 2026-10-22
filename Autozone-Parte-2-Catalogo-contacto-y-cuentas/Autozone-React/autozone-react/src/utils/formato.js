// Funciones de apoyo para mostrar datos.

// 28990000 → "$28.990.000"
export function formatearPrecio(precio) {
    return "$" + Number(precio || 0).toLocaleString("es-CL");
}

// Devuelve el texto y la clase de Bootstrap según el stock del producto.
export function estadoStock(producto) {
    if (producto.stock <= 0) return { texto: "Agotado", clase: "bg-secondary" };
    if (producto.stock <= producto.stockCritico) return { texto: "Últimas unidades", clase: "bg-warning text-dark" };
    return { texto: "Disponible", clase: "bg-primary" };
}
