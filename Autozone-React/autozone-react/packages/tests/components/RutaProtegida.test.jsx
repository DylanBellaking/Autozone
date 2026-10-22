import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import RutaProtegida from "../../../src/components/RutaProtegida";
import { adminPrueba, clientePrueba } from "../support/datosPrueba";

function renderRuta(usuario) {
    return render(
        <MemoryRouter initialEntries={["/admin"]}>
            <Routes>
                <Route path="/admin" element={<RutaProtegida usuario={usuario} rol="Admin"><p>Contenido privado</p></RutaProtegida>} />
                <Route path="/login" element={<p>Página de login</p>} />
            </Routes>
        </MemoryRouter>
    );
}

describe("RutaProtegida", () => {
    it("sin sesión redirige al login", () => {
        renderRuta(null);
        expect(screen.getByText("Página de login")).toBeInTheDocument();
        expect(screen.queryByText("Contenido privado")).not.toBeInTheDocument();
    });

    it("un cliente tampoco puede entrar a una ruta de administrador", () => {
        renderRuta(clientePrueba);
        expect(screen.getByText("Página de login")).toBeInTheDocument();
    });

    it("un administrador ve el contenido protegido", () => {
        renderRuta(adminPrueba);
        expect(screen.getByText("Contenido privado")).toBeInTheDocument();
    });
});
