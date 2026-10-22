import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Footer from "../../../src/components/Footer";
import NoEncontrada from "../../../src/pages/NoEncontrada";

describe("Footer", () => {
    it("tiene los enlaces de navegación y el año actual", () => {
        render(<MemoryRouter><Footer /></MemoryRouter>);
        expect(screen.getByRole("link", { name: "Vehículos" })).toHaveAttribute("href", "/vehiculos");
        expect(screen.getByRole("link", { name: "Contacto" })).toHaveAttribute("href", "/contacto");
        expect(screen.getByText("contacto@autozone.cl")).toBeInTheDocument();
        expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} AUTOZONE`))).toBeInTheDocument();
    });
});

describe("NoEncontrada (404)", () => {
    it("avisa que la página no existe y ofrece volver al inicio", () => {
        render(<MemoryRouter><NoEncontrada /></MemoryRouter>);
        expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Volver al inicio" })).toHaveAttribute("href", "/");
    });
});
