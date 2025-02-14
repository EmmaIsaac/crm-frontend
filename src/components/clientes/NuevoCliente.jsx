import { useState, useContext } from "react";
import Swal from "sweetalert2";
import { useNavigate, Navigate } from "react-router-dom";
import clienteAxios from "../../config/axios";

// import context
import { CRMContext } from "../../context/CRMContext";

const NuevoCliente = () => {
    const redirect = useNavigate();

    // utilizar valores del context
    // eslint-disable-next-line no-unused-vars
    const [auth, guardarAuth] = useContext(CRMContext);

    // cliente
    const [cliente, guardarClientes] = useState({
        nombre: "",
        apellido: "",
        empresa: "",
        email: "",
        telefono: "",
    });
    // leer datos del form
    const actualizarState = (e) => {
        //Almacenar los que escribe el usuario en el state
        guardarClientes({
            //obtener una copia del state actual
            ...cliente,
            [e.target.name]: e.target.value,
        });
    };

    // añade en la REST API un cliente nuevo
    const agregarCliente = (e) => {
        e.preventDefault();

        //enviar peticion a axios
        clienteAxios
            .post("/clientes", cliente, {
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
                        title: "Se agrego el Cliente",
                        text: res.data.message,
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
            <h2>Nuevo Cliente</h2>

            <form onSubmit={agregarCliente}>
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        placeholder="Nombre Cliente"
                        name="nombre"
                        onChange={actualizarState}
                    />
                </div>

                <div className="campo">
                    <label>Apellido:</label>
                    <input
                        type="text"
                        placeholder="Apellido Cliente"
                        name="apellido"
                        onChange={actualizarState}
                    />
                </div>

                <div className="campo">
                    <label>Empresa:</label>
                    <input
                        type="text"
                        placeholder="Empresa Cliente"
                        name="empresa"
                        onChange={actualizarState}
                    />
                </div>

                <div className="campo">
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Email Cliente"
                        name="email"
                        onChange={actualizarState}
                    />
                </div>

                <div className="campo">
                    <label>Teléfono:</label>
                    <input
                        type="tel"
                        placeholder="Teléfono Cliente"
                        name="telefono"
                        onChange={actualizarState}
                    />
                </div>

                <div className="enviar">
                    <input
                        type="submit"
                        className="btn btn-azul"
                        value="Agregar Cliente"
                        //validarCliente lleva parentesis para que se ejecute inmediatamente sin esperar algun evento
                        disabled={validarCliente()}
                    />
                </div>
            </form>
        </>
    );
};

export default NuevoCliente;
