import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import clienteAxios from "../../config/axios";

import Producto from "./Producto";
import Spinner from "../layout/Spinner";

// import context
import { CRMContext } from "../../context/CRMContext";

const Productos = () => {
    const redirect = useNavigate();
    const [productos, guardarProductos] = useState([]);

    // utilizar valores del context
    // eslint-disable-next-line no-unused-vars
    const [auth, guardarAuth] = useContext(CRMContext);

    // useEffect para consultar api cuando cargue
    useEffect(() => {
        if (auth.token !== "") {
            //Query a la APi
            const consultarAPI = async () => {
                try {
                    const productosConsulta = await clienteAxios.get(
                        "/productos",
                        {
                            headers: {
                                Authorization: `Bearer ${auth.token}`,
                            },
                        }
                    );
                    guardarProductos(productosConsulta.data);
                } catch (error) {
                    // Error con authorizacion
                    if (error.response.status == 500) {
                        redirect("/iniciar-sesion");
                    }
                }
            };
            //llamado a la api
            consultarAPI();
        } else {
            //redireccionar
            redirect("/iniciar-sesion");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productos]);

    // Si el state esta como false
    if (!auth.auth) {
        redirect("/iniciar-sesion");
    }

    // spinner de carga
    if (!productos.length) {
        return <Spinner />;
    }
    return (
        <>
            <h2>Productos</h2>
            <Link to={"/productos/nuevo"} className="btn btn-verde nvo-cliente">
                <i className="fas fa-plus-circle"></i>
                Nuevo Producto
            </Link>
            <ul className="listado-productos">
                {productos.map((producto) => (
                    <Producto key={producto._id} producto={producto} />
                ))}
            </ul>
        </>
    );
};

export default Productos;
