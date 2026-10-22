import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FormularioProducto from "../../../../src/components/admin/FormularioProducto";
import { productoPrueba } from "../../support/datosPrueba";

function completar(valores) {
    for (const [etiqueta, valor] of Object.entries(valores)) {
        fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
    }
}

const valido = {
    "Código": "A005", "Nombre": "Kia Sportage", "Descripción": "SUV familiar y cómodo", "Precio": "20000000",
    "Stock": "3", "Stock crítico": "1", "Categoría": "SUV", "Ruta de imagen": "/img/auto1.jpg",
};

describe("FormularioProducto", () => {
    it("no guarda si el stock crítico es mayor que el stock", () => {
        const onGuardar = vi.fn();
        render(<FormularioProducto productoInicial={null} onGuardar={onGuardar} onCancelar={() => {}} />);
        completar({ ...valido, "Stock crítico": "9" });
        fireEvent.click(screen.getByRole("button", { name: "Guardar producto" }));
        expect(screen.getByText("El stock crítico no puede ser mayor que el stock.")).toBeInTheDocument();
        expect(onGuardar).not.toHaveBeenCalled();
    });

    it("con datos válidos entrega el producto con precio y stock como números", () => {
        const onGuardar = vi.fn();
        render(<FormularioProducto productoInicial={null} onGuardar={onGuardar} onCancelar={() => {}} />);
        completar(valido);
        fireEvent.click(screen.getByRole("button", { name: "Guardar producto" }));
        expect(onGuardar).toHaveBeenCalledWith(expect.objectContaining({ nombre: "Kia Sportage", precio: 20000000, stock: 3, stockCritico: 1 }));
    });

    it("en modo edición parte con los datos del producto", () => {
        render(<FormularioProducto productoInicial={productoPrueba} onGuardar={() => {}} onCancelar={() => {}} />);
        expect(screen.getByRole("heading", { name: "Editar producto" })).toBeInTheDocument();
        expect(screen.getByLabelText("Nombre")).toHaveValue("BMW Serie 3");
    });

    it("Cancelar avisa al componente padre", () => {
        const onCancelar = vi.fn();
        render(<FormularioProducto productoInicial={null} onGuardar={() => {}} onCancelar={onCancelar} />);
        fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
        expect(onCancelar).toHaveBeenCalledTimes(1);
    });
});
