import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CampoFormulario from "../../../src/components/CampoFormulario";

describe("CampoFormulario", () => {
    it("conecta la etiqueta con el campo (label htmlFor)", () => {
        render(<CampoFormulario id="nombre" nombre="nombre" etiqueta="Nombre" valor="" onChange={() => {}} />);
        // getByLabelText solo encuentra el input si el label está bien asociado.
        expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
    });

    it("muestra el error en rojo cuando recibe la prop error", () => {
        render(<CampoFormulario id="correo" nombre="correo" etiqueta="Correo" valor="x" onChange={() => {}} error="Correo inválido" validado />);
        expect(screen.getByRole("alert")).toHaveTextContent("Correo inválido");
        expect(screen.getByLabelText("Correo")).toHaveClass("campo-error");
        expect(screen.getByLabelText("Correo")).toHaveAttribute("aria-invalid", "true");
    });

    it("muestra ✓ Correcto cuando ya se validó y no hay error", () => {
        render(<CampoFormulario id="correo" nombre="correo" etiqueta="Correo" valor="a@b.cl" onChange={() => {}} validado />);
        expect(screen.getByText("✓ Correcto")).toBeInTheDocument();
        expect(screen.getByLabelText("Correo")).toHaveClass("campo-correcto");
    });

    it("llama a onChange cuando el usuario escribe (MOCK con vi.fn)", () => {
        const alCambiar = vi.fn();
        render(<CampoFormulario id="nombre" nombre="nombre" etiqueta="Nombre" valor="" onChange={alCambiar} />);
        fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Ana" } });
        expect(alCambiar).toHaveBeenCalledTimes(1);
    });

    it("dibuja un select con sus opciones o un textarea según la prop tipo", () => {
        const { rerender } = render(
            <CampoFormulario id="pago" nombre="pago" etiqueta="Pago" tipo="select" valor="" onChange={() => {}}
                opciones={[{ valor: "", texto: "Elige" }, { valor: "contado", texto: "Contado" }]} />
        );
        expect(screen.getAllByRole("option")).toHaveLength(2);
        rerender(<CampoFormulario id="msg" nombre="msg" etiqueta="Mensaje" tipo="textarea" valor="" onChange={() => {}} />);
        expect(screen.getByLabelText("Mensaje").tagName).toBe("TEXTAREA");
    });
});
