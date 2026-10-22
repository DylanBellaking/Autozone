import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RutaProtegida from "./components/RutaProtegida";
import Inicio from "./pages/Inicio";
import Vehiculos from "./pages/Vehiculos";
import Nosotros from "./pages/Nosotros";
import Blogs from "./pages/Blogs";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Admin from "./pages/Admin";
import NoEncontrada from "./pages/NoEncontrada";
import { cerrarSesion, guardarSesion, obtenerSesion } from "./services/almacenamiento";

// =====================================================
// COMPONENTE PRINCIPAL: App
// =====================================================
// - Guarda en su ESTADO el usuario con sesión iniciada.
// - Lo entrega como PROP al Navbar, a Login (onLogin) y al panel Admin.
// - Define las RUTAS (React Router): cada URL muestra una página distinta
//   sin recargar el navegador (Single Page Application).
function App() {
    const navigate = useNavigate();
    // El valor inicial se lee una sola vez desde localStorage.
    const [usuario, setUsuario] = useState(() => obtenerSesion());

    function iniciarSesion(datosUsuario) {
        setUsuario(guardarSesion(datosUsuario));
    }

    function salir() {
        cerrarSesion();
        setUsuario(null);
        navigate("/");
    }

    return (
        <>
            <Navbar usuario={usuario} onCerrarSesion={salir} />
            <main className="contenido-app">
                <Routes>
                    <Route path="/" element={<Inicio />} />
                    <Route path="/vehiculos" element={<Vehiculos />} />
                    <Route path="/nosotros" element={<Nosotros />} />
                    <Route path="/blogs" element={<Blogs />} />
                    <Route path="/contacto" element={<Contacto />} />
                    <Route path="/login" element={<Login onLogin={iniciarSesion} />} />
                    <Route path="/registro" element={<Registro />} />
                    <Route
                        path="/admin"
                        element={
                            <RutaProtegida usuario={usuario} rol="Admin">
                                <Admin usuario={usuario} onCerrarSesion={salir} />
                            </RutaProtegida>
                        }
                    />
                    <Route path="*" element={<NoEncontrada />} />
                </Routes>
            </main>
            <Footer />
        </>
    );
}

export default App;
