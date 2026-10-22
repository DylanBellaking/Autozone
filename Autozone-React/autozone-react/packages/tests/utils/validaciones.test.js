import { describe, expect, it } from "vitest";
import {
    hayErrores, validarConfirmacion, validarConsulta, validarContacto, validarContrasena, validarCorreo,
    validarLogin, validarNombre, validarProducto, validarRegistro, validarRun, validarTelefono, validarUsuario,
} from "../../../src/utils/validaciones";

// Pruebas de las funciones de validación (lógica pura, sin componentes).
describe("validarCorreo", () => {
    it("acepta un correo con formato correcto", () => {
        expect(validarCorreo("ana@correo.cl")).toBe("");
    });
    it("rechaza un correo vacío", () => {
        expect(validarCorreo("   ")).toBe("El correo es obligatorio.");
    });
    it("rechaza un correo sin @ o sin dominio", () => {
        expect(validarCorreo("anacorreo.cl")).toMatch(/correo válido/);
        expect(validarCorreo("ana@correo")).toMatch(/correo válido/);
    });
});

describe("validarNombre y validarContrasena", () => {
    it("exige al menos 3 caracteres en el nombre (sin contar espacios)", () => {
        expect(validarNombre("Jo")).toBe("El nombre debe tener al menos 3 caracteres.");
        expect(validarNombre("  Jo  ")).not.toBe("");
        expect(validarNombre("Juan")).toBe("");
    });
    it("exige al menos 6 caracteres en la contraseña", () => {
        expect(validarContrasena("12345")).toMatch(/al menos 6/);
        expect(validarContrasena("123456")).toBe("");
    });
});

describe("validarTelefono", () => {
    it("acepta formatos chilenos con + y espacios", () => {
        expect(validarTelefono("+56 9 1234 5678")).toBe("");
        expect(validarTelefono("912345678")).toBe("");
    });
    it("rechaza letras o menos de 8 dígitos", () => {
        expect(validarTelefono("91234abc")).not.toBe("");
        expect(validarTelefono("1234567")).not.toBe("");
    });
});

describe("validarConfirmacion", () => {
    it("detecta contraseñas distintas", () => {
        expect(validarConfirmacion("abcdef", "123456")).toBe("Las contraseñas no coinciden.");
    });
    it("acepta contraseñas iguales y pide confirmar si está vacía", () => {
        expect(validarConfirmacion("123456", "123456")).toBe("");
        expect(validarConfirmacion("", "123456")).toBe("Confirma tu contraseña.");
    });
});

describe("validarRun (dígito verificador módulo 11)", () => {
    it("acepta RUN válidos, con o sin puntos, incluido el dígito K", () => {
        expect(validarRun("12.345.678-5")).toBe("");
        expect(validarRun("11111111-1")).toBe("");
        expect(validarRun("10.000.013-k")).toBe("");
    });
    it("rechaza un dígito verificador incorrecto o un formato inválido", () => {
        expect(validarRun("12.345.678-9")).toMatch(/dígito verificador/);
        expect(validarRun("abc")).toMatch(/RUN válido/);
    });
});

describe("validaciones de formularios completos", () => {
    const registroValido = { nombre: "Ana Pérez", correo: "ana@correo.cl", telefono: "912345678", contrasena: "123456", confirmacion: "123456" };

    it("validarRegistro no devuelve errores con datos correctos", () => {
        expect(validarRegistro(registroValido)).toEqual({});
        expect(hayErrores(validarRegistro(registroValido))).toBe(false);
    });

    it("validarRegistro devuelve un error por cada campo inválido", () => {
        const errores = validarRegistro({ nombre: "", correo: "x", telefono: "1", contrasena: "1", confirmacion: "2" });
        expect(Object.keys(errores)).toEqual(["nombre", "correo", "telefono", "contrasena", "confirmacion"]);
        expect(hayErrores(errores)).toBe(true);
    });

    it("validarLogin, validarContacto y validarConsulta marcan los campos obligatorios", () => {
        expect(validarLogin({ correo: "", contrasena: "" })).toHaveProperty("contrasena");
        expect(validarContacto({ nombre: "Ana", correo: "a@b.cl", asunto: "Hola", mensaje: "corto" })).toEqual({
            mensaje: "El mensaje debe tener al menos 10 caracteres.",
        });
        expect(validarConsulta({ nombre: "Ana", correo: "a@b.cl", telefono: "123", mensaje: "Me interesa el auto" })).toEqual({
            telefono: "Ingresa un teléfono válido (solo números, mínimo 8 dígitos).",
        });
    });
});

describe("validarProducto", () => {
    const producto = { codigo: "A005", nombre: "Kia Sportage", descripcion: "SUV familiar y cómodo", precio: "20000000", stock: "3", stockCritico: "1", categoria: "SUV", imagen: "/img/auto1.jpg" };

    it("acepta un producto correcto", () => {
        expect(validarProducto(producto)).toEqual({});
    });
    it("no permite que el stock crítico sea mayor que el stock", () => {
        expect(validarProducto({ ...producto, stockCritico: "5" })).toEqual({
            stockCritico: "El stock crítico no puede ser mayor que el stock.",
        });
    });
    it("exige precio mayor que 0 y stock entero no negativo", () => {
        const errores = validarProducto({ ...producto, precio: "0", stock: "-1" });
        expect(errores.precio).toMatch(/mayor que 0/);
        expect(errores.stock).toMatch(/entero/);
    });
});

describe("validarUsuario", () => {
    const usuarios = [{ id: "u1", correo: "admin@duoc.cl" }];
    const nuevo = { run: "11111111-1", nombre: "Pedro", apellidos: "Soto", correo: "ADMIN@duoc.cl", tipoUsuario: "Cliente" };

    it("no permite repetir un correo existente (sin importar mayúsculas)", () => {
        expect(validarUsuario(nuevo, usuarios)).toEqual({ correo: "Ya existe un usuario con ese correo." });
    });
    it("permite mantener el mismo correo al editar al mismo usuario", () => {
        expect(validarUsuario(nuevo, usuarios, "u1")).toEqual({});
    });
});
