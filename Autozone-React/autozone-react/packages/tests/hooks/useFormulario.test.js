import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import useFormulario from "../../../src/hooks/useFormulario";

// Validación simple para probar el hook: el nombre es obligatorio.
const validar = (valores) => (valores.nombre.trim() === "" ? { nombre: "El nombre es obligatorio" } : {});
const iniciales = { nombre: "", acepta: false };
const evento = (name, value, type = "text", checked = false) => ({ target: { name, value, type, checked } });

describe("useFormulario (hook personalizado)", () => {
    it("parte con los valores iniciales, sin errores y sin validar", () => {
        const { result } = renderHook(() => useFormulario(iniciales, validar));
        expect(result.current.valores).toEqual(iniciales);
        expect(result.current.errores).toEqual({});
        expect(result.current.validado).toBe(false);
    });

    it("manejarCambio guarda texto y, en las casillas, true/false", () => {
        const { result } = renderHook(() => useFormulario(iniciales, validar));
        act(() => result.current.manejarCambio(evento("nombre", "Ana")));
        act(() => result.current.manejarCambio(evento("acepta", "on", "checkbox", true)));
        expect(result.current.valores).toEqual({ nombre: "Ana", acepta: true });
    });

    it("no muestra errores mientras se escribe si todavía no se intentó enviar", () => {
        const { result } = renderHook(() => useFormulario({ nombre: "Ana" }, validar));
        act(() => result.current.manejarCambio(evento("nombre", "")));
        expect(result.current.errores).toEqual({});
    });

    it("validarTodo devuelve false con errores y luego valida en tiempo real", () => {
        const { result } = renderHook(() => useFormulario(iniciales, validar));
        let valido;
        act(() => { valido = result.current.validarTodo(); });
        expect(valido).toBe(false);
        expect(result.current.validado).toBe(true);
        expect(result.current.errores).toEqual({ nombre: "El nombre es obligatorio" });

        // Ya se intentó enviar: al escribir se corrige el error al instante.
        act(() => result.current.manejarCambio(evento("nombre", "Ana")));
        expect(result.current.errores).toEqual({});
        act(() => { valido = result.current.validarTodo(); });
        expect(valido).toBe(true);
    });

    it("reiniciar vuelve al estado inicial o a los valores que se le pasen", () => {
        const { result } = renderHook(() => useFormulario(iniciales, validar));
        act(() => result.current.manejarCambio(evento("nombre", "Ana")));
        act(() => { result.current.validarTodo(); });
        act(() => result.current.reiniciar());
        expect(result.current.valores).toEqual(iniciales);
        expect(result.current.validado).toBe(false);
        act(() => result.current.reiniciar({ nombre: "Pedro", acepta: true }));
        expect(result.current.valores).toEqual({ nombre: "Pedro", acepta: true });
    });
});
