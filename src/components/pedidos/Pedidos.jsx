import { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import clienteAxios from "../../config/axios";

import DetallesPedido from "./DetallesPedido";

// import context
import { CRMContext } from "../../context/CRMContext";

const Pedidos = () => {
    const [pedidos, guardarPedidos] = useState([]);

    // utilizar valores del context
    // eslint-disable-next-line no-unused-vars
    const [auth, guardarAuth] = useContext(CRMContext);

    useEffect(() => {
        //obtener pedidos
        if (auth.token !== "") {
            const consultarAPI = async () => {
                try {
                    const resultado = await clienteAxios.get("/pedidos", {
                        headers: {
                            Authorization: `Bearer ${auth.token}`,
                        },
                    });
                    guardarPedidos(resultado.data);
                } catch (error) {
                    // Error con authorizacion
                    if (error.response.status == 500) {
                        <Navigate to={"/iniciar-sesion"} />;
                    }
                }
            };
            consultarAPI();
        } else {
            <Navigate to={"/iniciar-sesion"} />;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pedidos]);

    // Si el state esta como false
    if (!auth.auth) {
        return <Navigate to={"/iniciar-sesion"} />;
    }

    return (
        <>
            <h2>Pedidos</h2>

            <ul className="listado-pedidos">
                {pedidos.map((pedido) => (
                    <DetallesPedido key={pedido._id} pedido={pedido} />
                ))}
            </ul>
        </>
    );
};

export default Pedidos;
