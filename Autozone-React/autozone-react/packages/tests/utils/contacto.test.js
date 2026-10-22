import { describe, expect, it } from "vitest";
import { crearEnlaceLlamada, crearEnlaceWhatsApp, mensajeInicial, tituloVehiculo } from "../../../src/utils/contacto";
import { productoPrueba } from "../support/datosPrueba";

describe("contacto", () => {
    it("arma el título con el año del auto nuevo", () => {
        expect(tituloVehiculo(productoPrueba)).toBe("2026 BMW Serie 3");
    });

    it("el mensaje inicial menciona el auto, su versión y su precio", () => {
        expect(mensajeInicial(productoPrueba)).toBe("Hola, me interesa el 2026 BMW Serie 3 320i 2.0 AUT nuevo ($28.990.000). ¿Me pueden contactar?");
    });

    it("crea el enlace de WhatsApp con el mensaje codificado para URL", () => {
        const enlace = crearEnlaceWhatsApp(productoPrueba, "56900000000");
        expect(enlace.startsWith("https://wa.me/56900000000?text=")).toBe(true);
        expect(decodeURIComponent(enlace.split("text=")[1])).toBe(mensajeInicial(productoPrueba));
        expect(enlace).not.toContain(" ");
    });

    it("crea el enlace para llamar por teléfono", () => {
        expect(crearEnlaceLlamada("56900000000")).toBe("tel:+56900000000");
    });
});
