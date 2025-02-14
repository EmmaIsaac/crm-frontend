import { useContext } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";

// import context
import { CRMContext } from "../../context/CRMContext";

// eslint-disable-next-line react/prop-types
const Cliente = ({ cliente }) => {
    // extraer los valores - el _id se le pasa como key
    // eslint-disable-next-line react/prop-types
    const { _id, nombre, apellido, empresa, email, telefono } = cliente;

    // utilizar valores del context
    // eslint-disable-next-line no-unused-vars
    const [auth, guardarAuth] = useContext(CRMContext);

    // Eliminar cliente
    const eliminarCliente = (idCliente) => {
        Swal.fire({
            title: "¿Estas Seguro?",
            text: "Un cliente eliminado no se puede recuperar",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminar!",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                // Llamado a axios
                clienteAxios
                    .delete(`/clientes/${idCliente}`, {
                        headers: {
                            Authorization: `Bearer ${auth.token}`,
                        },
                    })
                    .then((res) => {
                        Swal.fire({
                            title: "Eliminado!",
                            text: res.data.message,
                            icon: "success",
                        });
                    });
            }
        });
    };

    return (
        <li className="cliente">
            <div className="info-cliente">
                <p className="nombre">
                    {nombre} {apellido}
                </p>
                <p className="empresa">{empresa}</p>
                <p>{email}</p>
                <p>Tel: {telefono}</p>
            </div>
            <div className="acciones">
                <Link to={`clientes/editar/${_id}`} className="btn btn-azul">
                    <i className="fas fa-pen-alt"></i>
                    Editar Cliente
                </Link>
                <Link to={`pedidos/nuevo/${_id}`} className="btn btn-amarillo">
                    <i className="fas fa-plus"></i>
                    Nuevo Pedido
                </Link>
                <button
                    type="button"
                    className="btn btn-rojo btn-eliminar"
                    //El arrroy func es necesario para que la funcion no se ejecute al cargar
                    onClick={() => eliminarCliente(_id)}
                >
                    <i className="fas fa-times"></i>
                    Eliminar Cliente
                </button>
            </div>
        </li>
    );
};

export default Cliente;
