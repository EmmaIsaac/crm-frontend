import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";

// Importar Axios
import clienteAxios from "../../config/axios";

import Cliente from "./cliente";
import Spinner from "../layout/Spinner";

// import context
import { CRMContext } from "../../context/CRMContext";

const Clientes = () => {
    const redirect = useNavigate();
    // Trabajar con el state
    const [clientes, guardarClientes] = useState([]);

    // utilizar valores del context
    // eslint-disable-next-line no-unused-vars
    const [auth, guardarAuth] = useContext(CRMContext);

    useEffect(() => {
        if (auth.token !== "") {
            // Query a la API
            const consultarAPI = async () => {
                try {
                    const clientesConsulta = await clienteAxios.get(
                        "/clientes",
                        {
                            headers: {
                                Authorization: `Bearer ${auth.token}`,
                            },
                        }
                    );

                    // colocar el resultado en el state
                    guardarClientes(clientesConsulta.data);
                } catch (error) {
                    // Error con authorizacion
                    if (error.response.status == 500) {
                        redirect("/iniciar-sesion");
                    }
                }
            };
            consultarAPI();
        } else {
            redirect("/iniciar-sesion");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientes]);
    //El [] es para que haga la consulta una sola vez
    // Al paserle [clientes] le estoy pidiendo que vuelva a realizar la consulta ante cambios

    // Verifcar si el usuario esta autenticado o no
    if (!auth.auth) {
        // Navigate funciona con el return
        return <Navigate to={"/iniciar-sesion"} />;
    } else if (!clientes.length) {
        return <Spinner />;
    }

    return (
        <>
            <h2>Clientes</h2>

            <Link to={"/clientes/nuevo"} className="btn btn-verde nvo-cliente">
                <i className="fas fa-plus-circle"></i>
                Nuevo Cliente
            </Link>

            <ul className="listado-clientes">
                {clientes.map((cliente) => (
                    <Cliente key={cliente._id} cliente={cliente} />
                ))}
            </ul>
        </>
    );
};

export default Clientes;
