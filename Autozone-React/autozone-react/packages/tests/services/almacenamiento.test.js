import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    ADMIN_INICIAL, CLAVES, autenticar, cerrarSesion, guardarFavoritos, guardarMensaje, guardarSesion, leer,
    obtenerContactoRecordado, obtenerFavoritos, obtenerMensajes, obtenerProductos, obtenerUsuarios,
    recordarContacto, registrarUsuario,
} from "../../../src/services/almacenamiento";

// localStorage existe gracias a jsdom. Antes de cada prueba se limpia,
// para que una prueba no afecte a la siguiente.
beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe("productos", () => {
    it("la primera vez carga los 4 autos iniciales y los guarda en localStorage", () => {
        // MOCK: espiamos setItem para comprobar que se llamó con la clave correcta.
        const espia = vi.spyOn(Storage.prototype, "setItem");
        const productos = obtenerProductos();
        expect(productos).toHaveLength(4);
        expect(espia).toHaveBeenCalledWith(CLAVES.productos, expect.any(String));
    });

    it("no rompe la página si los datos guardados están dañados", () => {
        localStorage.setItem(CLAVES.productos, "{esto no es JSON");
        expect(() => obtenerProductos()).not.toThrow();
        expect(obtenerProductos()).toHaveLength(4);
        expect(leer("clave-inexistente", "por defecto")).toBe("por defecto");
    });

    it("completa los campos faltantes con el catálogo inicial (spread)", () => {
        localStorage.setItem(CLAVES.productos, JSON.stringify([{ id: "bmw", precio: 1000 }]));
        const [bmw] = obtenerProductos();
        expect(bmw.precio).toBe(1000);          // se respeta el dato guardado
        expect(bmw.marca).toBe("BMW");           // se completa desde el catálogo
    });
});

describe("usuarios y sesión", () => {
    it("siempre existe el administrador por defecto", () => {
        expect(obtenerUsuarios()[0].correo).toBe(ADMIN_INICIAL.correo);
    });

    it("registra un cliente nuevo y rechaza correos repetidos", () => {
        const datos = { nombre: "Ana", correo: "Ana@Correo.cl", telefono: "912345678", contrasena: "123456" };
        expect(registrarUsuario(datos).ok).toBe(true);
        expect(registrarUsuario(datos)).toEqual({ ok: false, error: "Ya existe una cuenta con ese correo." });
        expect(obtenerUsuarios().find((u) => u.correo === "ana@correo.cl").tipoUsuario).toBe("Cliente");
    });

    it("autentica sin importar mayúsculas en el correo, pero exige la contraseña exacta", () => {
        expect(autenticar("ADMIN@duoc.cl", "123456").tipoUsuario).toBe("Admin");
        expect(autenticar("admin@duoc.cl", "otra")).toBeNull();
    });

    it("guarda la sesión SIN la contraseña y la borra al cerrar sesión", () => {
        const sesion = guardarSesion(ADMIN_INICIAL);
        expect(sesion).not.toHaveProperty("contrasena");
        const espia = vi.spyOn(Storage.prototype, "removeItem");
        cerrarSesion();
        expect(espia).toHaveBeenCalledWith(CLAVES.sesion);
        expect(localStorage.getItem(CLAVES.sesion)).toBeNull();
    });
});

describe("solicitudes de contacto", () => {
    it("guarda la solicitud como Pendiente, con id y fecha", () => {
        const solicitud = guardarMensaje("solicitud", { nombre: "Ana", vehiculo: "2026 BMW Serie 3", financiamiento: true });
        expect(solicitud).toMatchObject({ tipo: "solicitud", estado: "Pendiente", financiamiento: true });
        expect(solicitud.id).toMatch(/^mensaje-/);
        expect(obtenerMensajes()).toHaveLength(1);
    });
});

describe("recordar mi información y favoritos", () => {
    it("recuerda los datos de contacto solo si el cliente lo pide", () => {
        const datos = { nombre: "Ana", correo: "ana@correo.cl", telefono: "912345678", mensaje: "no se guarda" };
        recordarContacto(datos, true);
        expect(obtenerContactoRecordado()).toEqual({ nombre: "Ana", correo: "ana@correo.cl", telefono: "912345678" });
        recordarContacto(datos, false);
        expect(obtenerContactoRecordado()).toBeNull();
    });

    it("guarda y lee la lista de favoritos", () => {
        expect(obtenerFavoritos()).toEqual([]);
        guardarFavoritos(["bmw", "audi"]);
        expect(obtenerFavoritos()).toEqual(["bmw", "audi"]);
    });
});
