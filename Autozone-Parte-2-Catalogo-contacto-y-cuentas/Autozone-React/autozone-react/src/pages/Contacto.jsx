import { useState } from "react";
import useFormulario from "../hooks/useFormulario";
import { validarContacto } from "../utils/validaciones";
import { guardarMensaje } from "../services/almacenamiento";
import CampoFormulario from "../components/CampoFormulario";

// =====================================================
// PÁGINA: Contacto
// =====================================================
const VACIO = { nombre: "", correo: "", asunto: "", mensaje: "" };
const datosEmpresa = [
    { icono: "📍", titulo: "Ubicación", lineas: ["Av. Principal 1234", "Santiago, Chile"] },
    { icono: "📞", titulo: "Teléfono", lineas: ["+56 9 1234 5678"] },
    { icono: "✉", titulo: "Correo electrónico", lineas: ["contacto@autozone.cl"] },
    { icono: "🕐", titulo: "Horario", lineas: ["Lunes a viernes", "09:00 - 18:00 hrs."] },
];

function Contacto() {
    const { valores, errores, validado, manejarCambio, validarTodo, reiniciar } = useFormulario(VACIO, validarContacto);
    const [enviado, setEnviado] = useState(false);

    function enviar(evento) {
        evento.preventDefault();
        setEnviado(false);
        if (!validarTodo()) return;
        guardarMensaje("contacto", valores);
        reiniciar();
        setEnviado(true);
    }

    return (
        <section className="contacto">
            <div className="contacto-titulo">
                <p>ESTAMOS PARA AYUDARTE</p>
                <h2>Contáctanos</h2>
                <span>¿Tienes alguna pregunta? Escríbenos y te ayudaremos.</span>
            </div>

            <div className="contacto-contenido">
                <div className="contacto-info">
                    {datosEmpresa.map((dato) => (
                        <div className="info-item" key={dato.titulo}>
                            <div className="info-icono">{dato.icono}</div>
                            <div>
                                <h3>{dato.titulo}</h3>
                                <p>{dato.lineas.map((linea) => <span className="d-block" key={linea}>{linea}</span>)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="contacto-formulario">
                    <h3>Envíanos un mensaje</h3>
                    {enviado && <div className="alert alert-success" role="status">¡Mensaje enviado correctamente! Gracias por contactarte con AUTOZONE.</div>}
                    <form onSubmit={enviar} noValidate>
                        {/* fila-formulario + row de Bootstrap: 2 columnas en escritorio, 1 en celular */}
                        <div className="row g-0 gap-md-3 flex-md-nowrap">
                            <div className="col-12 col-md">
                                <CampoFormulario clase="campo-contacto" id="contacto-nombre" nombre="nombre" etiqueta="Nombre"
                                    valor={valores.nombre} onChange={manejarCambio} error={errores.nombre} validado={validado}
                                    placeholder="Ingresa tu nombre" autoComplete="name" />
                            </div>
                            <div className="col-12 col-md">
                                <CampoFormulario clase="campo-contacto" id="contacto-correo" nombre="correo" etiqueta="Correo" tipo="email"
                                    valor={valores.correo} onChange={manejarCambio} error={errores.correo} validado={validado}
                                    placeholder="Ingresa tu correo" autoComplete="email" />
                            </div>
                        </div>
                        <CampoFormulario clase="campo-contacto" id="contacto-asunto" nombre="asunto" etiqueta="Asunto"
                            valor={valores.asunto} onChange={manejarCambio} error={errores.asunto} validado={validado}
                            placeholder="¿En qué podemos ayudarte?" />
                        <CampoFormulario clase="campo-contacto" id="contacto-mensaje" nombre="mensaje" etiqueta="Mensaje" tipo="textarea"
                            valor={valores.mensaje} onChange={manejarCambio} error={errores.mensaje} validado={validado}
                            placeholder="Escribe tu mensaje..." />
                        <button type="submit" className="boton-contacto">Enviar mensaje</button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Contacto;
