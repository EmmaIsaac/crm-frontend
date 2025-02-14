import { useState, useEffect, useContext } from "react";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Spinner from "../layout/Spinner";
import clienteAxios from "../../config/axios";

// import context
import { CRMContext } from "../../context/CRMContext";

const EditarProducto = () => {
    //obtener el ID
    const { id } = useParams();
    const redirect = useNavigate();

    // utilizar valores del context
    // eslint-disable-next-line no-unused-vars
    const [auth, guardarAuth] = useContext(CRMContext);

    const [producto, guardarProducto] = useState({
        nombre: "",
        precio: "",
        imagen: "",
    });
    // archivo state - imagen: en caso de que quieran cambiar la imagen
    const [archivo, guardarArchivo] = useState("");

    // consultar la api para traer el produco a editar
    const consultarAPI = async (id) => {
        const productoConsulta = await clienteAxios.get(`/productos/${id}`, {
            headers: {
                Authorization: `Bearer ${auth.token}`,
            },
        });
        guardarProducto(productoConsulta.data);
    };
    // cuando carga el componente
    useEffect(() => {
        consultarAPI(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // almacena el nuevo producto en la DB
    const editarProducto = async (e) => {
        e.preventDefault();
        //crear un form-data
        const formData = new FormData();
        formData.append("nombre", producto.nombre);
        formData.append("precio", producto.precio);
        formData.append("imagen", archivo);

        //almacenar en la BD
        try {
            const res = await clienteAxios.put(`/productos/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            if (res.status === 200) {
                Swal.fire({
                    title: "Editado Correctamente",
                    text: res.data.message,
                    icon: "success",
                });
            }
            //redireccionar
            redirect("/productos");
        } catch (error) {
            console.log(error);
            //lanzar alerta
            Swal.fire({
                title: "Hubo un error",
                text: "Vuelva a intentarlo mas tarde",
                icon: "error",
            });
        }
    };

    // ller datos del formulario
    const leerInformacionProducto = (e) => {
        guardarProducto({
            //obtener una copia del state y agregar el nuevo
            ...producto,
            [e.target.name]: e.target.value,
        });
    };

    // coloca la imagen en el state
    const leerArchivo = (e) => {
        guardarArchivo(e.target.files[0]);
    };

    const { nombre, precio, imagen } = producto;

    //spinner : lo comente porque no redirigia a iniciar sesion
    // if (!nombre) return <Spinner />;

    // Si el state esta como false
    if (!auth.auth) {
        return <Navigate to={"/iniciar-sesion"} />;
    } else if (!nombre) {
        return <Spinner />;
    }

    return (
        <>
            <h2>Editar Producto</h2>

            <form onSubmit={editarProducto}>
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        placeholder="Nombre Producto"
                        name="nombre"
                        onChange={leerInformacionProducto}
                        defaultValue={nombre}
                    />
                </div>

                <div className="campo">
                    <label>Precio:</label>
                    <input
                        type="number"
                        name="precio"
                        min="0.00"
                        step="0.01"
                        placeholder="Precio"
                        onChange={leerInformacionProducto}
                        defaultValue={precio}
                    />
                </div>

                <div className="campo">
                    <label>Imagen:</label>
                    {imagen ? (
                        <img
                            src={`${
                                import.meta.env.VITE_BACKEND_URL
                            }/${imagen}`}
                            alt="imagen"
                            width="300"
                        />
                    ) : null}
                    <input type="file" name="imagen" onChange={leerArchivo} />
                </div>

                <div className="enviar">
                    <input
                        type="submit"
                        className="btn btn-azul"
                        value="Editar Producto"
                    />
                </div>
            </form>
        </>
    );
};

export default EditarProducto;
