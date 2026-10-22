# AUTOZONE – versión React

Migración de la tienda AUTOZONE (HTML, CSS y JavaScript) a **React + Vite**, con **Bootstrap 5**
para el diseño responsivo, **React Router** para la navegación y **pruebas unitarias** con
Vitest + Testing Library (la misma configuración del ejemplo `primer-test` visto en clase).

Cambios solicitados: **se eliminó el carrito de compras y la compra en línea**. El catálogo
muestra **autos nuevos (0 km)** y cada uno tiene dos botones, como en los portales de autos:

- **✉ Contactar vendedor** → ventana *"Contacta al vendedor(a)"*: mensaje ya escrito, nombre, correo,
  teléfono, *Recordar mi información* y *¿Necesitas financiamiento?*. La solicitud queda guardada y
  el administrador la ve en el panel (sección **Solicitudes**), donde la marca como *Atendida*.
- **Ver detalles** → ficha completa del auto, desde donde también se puede contactar al vendedor.
- **Otras formas de contacto:** botón **Chatear por WhatsApp** (abre el chat con un mensaje sobre
  ese auto) y **Llamar**. El número se configura en `src/data/empresa.js`.

## Cómo ejecutarlo

Requisito: Node.js 20 o superior.

```bash
npm install          # instala dependencias (React, Bootstrap, React Router, Vitest...)
npm run dev          # inicia la aplicación en http://localhost:4173
npm test             # ejecuta las pruebas en modo observador
npm run test:run     # ejecuta todas las pruebas una sola vez
npm run coverage     # pruebas + reporte de cobertura (carpeta packages/tests/coverage/index.html)
npm run build        # genera la versión de producción en dist/
```

Usuario administrador por defecto: **admin@duoc.cl / 123456**

### Abrir desde otro dispositivo mediante el enlace público

1. Ejecuta `npm run dev` y mantén el servidor en funcionamiento. Vite utiliza el puerto **4173** y avisa si ya está ocupado, en vez de cambiar a otro puerto.
2. En la vista **Puertos** de VS Code, reenvía el puerto **4173** y selecciona visibilidad **Pública**. El servicio local utiliza HTTP; el enlace público de Dev Tunnels utiliza HTTPS.
3. Comparte la dirección pública que aparece en esa vista. `localhost` solo identifica al dispositivo desde el que se abre.

`vite.config.js` permite el dominio `7j3hx6vm-4173.brs.devtunnels.ms`. Si VS Code genera una dirección diferente y Vite muestra **Blocked request**, sustituye ese dominio en `server.allowedHosts` por el nuevo nombre, sin `https://` ni la barra final.

Si aparece un error **502**, comprueba primero que `http://localhost:4173/` funcione en el computador que ejecuta el proyecto y que el túnel reenvíe ese mismo puerto. Si funciona localmente, detén y vuelve a crear el reenvío desde VS Code. El computador y VS Code deben permanecer activos para mantener el acceso público.

## Estructura del proyecto

```
src/
├── main.jsx                 Punto de entrada: BrowserRouter + Bootstrap + estilos
├── App.jsx                  Rutas de la aplicación y estado de la sesión (usuario)
├── components/              Componentes reutilizables
│   ├── Navbar.jsx           Menú responsivo (estado: menuAbierto)
│   ├── Footer.jsx           Pie de página con grilla Bootstrap
│   ├── CampoFormulario.jsx  Label + campo + mensaje de validación (se usa en todos los formularios)
│   ├── TarjetaVehiculo.jsx  Tarjeta de un auto nuevo (props: producto, onVerDetalle, onContactar, esFavorito, onFavorito)
│   ├── DetalleVehiculo.jsx  Ficha del auto (props: producto, onCerrar, onContactar)
│   ├── ContactoVendedor.jsx "Contacta al vendedor(a)" + WhatsApp y llamada
│   ├── RutaProtegida.jsx    Protege /admin: solo entra el rol Admin
│   └── admin/               FormularioProducto, TablaProductos, FormularioUsuario, TablaUsuarios, TablaSolicitudes
├── pages/                   Una página por ruta: Inicio, Vehiculos, Nosotros, Blogs,
│                            Contacto, Login, Registro, Admin, NoEncontrada (404)
├── hooks/useFormulario.js   Hook propio: valores, errores y validación de formularios
├── utils/validaciones.js    Reglas de validación (funciones puras, fáciles de probar)
├── utils/formato.js         Precio en CLP y estado del stock
├── utils/contacto.js        Título del auto, mensaje inicial y enlaces de WhatsApp / llamada
├── services/almacenamiento.js  Único acceso a localStorage (productos, usuarios, sesión, solicitudes, favoritos)
├── data/                    Catálogo inicial (autos nuevos), blog, regiones y datos de la empresa
└── styles/                  CSS original de AUTOZONE + app.css (navbar, footer y ajustes)
```

## Rutas

| Ruta | Página |
|---|---|
| `/` | Inicio (portada + vehículos destacados) |
| `/vehiculos` | Catálogo con filtro por categoría. `?auto=bmw` abre la ficha y `?auto=bmw&contacto=1` el contacto |
| `/nosotros`, `/blogs`, `/contacto` | Páginas informativas y formulario de contacto |
| `/login`, `/registro` | Inicio de sesión (y recuperar contraseña) y creación de cuenta |
| `/admin` | Panel de administración (protegido: solo Admin) |
| cualquier otra | Página 404 |

## Props y estado (ejemplos para explicar)

| Componente | Props que recibe | Estado propio (useState) |
|---|---|---|
| App | — | `usuario` (sesión iniciada) |
| Navbar | `usuario`, `onCerrarSesion` | `menuAbierto` |
| Vehiculos | — | `productos`, `categoria`, `favoritos`, `seleccionadoId`, `ventana` |
| TarjetaVehiculo | `producto`, `onVerDetalle`, `onContactar`, `esFavorito`, `onFavorito` | — (solo muestra) |
| ContactoVendedor | `producto`, `onCerrar` | `enviada` + `useFormulario` (valores, errores) |
| Admin | `usuario`, `onCerrarSesion` | `vista`, `productos`, `usuarios`, `mensajes`, `productoEditando`, `usuarioEditando`, `aviso` |
| CampoFormulario | `etiqueta`, `valor`, `onChange`, `error`, `validado`, `tipo`… | — (componente controlado) |

## Diseño responsivo con Bootstrap

- `navbar navbar-expand-lg`: en pantallas chicas los enlaces se esconden y aparece el botón ☰.
- Grilla `row` / `col-12 col-sm-6 col-lg-4 col-xl-3`: el catálogo pasa de 1 a 4 columnas según el ancho.
- `table-responsive` en las tablas del panel, `d-flex flex-column flex-lg-row` en la zona de sesión.
- Se mantienen además las media queries propias de AUTOZONE (`styles/responsive.css`).

## Pruebas unitarias

Los 23 archivos de pruebas (`*.test.js` / `*.test.jsx`) están separados del código de la aplicación en el workspace npm `@autozone/tests`:

```text
packages/tests/
├── package.json             Dependencias y comandos de pruebas
├── vitest.config.js         Configuración de Vitest y cobertura
├── support/                 setup.js y datosPrueba.js
├── App.test.jsx
├── components/              Incluye pruebas de administración
├── pages/
├── hooks/
├── services/
└── utils/
```

Ejecuta `npm install` desde la raíz para instalar ambos packages. Los comandos de pruebas de la raíz delegan en este workspace. También puedes ejecutar `npm run test:run` desde `packages/tests`, o `npm run test:run --workspace=@autozone/tests` desde la raíz. La cobertura sigue midiendo el código de `src/`.

Los siguientes archivos se encuentran dentro de `packages/tests`:

| Archivo | Pruebas | Qué verifica |
|---|---|---|
| utils/validaciones.test.js | 19 | Correo, teléfono, RUN (módulo 11), contraseñas, producto, usuario |
| utils/formato.test.js | 2 | Precio en CLP y estado del stock |
| utils/contacto.test.js | 4 | Título del auto, mensaje inicial, enlace de WhatsApp y de llamada |
| services/almacenamiento.test.js | 10 | localStorage: carga inicial, datos dañados, usuarios, sesión, solicitudes, recordar datos, favoritos |
| components/CampoFormulario.test.jsx | 5 | Label asociado, error en rojo, ✓ en verde, onChange, select/textarea |
| components/TarjetaVehiculo.test.jsx | 4 | Props, botones Contactar / Ver detalles, favorito, etiqueta según stock |
| components/DetalleVehiculo.test.jsx | 3 | Ficha, sin botón de compra, contactar y WhatsApp |
| components/ContactoVendedor.test.jsx | 5 | Mensaje inicial, validación, financiamiento, recordar datos, otras formas de contacto |
| components/Navbar.test.jsx | 5 | Enlaces, página activa, menú ☰, sesión de admin y cliente |
| components/RutaProtegida.test.jsx | 3 | Redirección sin sesión, cliente y admin |
| components/admin/FormularioProducto.test.jsx | 4 | Stock crítico, guardar, editar, cancelar |
| pages/*.test.jsx | 30 | Registro, Login, Contacto, Vehículos (contacto y favoritos), Admin (CRUD y solicitudes), Blogs |
| App.test.jsx | 4 | Navegación, ruta protegida, cerrar sesión, 404 |

**Mocks usados:** `vi.fn()` para las funciones que llegan por props (onVerDetalle, onContactar,
onLogin…), `vi.spyOn(Storage.prototype, "setItem")` para comprobar qué se guarda en localStorage
y `vi.spyOn(window, "confirm")` para simular que el usuario acepta o cancela al eliminar.

> Nota: la pauta menciona Jasmine y Karma. Este proyecto usa **Vitest**, que es la herramienta
> que se usó en clase (`primer-test`). Vitest usa la misma sintaxis que Jasmine
> (`describe`, `it`, `expect`, `beforeEach`), y **jsdom** cumple el rol del navegador que en Karma
> abre Chrome.
