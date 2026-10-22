import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DetalleVehiculo from "../../../src/components/DetalleVehiculo";
import { CLAVES, obtenerProductos } from "../../../src/services/almacenamiento";

describe("Galerías de vehículos", () => {
    it.each(["mercedes", "toyota"])("actualiza las fotos antiguas de %s y conserva fotos personalizadas", (id) => {
        const personalizada = { src: "/img/foto-propia.jpg", alt: "Foto propia" };
        localStorage.setItem(CLAVES.productos, JSON.stringify([{
            id, precio: 12345, imagenesInterior: [
                { src: `/img/${id}/interior-beige.png`, alt: "Foto antigua" }, personalizada,
            ],
        }]));
        const producto = obtenerProductos()[0];
        expect(producto.imagenesInterior[0].src).toContain("interior-beige-v2.");
        expect(producto.imagenesInterior[1]).toEqual(personalizada);
        expect(producto.precio).toBe(12345);
    });
    it("recorre los interiores en ambos sentidos incluso con un catálogo guardado antes de agregar las fotos", async () => {
        localStorage.setItem(CLAVES.productos, JSON.stringify([
            { id: "bmw", nombre: "BMW Serie 3", imagen: "/img/auto1.jpg", imagenesInterior: [{ src: "/img/bmw/Interior_blanco.jpg", alt: "Interior anterior" }] },
        ]));
        const producto = obtenerProductos()[0];
        render(<DetalleVehiculo producto={producto} onCerrar={() => {}} onContactar={() => {}} />);

        const exterior = screen.getByAltText("BMW Serie 3").closest(".carousel-item");
        const blanco = screen.getByAltText("BMW Serie 3: interior beige Canberra").closest(".carousel-item");
        const negro = screen.getByAltText("BMW Serie 3: interior negro").closest(".carousel-item");
        const rojo = screen.getByAltText("BMW Serie 3: interior rojo Tacora").closest(".carousel-item");
        expect(exterior).toHaveClass("active");
        for (const diapositiva of [blanco, negro, rojo, exterior]) {
            fireEvent.click(screen.getByRole("button", { name: "Foto siguiente" }));
            await waitFor(() => expect(diapositiva).toHaveClass("active"));
        }
        fireEvent.click(screen.getByRole("button", { name: "Foto anterior" }));
        await waitFor(() => expect(rojo).toHaveClass("active"));
    });

    it("mantiene una imagen simple para vehículos sin galería", () => {
        const producto = { ...obtenerProductos().find((auto) => auto.id === "audi"), imagenesInterior: [] };
        render(<DetalleVehiculo producto={producto} onCerrar={() => {}} onContactar={() => {}} />);
        expect(screen.getByAltText("Audi A4")).toHaveAttribute("src", "/img/auto2.jpg");
        expect(screen.queryByRole("button", { name: "Foto siguiente" })).not.toBeInTheDocument();
    });

    it.each(["audi", "mercedes", "toyota"])("incorpora la galería de %s al catálogo guardado y permite recorrer sus colores", async (id) => {
        localStorage.setItem(CLAVES.productos, JSON.stringify([{ id, precio: 12345 }]));
        const producto = obtenerProductos()[0];
        expect(producto.precio).toBe(12345);
        render(<DetalleVehiculo producto={producto} onCerrar={() => {}} onContactar={() => {}} />);
        expect(screen.getByText(producto.notaGaleria)).toBeInTheDocument();
        expect(producto.imagenesInterior).toHaveLength(3);
        for (const foto of producto.imagenesInterior) {
            fireEvent.click(screen.getByRole("button", { name: "Foto siguiente" }));
            await waitFor(() => expect(screen.getByAltText(foto.alt).closest(".carousel-item")).toHaveClass("active"));
            expect(screen.getByText(foto.etiqueta)).toBeInTheDocument();
        }
    });
});