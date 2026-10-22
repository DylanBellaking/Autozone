// Agrega a Vitest los matchers de Testing Library: toBeInTheDocument, toHaveClass, etc.
import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach } from "vitest"

// Como no usamos "globals: true" en Vitest, Testing Library no limpia sola la pantalla
// entre pruebas. Sin esto, los componentes de una prueba quedan dibujados en la siguiente.
afterEach(() => {
  cleanup()
  localStorage.clear()
})
