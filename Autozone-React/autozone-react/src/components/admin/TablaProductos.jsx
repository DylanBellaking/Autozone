import { formatearPrecio } from "../../utils/formato";

// =====================================================
// COMPONENTE: TablaProductos
// =====================================================
// Props:
//   productos  → lista a mostrar
//   onEditar   → recibe el producto a editar
//   onEliminar → recibe el producto a eliminar
// Es un componente "de presentación": no guarda nada, solo avisa al padre (Admin).
function TablaProductos({ productos, onEditar, onEliminar }) {
    if (productos.length === 0) {
        return <p className="admin-descripcion">No hay productos registrados.</p>;
    }
    return (
        <div className="table-responsive tabla-autozone">
            <table className="table table-dark table-hover align-middle mb-0">
                <thead>
                    <tr>
                        <th>Código</th><th>Vehículo</th><th>Precio</th><th>Stock</th><th className="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto) => {
                        const critico = producto.stock <= producto.stockCritico;
                        return (
                            <tr key={producto.id}>
                                <td>{producto.codigo}</td>
                                <td><strong>{producto.nombre}</strong></td>
                                <td>{formatearPrecio(producto.precio)}</td>
                                {/* Stock en rojo cuando está en nivel crítico */}
                                <td className={critico ? "stock-critico" : ""}>
                                    {producto.stock}{critico && <span className="visually-hidden"> (stock crítico)</span>}
                                </td>
                                <td className="text-end">
                                    <div className="admin-acciones justify-content-end">
                                        <button type="button" onClick={() => onEditar(producto)} aria-label={`Editar ${producto.nombre}`}>Editar</button>
                                        <button type="button" onClick={() => onEliminar(producto)} aria-label={`Eliminar ${producto.nombre}`}>Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default TablaProductos;
