// =====================================================
// VALIDACIONES DE FORMULARIOS
// =====================================================
// Funciones "puras": reciben un valor y devuelven un texto.
//   - "" (texto vacío)  → el dato es válido.
//   - "mensaje"         → el dato es inválido y ese es el error a mostrar.
// Al estar separadas de los componentes, se pueden probar fácilmente
// con pruebas unitarias (ver validaciones.test.js).

// Expresión regular del correo: texto + @ + texto + . + texto, sin espacios.
export const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarTexto(valor, minimo, mensaje) {
    return String(valor ?? "").trim().length < minimo ? mensaje : "";
}

export function validarNombre(nombre) {
    return validarTexto(nombre, 3, "El nombre debe tener al menos 3 caracteres.");
}

export function validarCorreo(correo) {
    const valor = String(correo ?? "").trim();
    if (valor === "") return "El correo es obligatorio.";
    if (!FORMATO_CORREO.test(valor)) return "Ingresa un correo válido. Ejemplo: nombre@correo.cl";
    return "";
}

// Acepta números con espacios y un "+" inicial (ej.: +56 9 1234 5678).
// Debe tener entre 8 y 12 dígitos.
export function validarTelefono(telefono) {
    const valor = String(telefono ?? "").trim();
    const soloDigitos = valor.replace(/[\s+]/g, "");
    if (!/^\+?[\d\s]+$/.test(valor) || soloDigitos.length < 8 || soloDigitos.length > 12) {
        return "Ingresa un teléfono válido (solo números, mínimo 8 dígitos).";
    }
    return "";
}

export function validarContrasena(contrasena) {
    return String(contrasena ?? "").length < 6 ? "La contraseña debe tener al menos 6 caracteres." : "";
}

export function validarConfirmacion(confirmacion, contrasena) {
    if (!confirmacion) return "Confirma tu contraseña.";
    return confirmacion !== contrasena ? "Las contraseñas no coinciden." : "";
}

export function validarSeleccion(valor, mensaje) {
    return valor ? "" : mensaje;
}

// Valida un RUN chileno con su dígito verificador (algoritmo módulo 11).
// Acepta "12.345.678-5" o "12345678-5".
export function validarRun(run) {
    const limpio = String(run ?? "").replace(/\./g, "").trim().toUpperCase();
    if (!/^\d{7,8}-[\dK]$/.test(limpio)) return "Ingresa un RUN válido. Ejemplo: 12.345.678-5";
    const [cuerpo, dv] = limpio.split("-");
    let suma = 0;
    let multiplicador = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += Number(cuerpo[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    const resto = 11 - (suma % 11);
    const dvEsperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
    return dv === dvEsperado ? "" : "El dígito verificador del RUN no es correcto.";
}

// Recibe un objeto { campo: mensaje } y deja solo los campos con error.
function soloErrores(errores) {
    return Object.fromEntries(Object.entries(errores).filter(([, mensaje]) => mensaje));
}

// true si el objeto de errores tiene al menos un error.
export function hayErrores(errores) {
    return Object.keys(errores).length > 0;
}

// ---------- Validaciones de cada formulario ----------

export function validarRegistro(datos) {
    return soloErrores({
        nombre: validarNombre(datos.nombre),
        correo: validarCorreo(datos.correo),
        telefono: validarTelefono(datos.telefono),
        contrasena: validarContrasena(datos.contrasena),
        confirmacion: validarConfirmacion(datos.confirmacion, datos.contrasena),
    });
}

export function validarLogin(datos) {
    return soloErrores({
        correo: validarCorreo(datos.correo),
        contrasena: datos.contrasena ? "" : "La contraseña es obligatoria.",
    });
}

export function validarContacto(datos) {
    return soloErrores({
        nombre: validarNombre(datos.nombre),
        correo: validarCorreo(datos.correo),
        asunto: validarTexto(datos.asunto, 3, "El asunto debe tener al menos 3 caracteres."),
        mensaje: validarTexto(datos.mensaje, 10, "El mensaje debe tener al menos 10 caracteres."),
    });
}

export function validarConsulta(datos) {
    return soloErrores({
        nombre: validarNombre(datos.nombre),
        correo: validarCorreo(datos.correo),
        telefono: validarTelefono(datos.telefono),
        mensaje: validarTexto(datos.mensaje, 10, "El mensaje debe tener al menos 10 caracteres."),
    });
}

export function validarProducto(producto) {
    const precio = Number(producto.precio);
    const stock = Number(producto.stock);
    const stockCritico = Number(producto.stockCritico);
    return soloErrores({
        codigo: validarTexto(producto.codigo, 3, "El código debe tener al menos 3 caracteres."),
        nombre: validarTexto(producto.nombre, 3, "El nombre debe tener al menos 3 caracteres."),
        descripcion: validarTexto(producto.descripcion, 10, "La descripción debe tener al menos 10 caracteres."),
        precio: producto.precio === "" || !(precio > 0) ? "El precio debe ser mayor que 0." : "",
        stock: producto.stock === "" || !Number.isInteger(stock) || stock < 0 ? "El stock debe ser un número entero mayor o igual a 0." : "",
        stockCritico:
            producto.stockCritico === "" || !Number.isInteger(stockCritico) || stockCritico < 0
                ? "El stock crítico debe ser un número entero mayor o igual a 0."
                : stockCritico > stock
                    ? "El stock crítico no puede ser mayor que el stock."
                    : "",
        categoria: validarSeleccion(producto.categoria, "Selecciona una categoría."),
        imagen: validarTexto(producto.imagen, 3, "Indica la ruta de la imagen."),
    });
}

// usuarios: lista actual (para revisar que el correo no se repita).
// idEditando: id del usuario que se está editando (su propio correo no cuenta como repetido).
export function validarUsuario(usuario, usuarios = [], idEditando = "") {
    const correoRepetido = usuarios.some(
        (u) => u.correo.toLowerCase() === String(usuario.correo).trim().toLowerCase() && u.id !== idEditando
    );
    return soloErrores({
        run: validarRun(usuario.run),
        nombre: validarNombre(usuario.nombre),
        apellidos: validarTexto(usuario.apellidos, 3, "Los apellidos deben tener al menos 3 caracteres."),
        correo: validarCorreo(usuario.correo) || (correoRepetido ? "Ya existe un usuario con ese correo." : ""),
        tipoUsuario: validarSeleccion(usuario.tipoUsuario, "Selecciona un tipo de usuario."),
    });
}
