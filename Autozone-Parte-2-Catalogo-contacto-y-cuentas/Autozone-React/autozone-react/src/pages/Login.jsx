import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useFormulario from "../hooks/useFormulario";
import { validarCorreo, validarLogin } from "../utils/validaciones";
import { autenticar } from "../services/almacenamiento";
import CampoFormulario from "../components/CampoFormulario";

// =====================================================
// PÁGINA: Login (+ recuperar contraseña)
// =====================================================
// Props:
//   onLogin → función de App que guarda la sesión (recibe el usuario)
// Estado:
//   modo            → "login" o "recuperar" (qué tarjeta se muestra)
//   errorGeneral    → mensaje cuando el correo o la contraseña no coinciden
//   correoRecuperar / mensajeRecuperar → formulario de recuperar contraseña
function Login({ onLogin }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { valores, errores, validado, manejarCambio, validarTodo } = useFormulario({ correo: "", contrasena: "" }, validarLogin);
    const [modo, setModo] = useState("login");
    const [errorGeneral, setErrorGeneral] = useState("");
    const [correoRecuperar, setCorreoRecuperar] = useState("");
    const [mensajeRecuperar, setMensajeRecuperar] = useState({ tipo: "", texto: "" });

    // Mensaje que llega desde Registro ("Cuenta creada...").
    const mensajeRegistro = location.state?.mensaje;

    function iniciarSesion(evento) {
        evento.preventDefault();
        setErrorGeneral("");
        if (!validarTodo()) return;
        const usuario = autenticar(valores.correo, valores.contrasena);
        if (!usuario) {
            setErrorGeneral("Correo o contraseña incorrectos.");
            return;
        }
        onLogin(usuario);
        // El administrador va a su panel; los demás, al inicio.
        navigate(usuario.tipoUsuario === "Admin" ? "/admin" : "/");
    }

    function recuperar(evento) {
        evento.preventDefault();
        const error = validarCorreo(correoRecuperar);
        setMensajeRecuperar(error
            ? { tipo: "danger", texto: error }
            : { tipo: "success", texto: "Si el correo está registrado, te enviaremos instrucciones para recuperar tu cuenta." });
    }

    if (modo === "recuperar") {
        return (
            <section className="recuperar abierta pagina-formulario">
                <div className="recuperar-contenedor">
                    <div className="login-logo"><span>AUTO</span><strong>ZONE</strong></div>
                    <h2>¿Olvidaste tu contraseña?</h2>
                    <p className="recuperar-texto">No te preocupes. Ingresa tu correo electrónico y te enviaremos instrucciones para recuperar tu cuenta.</p>
                    {mensajeRecuperar.texto && <div className={`alert alert-${mensajeRecuperar.tipo}`} role="status">{mensajeRecuperar.texto}</div>}
                    <form onSubmit={recuperar} noValidate>
                        <CampoFormulario id="correo-recuperacion" nombre="correoRecuperar" etiqueta="Correo electrónico" tipo="email"
                            valor={correoRecuperar} onChange={(e) => setCorreoRecuperar(e.target.value)} placeholder="Ingresa tu correo" autoComplete="email" />
                        <button type="submit" className="boton-login">Recuperar contraseña</button>
                    </form>
                    <p className="volver-login">
                        <button type="button" className="enlace-boton" onClick={() => { setModo("login"); setMensajeRecuperar({ tipo: "", texto: "" }); }}>
                            ← Volver a iniciar sesión
                        </button>
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="login abierta pagina-formulario">
            <div className="login-contenedor">
                <div className="login-logo"><span>AUTO</span><strong>ZONE</strong></div>
                <h2>Iniciar sesión</h2>
                <p className="login-subtitulo">Ingresa a tu cuenta</p>
                {mensajeRegistro && <div className="alert alert-success" role="status">{mensajeRegistro}</div>}
                {errorGeneral && <div className="alert alert-danger" role="alert">{errorGeneral}</div>}
                <form onSubmit={iniciarSesion} noValidate>
                    <CampoFormulario id="correo" nombre="correo" etiqueta="Correo electrónico" tipo="email"
                        valor={valores.correo} onChange={manejarCambio} error={errores.correo} validado={validado}
                        placeholder="Ingresa tu correo" autoComplete="email" />
                    <CampoFormulario id="contrasena" nombre="contrasena" etiqueta="Contraseña" tipo="password"
                        valor={valores.contrasena} onChange={manejarCambio} error={errores.contrasena} validado={validado}
                        placeholder="Ingresa tu contraseña" autoComplete="current-password" />
                    <div className="recordar">
                        <span></span>
                        <button type="button" className="enlace-boton" onClick={() => setModo("recuperar")}>¿Olvidaste tu contraseña?</button>
                    </div>
                    <button type="submit" className="boton-login">Iniciar sesión</button>
                </form>
                <p className="registrarse">¿No tienes una cuenta? <Link to="/registro">Registrarse</Link></p>
            </div>
        </section>
    );
}

export default Login;
