import { useState } from "react";
import { Link } from "react-router-dom";
import { guardarMensajes, guardarProductos, guardarUsuarios, obtenerMensajes, obtenerProductos, obtenerUsuarios } from "../services/almacenamiento";
import FormularioProducto from "../components/admin/FormularioProducto";
import TablaProductos from "../components/admin/TablaProductos";
import FormularioUsuario from "../components/admin/FormularioUsuario";
import TablaUsuarios from "../components/admin/TablaUsuarios";
import TablaSolicitudes from "../components/admin/TablaSolicitudes";

// =====================================================
// PÁGINA: Admin (panel de administración)
// =====================================================
// Props:
//   usuario        → administrador con sesión
//   onCerrarSesion → cierra la sesión
// Estado:
//   vista              → "inicio", "productos", "usuarios" o "solicitudes"
//   productos/usuarios → listas (cada cambio se guarda en localStorage)
//   mensajes           → solicitudes "Contacta al vendedor" y mensajes de contacto
//   productoEditando   → undefined = formulario cerrado, null = nuevo, objeto = editar
//   usuarioEditando    → igual que productoEditando, para usuarios
function Admin({ usuario, onCerrarSesion }) {
    const [vista, setVista] = useState("inicio");
    const [productos, setProductos] = useState(() => obtenerProductos());
    const [usuarios, setUsuarios] = useState(() => obtenerUsuarios());
    const [productoEditando, setProductoEditando] = useState(undefined);
    const [usuarioEditando, setUsuarioEditando] = useState(undefined);
    const [mensajes, setMensajes] = useState(() => obtenerMensajes());
    const [aviso, setAviso] = useState("");
    const pendientes = mensajes.filter((m) => m.estado !== "Atendida").length;

    // Marca una solicitud como Atendida o la vuelve a Pendiente.
    function cambiarEstado(mensaje) {
        const lista = mensajes.map((m) => (m.id === mensaje.id ? { ...m, estado: m.estado === "Atendida" ? "Pendiente" : "Atendida" } : m));
        setMensajes(lista);
        guardarMensajes(lista);
    }

    // Actualiza el estado y localStorage al mismo tiempo.
    function actualizarProductos(lista, mensaje) {
        setProductos(lista);
        guardarProductos(lista);
        setAviso(mensaje);
    }
    function actualizarUsuarios(lista, mensaje) {
        setUsuarios(lista);
        guardarUsuarios(lista);
        setAviso(mensaje);
    }

    function guardarProducto(datos) {
        const partes = datos.nombre.split(" ");
        if (productoEditando) {
            const lista = productos.map((p) => (p.id === productoEditando.id ? { ...p, ...datos } : p));
            actualizarProductos(lista, "Producto actualizado correctamente.");
        } else {
            const nuevo = {
                ...datos, id: "producto-" + Date.now(), marca: partes[0].toUpperCase(), modelo: partes.slice(1).join(" ") || partes[0],
                anio: new Date().getFullYear(), transmision: "Automática", combustible: datos.categoria === "Eléctrico" ? "Eléctrico" : "Gasolina", kilometraje: "0 km",
            };
            actualizarProductos([...productos, nuevo], "Producto creado correctamente.");
        }
        setProductoEditando(undefined);
    }

    function eliminarProducto(producto) {
        if (!window.confirm(`¿Deseas eliminar ${producto.nombre}?`)) return;
        actualizarProductos(productos.filter((p) => p.id !== producto.id), "Producto eliminado correctamente.");
    }

    function guardarUsuario(datos) {
        if (usuarioEditando) {
            actualizarUsuarios(usuarios.map((u) => (u.id === usuarioEditando.id ? { ...u, ...datos } : u)), "Usuario actualizado correctamente.");
        } else {
            const nuevo = { ...datos, id: "usuario-" + Date.now(), contrasena: "123456", telefono: "" };
            actualizarUsuarios([...usuarios, nuevo], "Usuario creado correctamente. Contraseña inicial: 123456");
        }
        setUsuarioEditando(undefined);
    }

    function eliminarUsuario(u) {
        if (!window.confirm(`¿Deseas eliminar al usuario ${u.nombre} ${u.apellidos}?`)) return;
        actualizarUsuarios(usuarios.filter((x) => x.id !== u.id), "Usuario eliminado correctamente.");
    }

    const menu = [
        { id: "inicio", texto: "Inicio" },
        { id: "productos", texto: "Productos" },
        { id: "usuarios", texto: "Usuarios" },
        { id: "solicitudes", texto: `Solicitudes (${pendientes})` },
    ];

    return (
        <section className="admin-panel">
            <div className="admin-contenedor">
                <aside className="admin-sidebar">
                    <div className="admin-sidebar-logo"><span>AUTO</span> ZONE</div>
                    <p className="admin-sidebar-titulo">ADMINISTRACIÓN</p>
                    <nav className="admin-nav" aria-label="Menú del panel">
                        {menu.map((item) => (
                            <button key={item.id} type="button" className={`admin-nav-link ${vista === item.id ? "activo" : ""}`}
                                aria-current={vista === item.id ? "page" : undefined} onClick={() => { setVista(item.id); setAviso(""); }}>
                                <span>{item.texto}</span>
                            </button>
                        ))}
                    </nav>
                    <div className="admin-sidebar-abajo">
                        <Link to="/vehiculos" className="admin-volver">← Volver a la tienda</Link>
                    </div>
                </aside>

                <main className="admin-contenido">
                    <header className="admin-header">
                        <div>
                            <p className="admin-superior">AUTOZONE / ADMINISTRACIÓN</p>
                            <h1>Panel de administración</h1>
                        </div>
                        <button type="button" className="admin-salir" onClick={onCerrarSesion}>Cerrar sesión</button>
                    </header>

                    {aviso && <div className="alert alert-success alert-dismissible" role="status">{aviso}
                        <button type="button" className="btn-close" aria-label="Cerrar aviso" onClick={() => setAviso("")}></button></div>}

                    {vista === "inicio" && (
                        <section className="admin-vista">
                            <div className="admin-bienvenida"><p>Bienvenido, {usuario.nombre}, al sistema de administración de AUTOZONE.</p></div>
                            <div className="admin-resumen">
                                <div className="admin-resumen-item">
                                    <span className="admin-resumen-titulo">PRODUCTOS</span>
                                    <strong data-testid="cantidad-productos">{productos.length}</strong>
                                    <span className="admin-resumen-descripcion">Vehículos registrados</span>
                                </div>
                                <div className="admin-resumen-item">
                                    <span className="admin-resumen-titulo">USUARIOS</span>
                                    <strong data-testid="cantidad-usuarios">{usuarios.length}</strong>
                                    <span className="admin-resumen-descripcion">Usuarios registrados</span>
                                </div>
                                <div className="admin-resumen-item">
                                    <span className="admin-resumen-titulo">SOLICITUDES</span>
                                    <strong data-testid="cantidad-solicitudes">{pendientes}</strong>
                                    <span className="admin-resumen-descripcion">Clientes por contactar</span>
                                </div>
                            </div>
                            <div className="admin-informacion">
                                <p className="admin-informacion-titulo">Gestión de AUTOZONE</p>
                                <p>Desde este panel podrás administrar los productos, los usuarios y las solicitudes de contacto de los clientes.</p>
                            </div>
                        </section>
                    )}

                    {vista === "productos" && (
                        <section className="admin-vista">
                            <div className="admin-vista-header">
                                <div><p className="admin-superior">ADMINISTRACIÓN</p><h2>Productos</h2></div>
                                <button type="button" className="boton-admin-principal" onClick={() => setProductoEditando(null)}>+ Nuevo producto</button>
                            </div>
                            <p className="admin-descripcion">Administra los vehículos disponibles en la tienda.</p>
                            {productoEditando !== undefined && (
                                // key: obliga a React a crear el formulario de nuevo al cambiar de producto
                                <FormularioProducto key={productoEditando?.id || "nuevo"} productoInicial={productoEditando}
                                    onGuardar={guardarProducto} onCancelar={() => setProductoEditando(undefined)} />
                            )}
                            <TablaProductos productos={productos} onEditar={setProductoEditando} onEliminar={eliminarProducto} />
                        </section>
                    )}

                    {vista === "usuarios" && (
                        <section className="admin-vista">
                            <div className="admin-vista-header">
                                <div><p className="admin-superior">ADMINISTRACIÓN</p><h2>Usuarios</h2></div>
                                <button type="button" className="boton-admin-principal" onClick={() => setUsuarioEditando(null)}>+ Nuevo usuario</button>
                            </div>
                            <p className="admin-descripcion">Administra los usuarios y sus roles dentro del sistema.</p>
                            {usuarioEditando !== undefined && (
                                <FormularioUsuario key={usuarioEditando?.id || "nuevo"} usuarioInicial={usuarioEditando} usuarios={usuarios}
                                    onGuardar={guardarUsuario} onCancelar={() => setUsuarioEditando(undefined)} />
                            )}
                            <TablaUsuarios usuarios={usuarios} usuarioActualId={usuario.id} onEditar={setUsuarioEditando} onEliminar={eliminarUsuario} />
                        </section>
                    )}

                    {vista === "solicitudes" && (
                        <section className="admin-vista">
                            <div className="admin-vista-header">
                                <div><p className="admin-superior">VENTAS</p><h2>Solicitudes de contacto</h2></div>
                            </div>
                            <p className="admin-descripcion">Clientes que pidieron que un vendedor los contacte. Márcalas como atendidas al llamarlos o escribirles.</p>
                            <TablaSolicitudes mensajes={mensajes} onCambiarEstado={cambiarEstado} />
                        </section>
                    )}
                </main>
            </div>
        </section>
    );
}

export default Admin;
