import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ContactoVendedor from "../../../src/components/ContactoVendedor";
import { productoPrueba } from "../support/datosPrueba";
import { obtenerContactoRecordado, obtenerMensajes } from "../../../src/services/almacenamiento";

beforeEach(() => localStorage.clear());

function completar() {
    fireEvent.change(screen.getByLabelText("Nombre completo"), { target: { value: "Ana María" } });
    fireEvent.change(screen.getByLabelText("Correo electrónico"), { target: { value: "ana@correo.cl" } });
    fireEvent.change(screen.getByLabelText("Teléfono de contacto"), { target: { value: "+56 9 1234 5678" } });
}

describe("ContactoVendedor", () => {
    it("parte con un mensaje ya escrito sobre el auto", () => {
        render(<ContactoVendedor producto={productoPrueba} onCerrar={() => {}} />);
        expect(screen.getByLabelText("Mensaje")).toHaveValue("Hola, me interesa el 2026 BMW Serie 3 320i 2.0 AUT nuevo ($28.990.000). ¿Me pueden contactar?");
    });

    it("no envía si faltan los datos y valida en tiempo real", () => {
        render(<ContactoVendedor producto={productoPrueba} onCerrar={() => {}} />);
        fireEvent.click(screen.getByRole("button", { name: "Contacta al vendedor" }));
        expect(screen.getAllByRole("alert")).toHaveLength(3);
        fireEvent.change(screen.getByLabelText("Nombre completo"), { target: { value: "Ana María" } });
        expect(screen.getAllByRole("alert")).toHaveLength(2);
        expect(obtenerMensajes()).toHaveLength(0);
    });

    it("guarda la solicitud (con financiamiento) y muestra la confirmación", () => {
        render(<ContactoVendedor producto={productoPrueba} onCerrar={() => {}} />);
        completar();
        fireEvent.click(screen.getByLabelText("¿Necesitas financiamiento?"));
        fireEvent.click(screen.getByRole("button", { name: "Contacta al vendedor" }));
        expect(screen.getByRole("status")).toHaveTextContent("Un vendedor te contactará pronto con opciones de financiamiento");
        expect(obtenerMensajes()[0]).toMatchObject({ tipo: "solicitud", vehiculo: "2026 BMW Serie 3", financiamiento: true, estado: "Pendiente" });
    });

    it("'Recordar mi información' deja los datos listos para la próxima vez", () => {
        const { unmount } = render(<ContactoVendedor producto={productoPrueba} onCerrar={() => {}} />);
        completar();
        fireEvent.click(screen.getByLabelText("Recordar mi información"));
        fireEvent.click(screen.getByRole("button", { name: "Contacta al vendedor" }));
        expect(obtenerContactoRecordado()).toEqual({ nombre: "Ana María", correo: "ana@correo.cl", telefono: "+56 9 1234 5678" });
        unmount();
        render(<ContactoVendedor producto={productoPrueba} onCerrar={() => {}} />);
        expect(screen.getByLabelText("Nombre completo")).toHaveValue("Ana María");
        expect(screen.getByLabelText("Recordar mi información")).toBeChecked();
    });

    it("ofrece otras formas de contacto: WhatsApp y llamada", () => {
        const onCerrar = vi.fn();
        render(<ContactoVendedor producto={productoPrueba} onCerrar={onCerrar} />);
        expect(screen.getByRole("link", { name: /Chatear por WhatsApp/ })).toHaveAttribute("href", expect.stringMatching(/^https:\/\/wa\.me\/\d+\?text=/));
        expect(screen.getByRole("link", { name: /Llamar/ })).toHaveAttribute("href", expect.stringMatching(/^tel:\+/));
        fireEvent.click(screen.getByRole("button", { name: "Cerrar" }));
        expect(onCerrar).toHaveBeenCalledTimes(1);
    });
});
