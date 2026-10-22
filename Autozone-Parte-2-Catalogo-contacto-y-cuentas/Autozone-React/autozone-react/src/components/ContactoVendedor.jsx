import { useState } from "react";
import useFormulario from "../hooks/useFormulario";
import { validarConsulta } from "../utils/validaciones";
import { crearEnlaceLlamada, crearEnlaceWhatsApp, mensajeInicial, tituloVehiculo } from "../utils/contacto";
import { TELEFONO_VISIBLE } from "../data/empresa";
import { guardarMensaje, obtenerContactoRecordado, recordarContacto } from "../services/almacenamiento";
import CampoFormulario from "./CampoFormulario";

// =====================================================
// COMPONENTE: ContactoVendedor ("Contacta al vendedor(a)")
// =====================================================
// La venta NO se hace en la página: el cliente deja sus datos para que un vendedor
// lo contacte, o elige "Otras formas de contacto" (WhatsApp o llamada).
// La solicitud queda guardada y el administrador la ve en el panel ("Solicitudes").
// Props:
//   producto → vehículo por el que se consulta
//   onCerrar → cierra la ventana
// Estado:
//   valores / errores (hook useFormulario) y "enviada" (la solicitud guardada, o null).
function ContactoVendedor({ producto, onCerrar }) {
    // Si el cliente marcó "Recordar mi información" antes, sus datos aparecen ya escritos.
    const recordado = obtenerContactoRecordado();
    const inicial = {
        mensaje: mensajeInicial(producto),
        nombre: recordado?.nombre || "",
        correo: recordado?.correo || "",
        telefono: recordado?.telefono || "",
        recordar: Boolean(recordado),
        financiamiento: false,
    };
    const formulario = useFormulario(inicial, validarConsulta);
    const { valores, errores, validado, manejarCambio } = formulario;
    const [enviada, setEnviada] = useState(null);

    function enviar(evento) {
        evento.preventDefault(); // evita que la página se recargue
        if (!formulario.validarTodo()) return;
        recordarContacto(valores, valores.recordar);
        // A la solicitud no se le guarda la casilla "recordar" (solo sirve en este navegador).
        const datos = { ...valores };
        delete datos.recordar;
        setEnviada(guardarMensaje("solicitud", { productoId: producto.id, vehiculo: tituloVehiculo(producto), ...datos }));
    }

    // Props comunes de los campos de texto (para no repetirlas).
    const propsCampo = (nombre) => ({
        clase: "campo-consulta", id: `contacto-${nombre}`, nombre, valor: valores[nombre],
        onChange: manejarCambio, error: errores[nombre], validado,
    });

    return (
        <section className="consulta abierta" role="dialog" aria-modal="true" aria-label="Contacta al vendedor(a)">
            <div className="consulta-contenedor contacto-vendedor">
                <button type="button" className="consulta-cerrar" aria-label="Cerrar" onClick={onCerrar}>×</button>
                <h2>Contacta al vendedor(a)</h2>
                <div className="auto-consulta">
                    <span>Vehículo nuevo</span>
                    <strong>{tituloVehiculo(producto)} {producto.version}</strong>
                </div>

                {enviada ? (
                    <div className="alert alert-success mt-3" role="status">
                        ¡Listo, {enviada.nombre}! Un vendedor te contactará pronto
                        {enviada.financiamiento ? " con opciones de financiamiento" : ""} por el {tituloVehiculo(producto)}.
                    </div>
                ) : (
                    /* noValidate: la validación la hace React, no el navegador */
                    <form onSubmit={enviar} noValidate>
                        <CampoFormulario {...propsCampo("mensaje")} etiqueta="Mensaje" tipo="textarea" filas={3} placeholder="Escribe tu mensaje aquí" />
                        <CampoFormulario {...propsCampo("nombre")} etiqueta="Nombre completo" autoComplete="name" />
                        {/* Bootstrap: correo y teléfono lado a lado desde tablet (col-md-6) y uno debajo del otro en celular */}
                        <div className="row g-md-3">
                            <div className="col-12 col-md-6">
                                <CampoFormulario {...propsCampo("correo")} etiqueta="Correo electrónico" tipo="email" autoComplete="email" />
                            </div>
                            <div className="col-12 col-md-6">
                                <CampoFormulario {...propsCampo("telefono")} etiqueta="Teléfono de contacto" tipo="tel" placeholder="+56 9 1234 5678" autoComplete="tel" />
                            </div>
                        </div>
                        <CampoFormulario id="contacto-recordar" nombre="recordar" tipo="checkbox" etiqueta="Recordar mi información"
                            valor={valores.recordar} onChange={manejarCambio} />
                        <CampoFormulario id="contacto-financiamiento" nombre="financiamiento" tipo="checkbox" etiqueta="¿Necesitas financiamiento?"
                            valor={valores.financiamiento} onChange={manejarCambio} />
                        <p className="texto-legal">Al enviar el formulario estás aceptando los Términos y Condiciones y nuestras Políticas de Privacidad.</p>
                        <button type="submit" className="boton-enviar-consulta">Contacta al vendedor</button>
                    </form>
                )}

                <div className="otras-formas">
                    <h3>Otras formas de contacto</h3>
                    <a className="boton-whatsapp" href={crearEnlaceWhatsApp(producto)} target="_blank" rel="noopener noreferrer">
                        💬 Chatear por WhatsApp
                    </a>
                    <a className="boton-llamar" href={crearEnlaceLlamada()}>📞 Llamar al {TELEFONO_VISIBLE}</a>
                </div>
            </div>
        </section>
    );
}

export default ContactoVendedor;
