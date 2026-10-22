import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TarjetaVehiculo from "../../../src/components/TarjetaVehiculo";
import { productoPrueba } from "../support/datosPrueba";

const renderTarjeta = (props = {}) =>
    render(<TarjetaVehiculo producto={productoPrueba} onVerDetalle={() => {}} onContactar={() => {}} {...props} />);

describe("TarjetaVehiculo", () => {
    it("muestra los datos del auto nuevo que recibe por props", () => {
        renderTarjeta();
        expect(screen.getByRole("heading", { name: "2026 BMW Serie 3" })).toBeInTheDocument();
        expect(screen.getByText("320i 2.0 AUT")).toBeInTheDocument();
        expect(screen.getByText("$28.990.000")).toBeInTheDocument();
        expect(screen.getByText("Nuevo")).toBeInTheDocument();
        expect(screen.getByText(/0 km/)).toBeInTheDocument();
        expect(screen.getByAltText("BMW Serie 3")).toHaveAttribute("src", "/img/auto1.jpg");
    });

    it("cada botón llama a su función con el producto (MOCKS)", () => {
        const onVerDetalle = vi.fn();
        const onContactar = vi.fn();
        renderTarjeta({ onVerDetalle, onContactar });
        fireEvent.click(screen.getByRole("button", { name: "✉ Contactar vendedor" }));
        fireEvent.click(screen.getByRole("button", { name: "Ver detalles" }));
        expect(onContactar).toHaveBeenCalledWith(productoPrueba);
        expect(onVerDetalle).toHaveBeenCalledWith(productoPrueba);
    });

    it("el corazón marca el favorito y cambia según la prop esFavorito", () => {
        const onFavorito = vi.fn();
        const { rerender } = renderTarjeta({ onFavorito, esFavorito: false });
        fireEvent.click(screen.getByRole("button", { name: /Agregar a favoritos/ }));
        expect(onFavorito).toHaveBeenCalledWith("bmw");
        rerender(<TarjetaVehiculo producto={productoPrueba} onVerDetalle={() => {}} onContactar={() => {}} onFavorito={onFavorito} esFavorito />);
        expect(screen.getByRole("button", { name: /Quitar de favoritos/ })).toHaveAttribute("aria-pressed", "true");
    });

    it("cambia la etiqueta según el stock", () => {
        const { rerender } = renderTarjeta();
        expect(screen.getByText("Disponible")).toBeInTheDocument();
        rerender(<TarjetaVehiculo producto={{ ...productoPrueba, stock: 1 }} onVerDetalle={() => {}} onContactar={() => {}} />);
        expect(screen.getByText("Últimas unidades")).toBeInTheDocument();
        rerender(<TarjetaVehiculo producto={{ ...productoPrueba, stock: 0 }} onVerDetalle={() => {}} onContactar={() => {}} />);
        expect(screen.getByText("Agotado")).toBeInTheDocument();
    });
});
