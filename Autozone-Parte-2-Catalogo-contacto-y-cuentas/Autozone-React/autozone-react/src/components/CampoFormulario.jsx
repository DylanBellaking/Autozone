// =====================================================
// COMPONENTE REUTILIZABLE: CampoFormulario
// =====================================================
// Dibuja: etiqueta (label) + campo (input, textarea o select) + mensaje de validación.
// Se usa en TODOS los formularios del sitio; solo cambian sus PROPS.
//
// Props:
//   id, nombre        → id del campo y su "name" (el name indica qué valor del estado cambia)
//   etiqueta          → texto del label
//   tipo              → "text", "email", "tel", "password", "number", "date", "textarea", "select" o "checkbox"
//   valor, onChange   → campo CONTROLADO: el valor viene del estado del formulario
//   error             → mensaje de error (si viene vacío, el campo es válido)
//   validado          → true cuando ya se intentó enviar (muestra verde / rojo)
//   opciones          → para select: [{ valor, texto }]
//   clase             → clase CSS del contenedor (ej. "campo-compra") para mantener el diseño
function CampoFormulario({
    id, nombre, etiqueta, tipo = "text", valor, onChange, error = "", validado = false,
    placeholder = "", opciones = [], clase = "campo", autoComplete, filas = 4,
}) {
    // Clase del campo según su estado: rojo si hay error, verde si es válido.
    const claseEstado = error ? "campo-error" : validado ? "campo-correcto" : "";
    const idMensaje = `${id}-mensaje`;

    // Atributos que comparten input, textarea y select.
    const comunes = {
        id,
        name: nombre,
        value: valor,
        onChange,
        className: claseEstado,
        "aria-invalid": Boolean(error),
        "aria-describedby": error || validado ? idMensaje : undefined,
    };

    // La casilla de verificación se dibuja distinto: primero la casilla y luego el texto.
    if (tipo === "checkbox") {
        return (
            <div className="form-check casilla-autozone">
                <input id={id} name={nombre} type="checkbox" className="form-check-input" checked={Boolean(valor)} onChange={onChange} />
                <label className="form-check-label" htmlFor={id}>{etiqueta}</label>
            </div>
        );
    }

    let campo;
    if (tipo === "textarea") {
        campo = <textarea {...comunes} rows={filas} placeholder={placeholder} />;
    } else if (tipo === "select") {
        campo = (
            <select {...comunes}>
                {opciones.map((opcion) => (
                    <option key={opcion.valor} value={opcion.valor}>{opcion.texto}</option>
                ))}
            </select>
        );
    } else {
        campo = <input {...comunes} type={tipo} placeholder={placeholder} autoComplete={autoComplete} />;
    }

    return (
        <div className={clase}>
            {/* htmlFor conecta la etiqueta con el campo (accesibilidad) */}
            <label htmlFor={id}>{etiqueta}</label>
            {campo}
            {/* Renderizado condicional: solo se muestra si hay error o si ya se validó */}
            {error && (
                <span id={idMensaje} className="mensaje-validacion mensaje-error" role="alert">{error}</span>
            )}
            {!error && validado && (
                <span id={idMensaje} className="mensaje-validacion mensaje-correcto">✓ Correcto</span>
            )}
        </div>
    );
}

export default CampoFormulario;
