import useFormulario from "../../hooks/useFormulario";
import { validarProducto } from "../../utils/validaciones";
import CampoFormulario from "../CampoFormulario";

// =====================================================
// COMPONENTE: FormularioProducto (crear / editar vehículo)
// =====================================================
// Props:
//   productoInicial → producto a editar (null = producto nuevo)
//   onGuardar       → recibe el producto validado
//   onCancelar      → cierra el formulario
const PRODUCTO_VACIO = {
    codigo: "", nombre: "", descripcion: "", precio: "", stock: "", stockCritico: "", categoria: "", imagen: "",
};
const CATEGORIAS = [
    { valor: "", texto: "Seleccionar categoría" },
    ...["Sedán", "SUV", "Deportivo", "Híbrido", "Eléctrico"].map((c) => ({ valor: c, texto: c })),
];

function FormularioProducto({ productoInicial, onGuardar, onCancelar }) {
    // Si se edita, el formulario parte con los datos del producto.
    const inicial = productoInicial
        ? { ...PRODUCTO_VACIO, ...productoInicial, precio: String(productoInicial.precio), stock: String(productoInicial.stock), stockCritico: String(productoInicial.stockCritico) }
        : PRODUCTO_VACIO;
    const { valores, errores, validado, manejarCambio, validarTodo } = useFormulario(inicial, validarProducto);

    function guardar(evento) {
        evento.preventDefault();
        if (!validarTodo()) return;
        onGuardar({
            ...valores,
            codigo: valores.codigo.trim(),
            nombre: valores.nombre.trim(),
            descripcion: valores.descripcion.trim(),
            imagen: valores.imagen.trim(),
            precio: Number(valores.precio),
            stock: Number(valores.stock),
            stockCritico: Number(valores.stockCritico),
        });
    }

    // Función auxiliar para no repetir las mismas props en cada campo.
    const campo = (nombre, etiqueta, extra = {}) => (
        <CampoFormulario clase={`admin-campo ${extra.completo ? "admin-campo-completo" : ""}`} id={`producto-${nombre}`}
            nombre={nombre} etiqueta={etiqueta} valor={valores[nombre]} onChange={manejarCambio}
            error={errores[nombre]} validado={validado} {...extra} />
    );

    return (
        <div className="admin-formulario activo">
            <div className="admin-formulario-header">
                <div>
                    <p className="admin-superior">MANTENCIÓN</p>
                    <h3>{productoInicial ? "Editar producto" : "Nuevo producto"}</h3>
                </div>
                <button type="button" className="boton-cerrar-admin" aria-label="Cerrar formulario" onClick={onCancelar}>×</button>
            </div>
            <form onSubmit={guardar} noValidate>
                <div className="admin-form-grid">
                    {campo("codigo", "Código", { placeholder: "A005" })}
                    {campo("nombre", "Nombre", { placeholder: "Kia Sportage" })}
                    {campo("descripcion", "Descripción", { tipo: "textarea", completo: true, filas: 3 })}
                    {campo("precio", "Precio", { tipo: "number" })}
                    {campo("stock", "Stock", { tipo: "number" })}
                    {campo("stockCritico", "Stock crítico", { tipo: "number" })}
                    {campo("categoria", "Categoría", { tipo: "select", opciones: CATEGORIAS })}
                    {campo("imagen", "Ruta de imagen", { completo: true, placeholder: "/img/auto1.jpg" })}
                </div>
                <div className="admin-formulario-acciones">
                    <button type="button" className="boton-admin-secundario" onClick={onCancelar}>Cancelar</button>
                    <button type="submit" className="boton-admin-principal">Guardar producto</button>
                </div>
            </form>
        </div>
    );
}

export default FormularioProducto;
