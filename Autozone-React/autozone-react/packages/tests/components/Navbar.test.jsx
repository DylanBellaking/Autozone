import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Navbar from "../../../src/components/Navbar";
import { adminPrueba, clientePrueba } from "../support/datosPrueba";

// Navbar usa enlaces de React Router, por eso se envuelve en un MemoryRouter
// (un router "en memoria" pensado para pruebas).
function renderNavbar(props, ruta = "/") {
    return render(<MemoryRouter initialEntries={[ruta]}><Navbar onCerrarSesion={() => {}} {...props} /></MemoryRouter>);
}

describe("Navbar", () => {
    it("muestra los enlaces de navegación y marca la página actual", () => {
        renderNavbar({ usuario: null }, "/vehiculos");
        expect(screen.getByRole("link", { name: "Inicio" })).toHaveAttribute("href", "/");
        expect(screen.getByRole("link", { name: "Vehículos" })).toHaveClass("activo");
        expect(screen.getByRole("link", { name: "Inicio" })).not.toHaveClass("activo");
    });

    it("el botón ☰ abre y cierra el menú en celular (estado menuAbierto)", () => {
        renderNavbar({ usuario: null });
        const boton = screen.getByRole("button", { name: "Abrir menú" });
        expect(boton).toHaveAttribute("aria-expanded", "false");
        fireEvent.click(boton);
        expect(boton).toHaveAttribute("aria-expanded", "true");
        expect(document.getElementById("menu-autozone")).toHaveClass("show");
        fireEvent.click(boton);
        expect(document.getElementById("menu-autozone")).not.toHaveClass("show");
    });

    it("sin sesión muestra 'Iniciar sesión'", () => {
        renderNavbar({ usuario: null });
        expect(screen.getByRole("link", { name: /Iniciar sesión/ })).toHaveAttribute("href", "/login");
        expect(screen.queryByRole("button", { name: "Cerrar sesión" })).not.toBeInTheDocument();
    });

    it("con un administrador muestra su nombre, el panel y cierra sesión (MOCK)", () => {
        const onCerrarSesion = vi.fn();
        renderNavbar({ usuario: adminPrueba, onCerrarSesion });
        expect(screen.getByText("Hola, Administrador")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Panel admin" })).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));
        expect(onCerrarSesion).toHaveBeenCalledTimes(1);
    });

    it("un cliente NO ve el enlace al panel de administración", () => {
        renderNavbar({ usuario: clientePrueba });
        expect(screen.queryByRole("link", { name: "Panel admin" })).not.toBeInTheDocument();
    });
});
