import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// 1) Bootstrap (grilla responsiva, navbar, tablas, alertas)
import 'bootstrap/dist/css/bootstrap.min.css'
// 2) Estilos propios de AUTOZONE (migrados del proyecto HTML)
import './styles/estilos.css'
import './styles/inicio.css'
import './styles/vehiculos.css'
import './styles/consulta.css'
import './styles/contacto.css'
import './styles/nosotros.css'
import './styles/blogs.css'
import './styles/login.css'
import './styles/registro.css'
import './styles/admin.css'
import './styles/responsive.css'
// 3) Estilos nuevos de la versión React (navbar, footer, ajustes)
import './styles/app.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter habilita la navegación entre páginas con React Router */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
