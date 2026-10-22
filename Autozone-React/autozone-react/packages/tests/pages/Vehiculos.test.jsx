import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import Vehiculos from "../../../src/pages/Vehiculos";
import { obtenerFavoritos, obtenerMensajes } from "../../../src/services/almacenamiento";

beforeEach(() => localStorage.clear());

const renderVehiculos = (ruta = "/vehiculos") => render(<MemoryRouter initialEntries={[ruta]}><Vehiculos /></MemoryRouter>);

describe("Página Vehículos (autos nuevos)", () => {
    it("muestra una tarjeta por auto y NO tiene carrito ni compra en línea", () => {
        renderVehiculos();
        expect(screen.getAllByRole("button", { name: "Ver detalles" })).toHaveLength(4);
        expect(screen.getAllByRole("button", { name: "✉ Contactar vendedor" })).toHaveLength(4);
        expect(screen.queryByText(/carrito/i)).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /Comprar/ })).not.toBeInTheDocument();
    });

    it("filtra por categoría (estado 'categoria')", () => {
        renderVehiculos();
        fireEvent.click(screen.getByRole("button", { name: "Híbrido" }));
        expect(screen.getAllByRole("button", { name: "Ver detalles" })).toHaveLength(1);
        expect(screen.getByRole("heading", { name: "2026 Toyota Corolla" })).toBeInTheDocument();
    });

    it("abre la ficha o el contacto según la URL", () => {
        const { unmount } = renderVehiculos("/vehiculos?auto=audi");
        expect(screen.getByRole("dialog", { name: "Detalle Audi A4" })).toBeInTheDocument();
        unmount();
        renderVehiculos("/vehiculos?auto=audi&contacto=1");
        expect(screen.getByRole("dialog", { name: "Contacta al vendedor(a)" })).toHaveTextContent("2026 Audi A4");
    });

    it("desde la tarjeta: Contactar vendedor → enviar solicitud", () => {
        renderVehiculos();
        fireEvent.click(screen.getAllByRole("button", { name: "✉ Contactar vendedor" })[0]);
        const ventana = screen.getByRole("dialog", { name: "Contacta al vendedor(a)" });
        fireEvent.change(within(ventana).getByLabelText("Nombre completo"), { target: { value: "Juan Pérez" } });
        fireEvent.change(within(ventana).getByLabelText("Correo electrónico"), { target: { value: "juan@correo.cl" } });
        fireEvent.change(within(ventana).getByLabelText("Teléfono de contacto"), { target: { value: "912345678" } });
        fireEvent.click(within(ventana).getByRole("button", { name: "Contacta al vendedor" }));
        expect(screen.getByRole("status")).toHaveTextContent("Un vendedor te contactará pronto");
        expect(obtenerMensajes()[0]).toMatchObject({ productoId: "bmw", nombre: "Juan Pérez" });
    });

    it("desde la ficha también se puede contactar al vendedor y cerrar", () => {
        renderVehiculos();
        fireEvent.click(screen.getAllByRole("button", { name: "Ver detalles" })[1]);
        fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "✉ Contactar vendedor" }));
        expect(screen.getByRole("dialog", { name: "Contacta al vendedor(a)" })).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "Cerrar" }));
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("marca favoritos y los guarda en localStorage", () => {
        renderVehiculos();
        fireEvent.click(screen.getByRole("button", { name: "Agregar a favoritos Audi A4" }));
        expect(obtenerFavoritos()).toEqual(["audi"]);
        fireEvent.click(screen.getByRole("button", { name: "Quitar de favoritos Audi A4" }));
        expect(obtenerFavoritos()).toEqual([]);
    });
});
