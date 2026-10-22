import useFormulario from "../../hooks/useFormulario";
import { validarUsuario } from "../../utils/validaciones";
import regiones from "../../data/regiones";
import CampoFormulario from "../CampoFormulario";

// =====================================================
// COMPONENTE: FormularioUsuario (crear / editar usuario)
// =====================================================
// Props:
//   usuarioInicial → usuario a editar (null = nuevo)
//   usuarios       → lista actual (para no repetir correos)
//   onGuardar      → recibe el usuario validado
//   onCancelar     → cierra el formulario
const USUARIO_VACIO = {
    run: "", nombre: "", apellidos: "", correo: "", fechaNacimiento: "", tipoUsuario: "", region: "", comuna: "", direccion: "",
};
const ROLES = [
    { valor: "", texto: "Seleccionar rol" },
    { valor: "Admin", texto: "Administrador" },
    { valor: "Vendedor", texto: "Vendedor" },
    { valor: "Cliente", texto: "Cliente" },
];
const OPCIONES_REGION = [{ valor: "", texto: "Seleccionar región" }, ...regiones.map((r) => ({ valor: r, texto: r }))];

function FormularioUsuario({ usuarioInicial, usuarios, onGuardar, onCancelar }) {
    const idEditando = usuarioInicial?.id || "";
    // La validación recibe también la lista de usuarios para revisar correos repetidos.
    const { valores, errores, validado, manejarCambio, validarTodo } = useFormulario(
        usuarioInicial ? { ...USUARIO_VACIO, ...usuarioInicial } : USUARIO_VACIO,
        (datos) => validarUsuario(datos, usuarios, idEditando)
    );

    function guardar(evento) {
        evento.preventDefault();
        if (!validarTodo()) return;
        onGuardar({ ...valores, correo: valores.correo.trim().toLowerCase(), nombre: valores.nombre.trim(), apellidos: valores.apellidos.trim() });
    }

    const campo = (nombre, etiqueta, extra = {}) => (
        <CampoFormulario clase={`campo-admin ${extra.completo ? "campo-admin-completo" : ""}`} id={`usuario-${nombre}`}
            nombre={nombre} etiqueta={etiqueta} valor={valores[nombre]} onChange={manejarCambio}
            error={errores[nombre]} validado={validado} {...extra} />
    );

    return (
        <div id="formulario-usuario-admin" className="formulario-admin">
            <div className="formulario-admin-header">
                <div>
                    <p className="admin-superior">ADMINISTRACIÓN</p>
                    <h3>{usuarioInicial ? "Editar usuario" : "Nuevo usuario"}</h3>
                </div>
            </div>
            <form onSubmit={guardar} noValidate>
                <div className="formulario-grid">
                    {campo("run", "RUN", { placeholder: "12.345.678-5" })}
                    {campo("nombre", "Nombre")}
                    {campo("apellidos", "Apellidos")}
                    {campo("correo", "Correo electrónico", { tipo: "email" })}
                    {campo("fechaNacimiento", "Fecha de nacimiento", { tipo: "date" })}
                    {campo("tipoUsuario", "Tipo de usuario", { tipo: "select", opciones: ROLES })}
                    {campo("region", "Región", { tipo: "select", opciones: OPCIONES_REGION })}
                    {campo("comuna", "Comuna", { placeholder: "Santiago" })}
                    {campo("direccion", "Dirección", { completo: true })}
                </div>
                <div className="formulario-admin-botones">
                    <button type="submit" className="boton-admin-principal">Guardar usuario</button>
                    <button type="button" className="boton-admin-secundario" onClick={onCancelar}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}

export default FormularioUsuario;
