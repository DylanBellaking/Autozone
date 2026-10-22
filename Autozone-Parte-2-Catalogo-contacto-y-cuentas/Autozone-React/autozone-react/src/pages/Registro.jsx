import { Link, useNavigate } from "react-router-dom";
import useFormulario from "../hooks/useFormulario";
import { validarRegistro } from "../utils/validaciones";
import { registrarUsuario } from "../services/almacenamiento";
import CampoFormulario from "../components/CampoFormulario";

// =====================================================
// PÁGINA: Registro
// =====================================================
// Valida con validarRegistro (nombre, correo, teléfono, contraseña y confirmación).
// Si todo está bien, guarda al cliente y lleva al login con un mensaje.
const VACIO = { nombre: "", correo: "", telefono: "", contrasena: "", confirmacion: "" };

function Registro() {
    const navigate = useNavigate();
    const { valores, errores, validado, manejarCambio, validarTodo, setErrores } = useFormulario(VACIO, validarRegistro);

    function registrar(evento) {
        evento.preventDefault();
        if (!validarTodo()) return;
        const resultado = registrarUsuario(valores);
        if (!resultado.ok) {
            // Correo ya registrado: se muestra el error bajo el campo correo.
            setErrores({ correo: resultado.error });
            return;
        }
        navigate("/login", { state: { mensaje: "¡Cuenta creada correctamente! Ya puedes iniciar sesión." } });
    }

    const campos = [
        { nombre: "nombre", etiqueta: "Nombre completo", tipo: "text", placeholder: "Ingresa tu nombre", autoComplete: "name" },
        { nombre: "correo", etiqueta: "Correo electrónico", tipo: "email", placeholder: "Ingresa tu correo", autoComplete: "email" },
        { nombre: "telefono", etiqueta: "Teléfono", tipo: "tel", placeholder: "+56 9 1234 5678", autoComplete: "tel" },
        { nombre: "contrasena", etiqueta: "Contraseña", tipo: "password", placeholder: "Crea una contraseña", autoComplete: "new-password" },
        { nombre: "confirmacion", etiqueta: "Confirmar contraseña", tipo: "password", placeholder: "Repite tu contraseña", autoComplete: "new-password" },
    ];

    return (
        <section className="registro abierta pagina-formulario">
            <div className="registro-contenedor">
                <div className="login-logo"><span>AUTO</span><strong>ZONE</strong></div>
                <h2>Crear cuenta</h2>
                <p className="registro-subtitulo">Regístrate para disfrutar de AUTOZONE</p>
                <form onSubmit={registrar} noValidate>
                    {campos.map((c) => (
                        <CampoFormulario key={c.nombre} clase="campo-registro" id={`registro-${c.nombre}`} nombre={c.nombre}
                            etiqueta={c.etiqueta} tipo={c.tipo} placeholder={c.placeholder} autoComplete={c.autoComplete}
                            valor={valores[c.nombre]} onChange={manejarCambio} error={errores[c.nombre]} validado={validado} />
                    ))}
                    <button type="submit" className="boton-registro">Crear cuenta</button>
                </form>
                <p className="ya-cuenta">¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link></p>
            </div>
        </section>
    );
}

export default Registro;
