// =====================================================
// COMPONENTE: TablaSolicitudes
// =====================================================
// Lista las solicitudes "Contacta al vendedor" y los mensajes de la página Contacto.
// Props:
//   mensajes         → lista de solicitudes/mensajes
//   onCambiarEstado  → recibe la solicitud para marcarla Pendiente ↔ Atendida
function formatearFecha(iso) {
    return new Date(iso).toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" });
}

function TablaSolicitudes({ mensajes, onCambiarEstado }) {
    if (mensajes.length === 0) {
        return <p className="admin-descripcion">Todavía no hay solicitudes de contacto.</p>;
    }
    // Las más recientes primero (se copia la lista para no modificar la original).
    const ordenados = [...mensajes].sort((a, b) => b.fecha.localeCompare(a.fecha));

    return (
        <div className="table-responsive tabla-autozone">
            <table className="table table-dark table-hover align-middle mb-0">
                <thead>
                    <tr>
                        <th>Fecha</th><th>Cliente</th><th>Vehículo / Asunto</th><th>Financiamiento</th><th>Mensaje</th><th className="text-end">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {ordenados.map((m) => (
                        <tr key={m.id}>
                            <td className="text-nowrap">{formatearFecha(m.fecha)}</td>
                            <td>
                                <strong>{m.nombre}</strong>
                                <span className="d-block dato-secundario">{m.correo}</span>
                                {m.telefono && <span className="d-block dato-secundario">{m.telefono}</span>}
                            </td>
                            <td>{m.tipo === "solicitud" ? m.vehiculo : `Contacto: ${m.asunto}`}</td>
                            <td>{m.tipo === "solicitud" ? (m.financiamiento ? "Sí" : "No") : "—"}</td>
                            <td className="mensaje-celda">{m.mensaje}</td>
                            <td className="text-end">
                                <button type="button" className={`boton-estado ${m.estado === "Atendida" ? "atendida" : ""}`}
                                    onClick={() => onCambiarEstado(m)} aria-label={`Cambiar estado de ${m.nombre}: ${m.estado}`}>
                                    {m.estado}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TablaSolicitudes;
