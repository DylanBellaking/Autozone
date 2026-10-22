import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TablaProductos from "../../../../src/components/admin/TablaProductos";
import TablaSolicitudes from "../../../../src/components/admin/TablaSolicitudes";
import TablaUsuarios from "../../../../src/components/admin/TablaUsuarios";
import { adminPrueba, clientePrueba, productoPrueba } from "../../support/datosPrueba";

describe("TablaProductos", () => {
    it("avisa cuando no hay productos", () => {
        render(<TablaProductos productos={[]} onEditar={() => {}} onEliminar={() => {}} />);
        expect(screen.getByText("No hay productos registrados.")).toBeInTheDocument();
    });

    it("muestra cada producto con su precio y marca el stock crítico", () => {
        const critico = { ...productoPrueba, id: "audi", codigo: "A002", nombre: "Audi A4", stock: 2 };
        render(<TablaProductos productos={[productoPrueba, critico]} onEditar={() => {}} onEliminar={() => {}} />);
        expect(screen.getAllByText("$28.990.000")).toHaveLength(2);
        const filaAudi = screen.getByRole("row", { name: /Audi A4/ });
        expect(within(filaAudi).getByText(/stock crítico/)).toBeInTheDocument();
        expect(screen.getByRole("row", { name: /BMW Serie 3/ })).not.toHaveTextContent("stock crítico");
    });

    it("los botones Editar y Eliminar avisan al padre con el producto (MOCKS)", () => {
        const onEditar = vi.fn();
        const onEliminar = vi.fn();
        render(<TablaProductos productos={[productoPrueba]} onEditar={onEditar} onEliminar={onEliminar} />);
        fireEvent.click(screen.getByRole("button", { name: "Editar BMW Serie 3" }));
        fireEvent.click(screen.getByRole("button", { name: "Eliminar BMW Serie 3" }));
        expect(onEditar).toHaveBeenCalledWith(productoPrueba);
        expect(onEliminar).toHaveBeenCalledWith(productoPrueba);
    });
});

describe("TablaUsuarios", () => {
    it("muestra el rol en mayúsculas, '—' si no hay RUN y no deja eliminar al usuario conectado", () => {
        const onEliminar = vi.fn();
        render(<TablaUsuarios usuarios={[adminPrueba, clientePrueba]} usuarioActualId={adminPrueba.id}
            onEditar={() => {}} onEliminar={onEliminar} />);
        expect(screen.getByText("ADMIN")).toHaveClass("rol-admin");
        expect(screen.getByText("CLIENTE")).not.toHaveClass("rol-admin");
        expect(screen.getAllByText("—")).toHaveLength(2);
        expect(screen.getByRole("button", { name: "Eliminar admin@duoc.cl" })).toBeDisabled();
        fireEvent.click(screen.getByRole("button", { name: "Eliminar ana@correo.cl" }));
        expect(onEliminar).toHaveBeenCalledWith(clientePrueba);
    });
});

describe("TablaSolicitudes", () => {
    const solicitud = {
        id: "m1", tipo: "solicitud", fecha: "2026-01-10T10:00:00.000Z", nombre: "Ana", correo: "ana@correo.cl",
        telefono: "+56911112222", vehiculo: "BMW Serie 3", financiamiento: true, mensaje: "Me interesa", estado: "Pendiente",
    };
    const contacto = {
        id: "m2", tipo: "contacto", fecha: "2026-02-10T10:00:00.000Z", nombre: "Pedro", correo: "pedro@correo.cl",
        asunto: "Horarios", mensaje: "¿Abren el sábado?", estado: "Atendida",
    };

    it("avisa cuando no hay solicitudes", () => {
        render(<TablaSolicitudes mensajes={[]} onCambiarEstado={() => {}} />);
        expect(screen.getByText("Todavía no hay solicitudes de contacto.")).toBeInTheDocument();
    });

    it("ordena de la más reciente a la más antigua y muestra los datos según el tipo", () => {
        render(<TablaSolicitudes mensajes={[solicitud, contacto]} onCambiarEstado={() => {}} />);
        const filas = screen.getAllByRole("row").slice(1); // la primera fila es el encabezado
        expect(filas[0]).toHaveTextContent("Pedro");
        expect(filas[0]).toHaveTextContent("Contacto: Horarios");
        expect(filas[0]).toHaveTextContent("—");
        expect(filas[1]).toHaveTextContent("BMW Serie 3");
        expect(filas[1]).toHaveTextContent("Sí");
        expect(filas[1]).toHaveTextContent("+56911112222");
    });

    it("el botón de estado avisa al padre y se ve distinto si ya fue atendida", () => {
        const onCambiarEstado = vi.fn();
        render(<TablaSolicitudes mensajes={[solicitud, contacto]} onCambiarEstado={onCambiarEstado} />);
        expect(screen.getByRole("button", { name: "Cambiar estado de Pedro: Atendida" })).toHaveClass("atendida");
        fireEvent.click(screen.getByRole("button", { name: "Cambiar estado de Ana: Pendiente" }));
        expect(onCambiarEstado).toHaveBeenCalledWith(solicitud);
    });
});
