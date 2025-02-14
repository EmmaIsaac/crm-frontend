//context
import { useContext } from "react";
// Routing
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/**Layout */
import Header from "./components/layout/Header";
import Navegacion from "./components/layout/navegacion";

/**Componentes */
import Clientes from "./components/clientes/Clientes";
import NuevoCliente from "./components/clientes/NuevoCliente";
import EditarCliente from "./components/clientes/EditarCliente";

import Productos from "./components/productos/Productos";
import EditarProducto from "./components/productos/EditarProducto";
import NuevoProducto from "./components/productos/NuevoProducto";

import Pedidos from "./components/pedidos/Pedidos";
import NuevoPedido from "./components/pedidos/NuevoPedido";

import Login from "./components/auth/Login";

import { CRMContext, CRMProvider } from "./context/CRMContext";

function App() {
    // utilizar context en el comonente
    const [auth, guardarAuth] = useContext(CRMContext);

    return (
        <Router>
            <CRMProvider value={[auth, guardarAuth]}>
                {/* Header  */}
                <Header />

                <div className="grid contenedor contenido-principal">
                    {/* navegacion lateral  */}
                    <Navegacion />
                    <main className="caja-contenido col-9">
                        <Routes>
                            {/* Clientes  */}
                            <Route path="/" element={<Clientes />} />
                            <Route
                                path="/clientes/nuevo"
                                element={<NuevoCliente />}
                            />
                            <Route
                                path="/clientes/editar/:id"
                                element={<EditarCliente />}
                            />

                            {/* Productos  */}
                            <Route path="/productos" element={<Productos />} />
                            <Route
                                path="/productos/nuevo"
                                element={<NuevoProducto />}
                            />
                            <Route
                                path="/productos/editar/:id"
                                element={<EditarProducto />}
                            />

                            {/* Pedidos  */}
                            <Route path="/pedidos" element={<Pedidos />} />
                            <Route
                                path="/pedidos/nuevo/:id"
                                element={<NuevoPedido />}
                            />

                            {/* Login  */}
                            <Route path="/iniciar-sesion" element={<Login />} />
                        </Routes>
                    </main>
                </div>
            </CRMProvider>
        </Router>
    );
}

export default App;
