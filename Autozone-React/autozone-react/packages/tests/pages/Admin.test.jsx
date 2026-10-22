import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Admin from "../../../src/pages/Admin";
import { adminPrueba } from "../support/datosPrueba";
import { guardarMensaje, obtenerMensajes, obtenerProductos, obtenerUsuarios } from "../../../src/services/almacenamiento";

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

const renderAdmin = () => render(<MemoryRouter><Admin usuario={adminPrueba} onCerrarSesion={() => {}} /></MemoryRouter>);

describe("Página Admin", () => {
    it("muestra los contadores del resumen", () => {
        renderAdmin();
        expect(screen.getByTestId("cantidad-productos")).toHaveTextContent("4");
        expect(screen.getByTestId("cantidad-usuarios")).toHaveTextContent("1");
        expect(screen.getByTestId("cantidad-solicitudes")).toHaveTextContent("0");
    });

    it("cambia de vista con el menú lateral y lista los productos", () => {
        renderAdmin();
        fireEvent.click(screen.getByRole("button", { name: "Productos" }));
        expect(screen.getByRole("heading", { name: "Productos" })).toBeInTheDocument();
        expect(screen.getAllByRole("row")).toHaveLength(5); // encabezado + 4 productos
    });

    it("no elimina si el usuario cancela la confirmación (MOCK de window.confirm)", () => {
        vi.spyOn(window, "confirm").mockReturnValue(false);
        renderAdmin();
        fireEvent.click(screen.getByRole("button", { name: "Productos" }));
        fireEvent.click(screen.getByRole("button", { name: "Eliminar Audi A4" }));
        expect(window.confirm).toHaveBeenCalledWith("¿Deseas eliminar Audi A4?");
        expect(obtenerProductos()).toHaveLength(4);
    });

    it("elimina el producto cuando el usuario acepta", () => {
        vi.spyOn(window, "confirm").mockReturnValue(true);
        renderAdmin();
        fireEvent.click(screen.getByRole("button", { name: "Productos" }));
        fireEvent.click(screen.getByRole("button", { name: "Eliminar Audi A4" }));
        expect(screen.getByRole("status")).toHaveTextContent("Producto eliminado correctamente.");
        expect(screen.queryByText("Audi A4")).not.toBeInTheDocument();
        expect(obtenerProductos()).toHaveLength(3);
    });

    it("crea un producto nuevo desde el formulario y lo muestra en la tabla", () => {
        renderAdmin();
        fireEvent.click(screen.getByRole("button", { name: "Productos" }));
        fireEvent.click(screen.getByRole("button", { name: "+ Nuevo producto" }));
        const datos = { "Código": "A005", "Nombre": "Kia Sportage", "Descripción": "SUV familiar y cómodo", "Precio": "20000000", "Stock": "3", "Stock crítico": "1", "Categoría": "SUV", "Ruta de imagen": "/img/auto2.jpg" };
        for (const [etiqueta, valor] of Object.entries(datos)) fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
        fireEvent.click(screen.getByRole("button", { name: "Guardar producto" }));
        expect(screen.getByText("Kia Sportage")).toBeInTheDocument();
        expect(obtenerProductos()).toHaveLength(5);
    });

    it("edita un producto existente (precio)", () => {
        renderAdmin();
        fireEvent.click(screen.getByRole("button", { name: "Productos" }));
        fireEvent.click(screen.getByRole("button", { name: "Editar BMW Serie 3" }));
        fireEvent.change(screen.getByLabelText("Precio"), { target: { value: "25000000" } });
        fireEvent.click(screen.getByRole("button", { name: "Guardar producto" }));
        expect(screen.getByText("$25.000.000")).toBeInTheDocument();
        expect(obtenerProductos().find((p) => p.id === "bmw").precio).toBe(25000000);
    });

    it("crea un usuario validando el RUN y luego lo puede editar", () => {
        renderAdmin();
        fireEvent.click(screen.getByRole("button", { name: "Usuarios" }));
        fireEvent.click(screen.getByRole("button", { name: "+ Nuevo usuario" }));
        const datos = { "RUN": "12.345.678-9", "Nombre": "Pedro", "Apellidos": "Soto Díaz", "Correo electrónico": "pedro@correo.cl", "Tipo de usuario": "Vendedor", "Región": "Biobío" };
        for (const [etiqueta, valor] of Object.entries(datos)) fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
        fireEvent.click(screen.getByRole("button", { name: "Guardar usuario" }));
        expect(screen.getByText("El dígito verificador del RUN no es correcto.")).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText("RUN"), { target: { value: "11.111.111-1" } });
        fireEvent.click(screen.getByRole("button", { name: "Guardar usuario" }));
        expect(screen.getByText("pedro@correo.cl")).toBeInTheDocument();
        expect(obtenerUsuarios()).toHaveLength(2);

        fireEvent.click(screen.getByRole("button", { name: "Editar pedro@correo.cl" }));
        fireEvent.change(screen.getByLabelText("Tipo de usuario"), { target: { value: "Cliente" } });
        fireEvent.click(screen.getByRole("button", { name: "Guardar usuario" }));
        expect(obtenerUsuarios().find((u) => u.correo === "pedro@correo.cl").tipoUsuario).toBe("Cliente");
    });

    it("no permite que el administrador conectado se elimine a sí mismo", () => {
        renderAdmin();
        fireEvent.click(screen.getByRole("button", { name: "Usuarios" }));
        expect(screen.getByRole("button", { name: "Eliminar admin@duoc.cl" })).toBeDisabled();
    });

    it("elimina un usuario cuando se confirma", () => {
        vi.spyOn(window, "confirm").mockReturnValue(true);
        localStorage.setItem("usuariosAUTOZONE", JSON.stringify([
            { ...obtenerUsuarios()[0] },
            { id: "u9", run: "11111111-1", nombre: "Luis", apellidos: "Mora", correo: "luis@correo.cl", tipoUsuario: "Cliente" },
        ]));
        renderAdmin();
        fireEvent.click(screen.getByRole("button", { name: "Usuarios" }));
        fireEvent.click(screen.getByRole("button", { name: "Eliminar luis@correo.cl" }));
        expect(screen.queryByText("luis@correo.cl")).not.toBeInTheDocument();
        expect(obtenerUsuarios()).toHaveLength(1);
    });

    it("muestra las solicitudes de contacto y permite marcarlas como atendidas", () => {
        guardarMensaje("solicitud", { nombre: "Juan", correo: "juan@correo.cl", telefono: "912345678", vehiculo: "2026 BMW Serie 3", financiamiento: true, mensaje: "Me interesa" });
        renderAdmin();
        expect(screen.getByTestId("cantidad-solicitudes")).toHaveTextContent("1");
        fireEvent.click(screen.getByRole("button", { name: "Solicitudes (1)" }));
        expect(screen.getByText("2026 BMW Serie 3")).toBeInTheDocument();
        expect(screen.getByText("Sí")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "Cambiar estado de Juan: Pendiente" }));
        expect(screen.getByRole("button", { name: "Cambiar estado de Juan: Atendida" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Solicitudes (0)" })).toBeInTheDocument();
        expect(obtenerMensajes()[0].estado).toBe("Atendida");
    });

    it("indica cuando todavía no hay solicitudes", () => {
        renderAdmin();
        fireEvent.click(screen.getByRole("button", { name: "Solicitudes (0)" }));
        expect(screen.getByText("Todavía no hay solicitudes de contacto.")).toBeInTheDocument();
    });
});
