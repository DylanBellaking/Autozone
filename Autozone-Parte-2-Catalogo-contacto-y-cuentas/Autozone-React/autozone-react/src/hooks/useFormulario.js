import { useState } from "react";

// =====================================================
// HOOK PERSONALIZADO: useFormulario
// =====================================================
// Reúne la lógica que comparten TODOS los formularios:
//   - valores:  lo que el usuario escribe (estado)
//   - errores:  mensajes de validación de cada campo (estado)
//   - validado: si ya se intentó enviar (desde ahí se valida en tiempo real)
//
// Parámetros:
//   valoresIniciales → objeto con los campos vacíos, ej. { nombre: "", correo: "" }
//   validar          → función que recibe los valores y devuelve { campo: "error" }
export default function useFormulario(valoresIniciales, validar) {
    const [valores, setValores] = useState(valoresIniciales);
    const [errores, setErrores] = useState({});
    const [validado, setValidado] = useState(false);

    // Se ejecuta cada vez que el usuario escribe en un campo o marca una casilla.
    // Usa el atributo "name" del input para saber qué campo cambió.
    // En las casillas (checkbox) se guarda true/false en vez de texto.
    function manejarCambio(evento) {
        const { name, value, type, checked } = evento.target;
        const nuevosValores = { ...valores, [name]: type === "checkbox" ? checked : value };
        setValores(nuevosValores);
        // Después del primer intento de envío, valida mientras se escribe.
        if (validado) setErrores(validar(nuevosValores));
    }

    // Valida todo el formulario. Devuelve true si no hay errores.
    function validarTodo() {
        const nuevosErrores = validar(valores);
        setErrores(nuevosErrores);
        setValidado(true);
        return Object.keys(nuevosErrores).length === 0;
    }

    // Vuelve el formulario a su estado inicial (por ejemplo, después de enviarlo).
    function reiniciar(nuevosValores = valoresIniciales) {
        setValores(nuevosValores);
        setErrores({});
        setValidado(false);
    }

    return { valores, errores, validado, manejarCambio, validarTodo, reiniciar, setErrores };
}
