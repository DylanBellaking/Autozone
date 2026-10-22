import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Blogs from "../../../src/pages/Blogs";

describe("Página Blogs", () => {
    it("muestra una tarjeta por artículo", () => {
        render(<Blogs />);
        expect(screen.getAllByRole("article")).toHaveLength(2);
    });

    it("abre el artículo completo y lo cierra (estado articuloAbierto)", () => {
        render(<Blogs />);
        fireEvent.click(screen.getAllByRole("button", { name: "Leer artículo" })[1]);
        const ventana = screen.getByRole("dialog", { name: "La evolución de la tecnología en los automóviles" });
        expect(ventana).toHaveTextContent("sistemas de asistencia a la conducción");
        fireEvent.click(screen.getByRole("button", { name: "Volver a blogs" }));
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
});
