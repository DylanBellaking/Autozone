import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Inicio from "../../../src/pages/Inicio";

// Página falsa de /vehiculos que muestra la URL a la que se llegó (para revisar la navegación).
function UbicacionActual() {
    const { pathname, search } = useLocation();
    return <p>Ruta: {pathname + search}</p>;
}

const renderInicio = () =>
    render(
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/vehiculos" element={<UbicacionActual />} />
            </Routes>
        </MemoryRouter>
    );

describe("Inicio", () => {
    it("muestra la portada y solo 3 vehículos destacados", () => {
        renderInicio();
        expect(screen.getByRole("heading", { name: /Conduce tus/ })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Ver vehículos" })).toHaveAttribute("href", "/vehiculos");
        expect(screen.getAllByRole("button", { name: "Ver detalles" })).toHaveLength(3);
    });

    it("'Ver detalles' lleva a /vehiculos?auto=id", () => {
        renderInicio();
        fireEvent.click(screen.getAllByRole("button", { name: "Ver detalles" })[0]);
        expect(screen.getByText("Ruta: /vehiculos?auto=bmw")).toBeInTheDocument();
    });

    it("'Contactar vendedor' lleva a /vehiculos?auto=id&contacto=1", () => {
        renderInicio();
        fireEvent.click(screen.getAllByRole("button", { name: "✉ Contactar vendedor" })[0]);
        expect(screen.getByText("Ruta: /vehiculos?auto=bmw&contacto=1")).toBeInTheDocument();
    });
});
