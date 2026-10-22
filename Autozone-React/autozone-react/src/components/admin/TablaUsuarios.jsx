// =====================================================
// COMPONENTE: TablaUsuarios
// =====================================================
// Props: usuarios, usuarioActualId (para no permitir eliminarse a sí mismo), onEditar, onEliminar
function TablaUsuarios({ usuarios, usuarioActualId, onEditar, onEliminar }) {
    return (
        <div className="table-responsive tabla-autozone">
            <table className="table table-dark table-hover align-middle mb-0">
                <thead>
                    <tr>
                        <th>RUN</th><th>Nombre</th><th>Correo</th><th>Rol</th><th className="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                            <td>{usuario.run || "—"}</td>
                            <td><strong>{usuario.nombre} {usuario.apellidos}</strong></td>
                            <td>{usuario.correo}</td>
                            <td className={usuario.tipoUsuario === "Admin" ? "rol-admin" : ""}>{usuario.tipoUsuario.toUpperCase()}</td>
                            <td className="text-end">
                                <div className="admin-acciones justify-content-end">
                                    <button type="button" onClick={() => onEditar(usuario)} aria-label={`Editar ${usuario.correo}`}>Editar</button>
                                    {/* No se puede eliminar al usuario que tiene la sesión abierta */}
                                    <button type="button" onClick={() => onEliminar(usuario)} disabled={usuario.id === usuarioActualId}
                                        aria-label={`Eliminar ${usuario.correo}`}>Eliminar</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TablaUsuarios;
