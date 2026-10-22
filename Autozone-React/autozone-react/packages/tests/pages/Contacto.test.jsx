import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import Contacto from "../../../src/pages/Contacto";
import { CLAVES, leer } from "../../../src/services/almacenamiento";

beforeEach(() => localStorage.clear());

describe("Página Contacto", () => {
    it("muestra los datos de la empresa", () => {
        render(<Contacto />);
        expect(screen.getByText("contacto@autozone.cl")).toBeInTheDocument();
    });

    it("no envía el mensaje si el asunto o el mensaje son muy cortos", () => {
        render(<Contacto />);
        fireEvent.change(screen.getByLabelText("Asunto"), { target: { value: "Ho" } });
        fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));
        expect(screen.getByText("El asunto debe tener al menos 3 caracteres.")).toBeInTheDocument();
        expect(screen.getByText("El mensaje debe tener al menos 10 caracteres.")).toBeInTheDocument();
        expect(leer(CLAVES.mensajes, [])).toHaveLength(0);
    });

    it("con datos válidos guarda el mensaje, limpia el formulario y avisa", () => {
        render(<Contacto />);
        fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Ana" } });
        fireEvent.change(screen.getByLabelText("Correo"), { target: { value: "ana@correo.cl" } });
        fireEvent.change(screen.getByLabelText("Asunto"), { target: { value: "Consulta" } });
        fireEvent.change(screen.getByLabelText("Mensaje"), { target: { value: "Quiero agendar una visita." } });
        fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));
        expect(screen.getByRole("status")).toHaveTextContent("¡Mensaje enviado correctamente!");
        expect(screen.getByLabelText("Nombre")).toHaveValue("");
        expect(leer(CLAVES.mensajes, [])[0]).toMatchObject({ tipo: "contacto", asunto: "Consulta" });
    });
});
