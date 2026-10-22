import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import App from "../../src/App";
import { CLAVES, guardarSesion, ADMIN_INICIAL } from "../../src/services/almacenamiento";

beforeEach(() => localStorage.clear());

const renderApp = (ruta = "/") => render(<MemoryRouter initialEntries={[ruta]}><App /></MemoryRouter>);

describe("App (navegación con React Router)", () => {
    it("navega a otra página sin recargar al hacer clic en el menú", () => {
        renderApp("/");
        expect(screen.getByRole("heading", { name: /Conduce tus/ })).toBeInTheDocument();
        // Se busca dentro del menú principal (el footer también tiene un enlace "Nosotros").
        fireEvent.click(within(screen.getByRole("navigation", { name: "Menú principal" })).getByRole("link", { name: "Nosotros" }));
        expect(screen.getByRole("heading", { name: /Más que vender autos/ })).toBeInTheDocument();
    });

    it("protege /admin: sin sesión muestra el login", () => {
        renderApp("/admin");
        expect(screen.getByRole("heading", { name: "Iniciar sesión" })).toBeInTheDocument();
    });

    it("con sesión de administrador muestra el panel y permite cerrar sesión", () => {
        guardarSesion(ADMIN_INICIAL);
        renderApp("/admin");
        expect(screen.getByRole("heading", { name: "Panel de administración" })).toBeInTheDocument();
        fireEvent.click(screen.getAllByRole("button", { name: "Cerrar sesión" })[0]);
        expect(localStorage.getItem(CLAVES.sesion)).toBeNull();
        expect(screen.getByRole("link", { name: /Iniciar sesión/ })).toBeInTheDocument();
    });

    it("muestra la página 404 en una ruta que no existe", () => {
        renderApp("/no-existe");
        expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
    });
});
