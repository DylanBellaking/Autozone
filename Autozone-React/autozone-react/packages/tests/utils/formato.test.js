import { describe, expect, it } from "vitest";
import { estadoStock, formatearPrecio } from "../../../src/utils/formato";

describe("formato", () => {
    it("formatea precios en pesos chilenos con separador de miles", () => {
        expect(formatearPrecio(28990000)).toBe("$28.990.000");
        expect(formatearPrecio(undefined)).toBe("$0");
    });

    it("calcula el estado del stock según el stock crítico", () => {
        expect(estadoStock({ stock: 5, stockCritico: 2 }).texto).toBe("Disponible");
        expect(estadoStock({ stock: 2, stockCritico: 2 }).texto).toBe("Últimas unidades");
        expect(estadoStock({ stock: 0, stockCritico: 2 }).texto).toBe("Agotado");
    });
});
