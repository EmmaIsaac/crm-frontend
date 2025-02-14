import { useContext } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";

// import context
import { CRMContext } from "../../context/CRMContext";

// eslint-disable-next-line react/prop-types
const Producto = ({ producto }) => {
    // eslint-disable-next-line react/prop-types
    const { _id, nombre, precio, imagen } = producto;

    // utilizar valores del context
    // eslint-disable-next-line no-unused-vars
    const [auth, guardarAuth] = useContext(CRMContext);
    const eliminarProducto = (idProducto) => {
        Swal.fire({
            title: "¿Estas Seguro?",
            text: "Un producto eliminado no se puede recuperar",
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
                    .delete(`/productos/${idProducto}`, {
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
        <li className="producto">
            <div className="info-producto">
                <p className="nombre">{nombre}</p>
                <p className="precio">${precio}</p>
                {imagen ? (
                    <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/${imagen}`}
                    />
                ) : null}
            </div>
            <div className="acciones">
                <Link to={`/productos/editar/${_id}`} className="btn btn-azul">
                    <i className="fas fa-pen-alt"></i>
                    Editar Producto
                </Link>

                <button
                    type="button"
                    className="btn btn-rojo btn-eliminar"
                    onClick={() => eliminarProducto(_id)}
                >
                    <i className="fas fa-times"></i>
                    Eliminar Cliente
                </button>
            </div>
        </li>
    );
};

export default Producto;
