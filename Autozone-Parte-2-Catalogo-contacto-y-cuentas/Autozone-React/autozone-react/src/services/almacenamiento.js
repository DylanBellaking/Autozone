// =====================================================
// SERVICIO DE ALMACENAMIENTO (localStorage)
// =====================================================
// Así es más ordenado y en las pruebas se puede simular (mock) fácilmente.
import productosIniciales from "../data/productosIniciales";

export const CLAVES = {
    productos: "productosAUTOZONE",
    usuarios: "usuariosAUTOZONE",
    sesion: "usuarioActivoAUTOZONE",
    mensajes: "mensajesAUTOZONE",
    contactoRecordado: "contactoAUTOZONE",
    favoritos: "favoritosAUTOZONE",
};

export const ADMIN_INICIAL = {
    id: "usuario-1",
    run: "12.345.678-5",
    nombre: "Administrador",
    apellidos: "AUTOZONE",
    correo: "admin@duoc.cl",
    contrasena: "123456",
    telefono: "",
    tipoUsuario: "Admin",
    region: "Región Metropolitana",
    comuna: "Santiago",
    direccion: "Av. Principal 123",
};

// Lee una clave y la convierte de JSON a datos.
// Si no existe o el JSON está dañado, devuelve el valor por defecto (no rompe la página).
export function leer(clave, porDefecto) {
    try {
        const texto = localStorage.getItem(clave);
        return texto === null ? porDefecto : JSON.parse(texto);
    } catch {
        return porDefecto;
    }
}

export function guardar(clave, valor) {
    localStorage.setItem(clave, JSON.stringify(valor));
}

// ---------- Productos ----------

export function obtenerProductos() {
    const guardados = leer(CLAVES.productos, null);
    if (!Array.isArray(guardados)) {
        guardar(CLAVES.productos, productosIniciales);
        return productosIniciales;
    }
    // Completa los campos que falten con los del catálogo inicial (operador spread).
    return guardados.map((producto) => {
        const base = productosIniciales.find((p) => p.id === producto.id);
        if (!base) return producto;
        const actualizado = { ...base, ...producto };
        // Actualiza las fotos anteriores de estos dos modelos sin alterar galerías personalizadas.
        if (["mercedes", "toyota"].includes(producto.id) && Array.isArray(producto.imagenesInterior)) {
            actualizado.imagenesInterior = producto.imagenesInterior.map((imagen) => {
                const anterior = imagen.src?.match(/^\/img\/(mercedes|toyota)\/interior-(beige|negro|marron|gris|rojo)\.(jpg|png)$/);
                if (!anterior || anterior[1] !== producto.id) return imagen;
                return base.imagenesInterior.find((foto) => foto.src.includes(`/interior-${anterior[2]}-v2.`)) || imagen;
            });
        }
        // Sustituye únicamente la galería antigua incluida con el proyecto.
        if (producto.id === "bmw" && producto.imagenesInterior?.some(
            (imagen) => /^\/img\/bmw\/(Interior_(blanco|negro|rojo)|serie3-2026-(ambiente|tablero|molduras))\.jpg$/.test(imagen.src)
        )) {
            actualizado.imagenesInterior = base.imagenesInterior;
        }
        return actualizado;
    });
}

export function guardarProductos(productos) {
    guardar(CLAVES.productos, productos);
}

// ---------- Usuarios y sesión ----------

export function obtenerUsuarios() {
    const usuarios = leer(CLAVES.usuarios, []);
    const lista = Array.isArray(usuarios) ? usuarios : [];
    // El administrador por defecto siempre debe existir.
    if (!lista.some((u) => u.correo?.toLowerCase() === ADMIN_INICIAL.correo)) {
        lista.unshift(ADMIN_INICIAL);
        guardar(CLAVES.usuarios, lista);
    }
    return lista;
}

export function guardarUsuarios(usuarios) {
    guardar(CLAVES.usuarios, usuarios);
}

// Registra un cliente nuevo. Devuelve { ok: true, usuario } o { ok: false, error }.
export function registrarUsuario(datos) {
    const usuarios = obtenerUsuarios();
    const correo = datos.correo.trim().toLowerCase();
    if (usuarios.some((u) => u.correo.toLowerCase() === correo)) {
        return { ok: false, error: "Ya existe una cuenta con ese correo." };
    }
    const usuario = {
        id: "usuario-" + Date.now(),
        run: "",
        nombre: datos.nombre.trim(),
        apellidos: "",
        correo,
        contrasena: datos.contrasena,
        telefono: datos.telefono.trim(),
        tipoUsuario: "Cliente",
        region: "",
        comuna: "",
        direccion: "",
    };
    guardarUsuarios([...usuarios, usuario]);
    return { ok: true, usuario };
}

// Busca un usuario con ese correo (sin importar mayúsculas) y contraseña exacta.
export function autenticar(correo, contrasena) {
    const buscado = String(correo).trim().toLowerCase();
    return obtenerUsuarios().find((u) => u.correo.toLowerCase() === buscado && u.contrasena === contrasena) || null;
}

export function obtenerSesion() {
    return leer(CLAVES.sesion, null);
}

export function guardarSesion(usuario) {
    // No se guarda la contraseña en la sesión: se copia el usuario y se borra ese campo.
    const datosPublicos = { ...usuario };
    delete datosPublicos.contrasena;
    guardar(CLAVES.sesion, datosPublicos);
    return datosPublicos;
}

export function cerrarSesion() {
    localStorage.removeItem(CLAVES.sesion);
}

// ---------- Solicitudes de contacto y mensajes ----------

export function obtenerMensajes() {
    const mensajes = leer(CLAVES.mensajes, []);
    return Array.isArray(mensajes) ? mensajes : [];
}

export function guardarMensajes(mensajes) {
    guardar(CLAVES.mensajes, mensajes);
}

// Guarda una solicitud de contacto (tipo "solicitud") o un mensaje de la página Contacto
// (tipo "contacto"). Queda "Pendiente" hasta que el administrador la marque como atendida.
export function guardarMensaje(tipo, datos) {
    const mensaje = {
        id: "mensaje-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
        tipo,
        ...datos,
        estado: "Pendiente",
        fecha: new Date().toISOString(),
    };
    guardarMensajes([...obtenerMensajes(), mensaje]);
    return mensaje;
}

// ---------- "Recordar mi información" y favoritos ----------

// Devuelve { nombre, correo, telefono } guardados, o null si el cliente no pidió recordarlos.
export function obtenerContactoRecordado() {
    return leer(CLAVES.contactoRecordado, null);
}

export function recordarContacto(datos, recordar) {
    if (recordar) {
        guardar(CLAVES.contactoRecordado, { nombre: datos.nombre, correo: datos.correo, telefono: datos.telefono });
    } else {
        localStorage.removeItem(CLAVES.contactoRecordado);
    }
}

export function obtenerFavoritos() {
    const favoritos = leer(CLAVES.favoritos, []);
    return Array.isArray(favoritos) ? favoritos : [];
}

export function guardarFavoritos(favoritos) {
    guardar(CLAVES.favoritos, favoritos);
}
