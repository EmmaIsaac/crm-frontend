import { useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";

// import context
import { CRMContext } from "../../context/CRMContext";

const NuevoProducto = () => {
    const redirect = useNavigate();

    // utilizar valores del context
    // eslint-disable-next-line no-unused-vars
    const [auth, guardarAuth] = useContext(CRMContext);

    const [producto, guardarProducto] = useState({
        nombre: "",
        precio: "",
    });
    // archivo state - imagen
    const [archivo, guardarArchivo] = useState("");

    // almacena el nuevo producto en la DB
    const agregarProducto = async (e) => {
        e.preventDefault();
        //crear un form-data
        const formData = new FormData();
        formData.append("nombre", producto.nombre);
        formData.append("precio", producto.precio);
        formData.append("imagen", archivo);

        //almacenar en la BD
        try {
            const res = await clienteAxios.post("/productos", formData, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            if (res.status === 200) {
                Swal.fire({
                    title: "Agregado Correctamente",
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

    // validar formulario - disabled: si valido da true desabilita el boton
    const validarProducto = () => {
        // revizar que las propiedades del state tengan contenido
        let valido =
            !producto.nombre.length || !producto.precio.length || !archivo;
        //return true o false
        return valido;
    };

    // Verifcar si el usuario esta autenticado o no
    if (!auth.auth) {
        // Navigate funciona con el return
        return <Navigate to={"/iniciar-sesion"} />;
    }

    return (
        <>
            <h2>Nuevo Producto</h2>

            <form onSubmit={agregarProducto}>
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        placeholder="Nombre Producto"
                        name="nombre"
                        onChange={leerInformacionProducto}
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
                    />
                </div>

                <div className="campo">
                    <label>Imagen:</label>
                    <input type="file" name="imagen" onChange={leerArchivo} />
                </div>

                <div className="enviar">
                    <input
                        type="submit"
                        className="btn btn-azul"
                        value="Agregar Producto"
                        disabled={validarProducto()}
                    />
                </div>
            </form>
        </>
    );
};

export default NuevoProducto;
