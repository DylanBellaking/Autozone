import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import Registro from "../../../src/pages/Registro";
import Login from "../../../src/pages/Login";
import { obtenerUsuarios } from "../../../src/services/almacenamiento";

beforeEach(() => localStorage.clear());

function renderRegistro() {
    return render(
        <MemoryRouter initialEntries={["/registro"]}>
            <Routes>
                <Route path="/registro" element={<Registro />} />
                <Route path="/login" element={<Login onLogin={() => {}} />} />
            </Routes>
        </MemoryRouter>
    );
}

function completar(datos) {
    const etiquetas = { nombre: "Nombre completo", correo: "Correo electrónico", telefono: "Teléfono", contrasena: "Contraseña", confirmacion: "Confirmar contraseña" };
    for (const [campo, valor] of Object.entries(datos)) {
        fireEvent.change(screen.getByLabelText(etiquetas[campo]), { target: { value: valor } });
    }
}

const valido = { nombre: "Ana Pérez", correo: "ana@correo.cl", telefono: "+56 9 1234 5678", contrasena: "123456", confirmacion: "123456" };

describe("Página Registro", () => {
    it("muestra un mensaje de error por cada campo vacío", () => {
        renderRegistro();
        fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));
        expect(screen.getAllByRole("alert")).toHaveLength(5);
    });

    it("avisa cuando las contraseñas no coinciden", () => {
        renderRegistro();
        completar({ ...valido, confirmacion: "654321" });
        fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));
        expect(screen.getByText("Las contraseñas no coinciden.")).toBeInTheDocument();
    });

    it("con datos válidos guarda el cliente y lleva al login con un mensaje", () => {
        renderRegistro();
        completar(valido);
        fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));
        expect(screen.getByRole("heading", { name: "Iniciar sesión" })).toBeInTheDocument();
        expect(screen.getByRole("status")).toHaveTextContent("¡Cuenta creada correctamente!");
        expect(obtenerUsuarios().some((u) => u.correo === "ana@correo.cl")).toBe(true);
    });

    it("no permite registrar un correo que ya existe", () => {
        renderRegistro();
        completar({ ...valido, correo: "admin@duoc.cl" });
        fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));
        expect(screen.getByText("Ya existe una cuenta con ese correo.")).toBeInTheDocument();
    });
});
