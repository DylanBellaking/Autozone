import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DetalleVehiculo from "../../../src/components/DetalleVehiculo";
import { productoPrueba } from "../support/datosPrueba";

describe("DetalleVehiculo", () => {
    it("muestra la ficha completa del auto nuevo", () => {
        render(<DetalleVehiculo producto={productoPrueba} onCerrar={() => {}} onContactar={() => {}} />);
        expect(screen.getByRole("dialog", { name: "Detalle BMW Serie 3" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "2026 BMW Serie 3" })).toBeInTheDocument();
        expect(screen.getByText("320i 2.0 AUT")).toBeInTheDocument();
        expect(screen.getByText("Unidades disponibles: 5")).toBeInTheDocument();
    });

    it("no tiene botón de compra: ofrece contactar al vendedor o chatear", () => {
        const onContactar = vi.fn(); const onCerrar = vi.fn();
        render(<DetalleVehiculo producto={productoPrueba} onCerrar={onCerrar} onContactar={onContactar} />);
        expect(screen.queryByRole("button", { name: /Comprar/ })).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "✉ Contactar vendedor" }));
        fireEvent.click(screen.getByRole("button", { name: "Cerrar" }));
        expect(onContactar).toHaveBeenCalledTimes(1);
        expect(onCerrar).toHaveBeenCalledTimes(1);
        const chat = screen.getByRole("link", { name: /Chatear por WhatsApp/ });
        expect(chat).toHaveAttribute("href", expect.stringContaining("https://wa.me/"));
        expect(chat).toHaveAttribute("target", "_blank");
    });

    it("sin stock invita a consultar por la próxima llegada", () => {
        render(<DetalleVehiculo producto={{ ...productoPrueba, stock: 0 }} onCerrar={() => {}} onContactar={() => {}} />);
        expect(screen.getByText(/Sin stock por ahora/)).toBeInTheDocument();
    });
});
