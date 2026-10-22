import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Login from "../../../src/pages/Login";

beforeEach(() => localStorage.clear());

function renderLogin(onLogin = vi.fn()) {
    render(
        <MemoryRouter initialEntries={["/login"]}>
            <Routes>
                <Route path="/login" element={<Login onLogin={onLogin} />} />
                <Route path="/admin" element={<p>Panel de administración</p>} />
                <Route path="/" element={<p>Inicio</p>} />
            </Routes>
        </MemoryRouter>
    );
    return onLogin;
}

function ingresar(correo, contrasena) {
    fireEvent.change(screen.getByLabelText("Correo electrónico"), { target: { value: correo } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: contrasena } });
    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
}

describe("Página Login", () => {
    it("valida los campos antes de buscar al usuario", () => {
        const onLogin = renderLogin();
        ingresar("correo-malo", "");
        expect(screen.getByText(/Ingresa un correo válido/)).toBeInTheDocument();
        expect(screen.getByText("La contraseña es obligatoria.")).toBeInTheDocument();
        expect(onLogin).not.toHaveBeenCalled();
    });

    it("muestra un error si la contraseña no coincide", () => {
        renderLogin();
        ingresar("admin@duoc.cl", "equivocada");
        expect(screen.getByText("Correo o contraseña incorrectos.")).toBeInTheDocument();
    });

    it("el administrador inicia sesión y va al panel (onLogin es un MOCK)", () => {
        const onLogin = renderLogin();
        ingresar("admin@duoc.cl", "123456");
        expect(onLogin).toHaveBeenCalledWith(expect.objectContaining({ correo: "admin@duoc.cl", tipoUsuario: "Admin" }));
        expect(screen.getByText("Panel de administración")).toBeInTheDocument();
    });

    it("permite pasar al formulario de recuperar contraseña", () => {
        renderLogin();
        fireEvent.click(screen.getByRole("button", { name: "¿Olvidaste tu contraseña?" }));
        fireEvent.change(screen.getByLabelText("Correo electrónico"), { target: { value: "ana@correo.cl" } });
        fireEvent.click(screen.getByRole("button", { name: "Recuperar contraseña" }));
        expect(screen.getByRole("status")).toHaveTextContent("te enviaremos instrucciones");
    });
});
