import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import clienteAxios from "../../config/axios";

// import context
import { CRMContext } from "../../context/CRMContext";

const EditarCliente = () => {
    const redirect = useNavigate();
    //obtener el ID
    const { id } = useParams();

    // utilizar valores del context
    // eslint-disable-next-line no-unused-vars
    const [auth, guardarAuth] = useContext(CRMContext);

    // const redirect = useNavigate();
    // cliente
    const [cliente, datosClientes] = useState({
        nombre: "",
        apellido: "",
        empresa: "",
        email: "",
        telefono: "",
    });

    // Query a la API
    const consultarAPI = async () => {
        const clienteConsulta = await clienteAxios.get(`/clientes/${id}`, {
            headers: {
                Authorization: `Bearer ${auth.token}`,
            },
        });
        datosClientes(clienteConsulta.data);
    };

    // useEffect, cuando el componente carga
    useEffect(() => {
        consultarAPI();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // leer datos del form
    const actualizarState = (e) => {
        //Almacenar los que escribe el usuario en el state
        datosClientes({
            //obtener una copia del state actual
            ...cliente,
            [e.target.name]: e.target.value,
        });
    };

    // envia una peticion por axios para actualizar el cliente
    const actualizarCliente = (e) => {
        e.preventDefault();
        // enviar peticion
        clienteAxios
            .put(`/clientes/${id}`, cliente, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            })
            .then((res) => {
                //validar si hay errores en mongo
                if (res.data.code === 11000) {
                    Swal.fire({
                        title: "Hubo un error",
                        text: "Ese cliente ya esta registrado",
                        icon: "error",
                    });
                } else {
                    Swal.fire({
                        title: "Correcto",
                        text: "Se actualizó correctamente",
                        icon: "success",
                    });
                }

                // Redireccionar
                redirect("/");
            });
    };

    // validar formulario - disabled: si valido da true desabilita el boton
    const validarCliente = () => {
        // Destructuring
        const { nombre, apellido, email, empresa, telefono } = cliente;
        // revizar que las propiedades del state tengan contenido
        let valido =
            !nombre.length ||
            !apellido.length ||
            !email.length ||
            !empresa.length ||
            !telefono.length;
        //return true o false
        return valido;
    };

    // Si el state esta como false
    if (!auth.auth) {
        return <Navigate to={"/iniciar-sesion"} />;
    }

    return (
        <>
            <h2>Editar Cliente</h2>

            <form onSubmit={actualizarCliente}>
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        placeholder="Nombre Cliente"
                        name="nombre"
                        onChange={actualizarState}
                        value={cliente.nombre}
                    />
                </div>

                <div className="campo">
                    <label>Apellido:</label>
                    <input
                        type="text"
                        placeholder="Apellido Cliente"
                        name="apellido"
                        onChange={actualizarState}
                        value={cliente.apellido}
                    />
                </div>

                <div className="campo">
                    <label>Empresa:</label>
                    <input
                        type="text"
                        placeholder="Empresa Cliente"
                        name="empresa"
                        onChange={actualizarState}
                        value={cliente.empresa}
                    />
                </div>

                <div className="campo">
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Email Cliente"
                        name="email"
                        onChange={actualizarState}
                        value={cliente.email}
                    />
                </div>

                <div className="campo">
                    <label>Teléfono:</label>
                    <input
                        type="tel"
                        placeholder="Teléfono Cliente"
                        name="telefono"
                        onChange={actualizarState}
                        value={cliente.telefono}
                    />
                </div>

                <div className="enviar">
                    <input
                        type="submit"
                        className="btn btn-azul"
                        value="Guardar Cambios"
                        //validarCliente lleva parentesis para que se ejecute inmediatamente sin esperar algun evento
                        disabled={validarCliente()}
                    />
                </div>
            </form>
        </>
    );
};

export default EditarCliente;
