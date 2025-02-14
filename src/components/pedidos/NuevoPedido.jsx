import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import FormBuscarPedido from "./FormBuscarPedido";
import FormCantidadProducto from "./FormCantidadProducto";

// import context
import { CRMContext } from "../../context/CRMContext";

const NuevoPedido = () => {
    //extraer ID cliente
    const { id } = useParams();
    //redireccion
    const redirect = useNavigate();

    // utilizar valores del context
    // eslint-disable-next-line no-unused-vars
    const [auth, guardarAuth] = useContext(CRMContext);

    //state
    const [cliente, guardarCliente] = useState({});
    const [busqueda, guardarBusqueda] = useState("");
    const [productos, guardarProductos] = useState([]);
    const [total, guardarTotal] = useState(0);

    useEffect(() => {
        //obtener el cliente
        const consultarAPI = async () => {
            const consultaCliente = await clienteAxios.get(`/clientes/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });

            guardarCliente(consultaCliente.data);
        };
        consultarAPI();

        //actualizar el total a pagar
        actualizarTotal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productos]);

    const buscarProducto = async (e) => {
        e.preventDefault();
        //obtener los productos de la busqueda
        const resuldadoBusqueda = await clienteAxios.post(
            `/productos/busqueda/${busqueda}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            }
        );
        // si no hay resultado una alerta, contrario agregarlo al state

        if (resuldadoBusqueda.data[0]) {
            let productoResultado = resuldadoBusqueda.data[0];

            // agregar la llave "producto" (copia del id)
            productoResultado.producto = resuldadoBusqueda.data[0]._id;
            productoResultado.cantidad = 0;
            // poner en el state - ...productos acumula las busquedas anteriores
            guardarProductos([...productos, productoResultado]);
        } else {
            // no hay resultados
            Swal.fire({
                title: "No Resultados",
                text: "No hay resultados",
                icon: "error",
            });
        }
    };
    //almacenar busqueda en el state
    const leerDatosBusqueda = (e) => {
        guardarBusqueda(e.target.value);
    };

    // actualizar la cantidad de productos
    const restarProductos = (index) => {
        //copiar arreglo original de productos
        const todosProductos = [...productos];
        //validar si esta en 0
        if (todosProductos[index].cantidad === 0) return;
        //decremento
        todosProductos[index].cantidad--;
        //almacenarlo en el state
        guardarProductos(todosProductos);
    };
    const aumentarProductos = (index) => {
        //copiar arreglo original de productos
        const todosProductos = [...productos];
        //incremento
        todosProductos[index].cantidad++;
        //almacenarlo en el state
        guardarProductos(todosProductos);
    };

    // elimina un producto del state
    const eliminarProductoPedido = (idProductoPedido) => {
        const todosProductos = productos.filter(
            (producto) => producto.producto !== idProductoPedido
        );
        guardarProductos(todosProductos);
    };

    // actualizar el total a pagar
    const actualizarTotal = () => {
        //si el arreglo de productos esta vacio: total es 0
        if (productos.length === 0) {
            guardarTotal(0);
            return;
        }
        //calcular nuevo total
        let nuevoTotal = 0;

        //recorrer todos los productos, sus cantidades y precios
        productos.map(
            (producto) => (nuevoTotal += producto.cantidad * producto.precio)
        );
        //almacenar el total
        guardarTotal(nuevoTotal);
    };

    // Almacena el pedido en la DB
    const realizarPedidos = async (e) => {
        e.preventDefault();
        //construir el objeto
        const pedido = {
            cliente: id,
            pedido: productos,
            total: total,
        };
        //almacenar en la DB
        const resultado = await clienteAxios.post(
            `/pedidos/nuevo/${id}`,
            pedido,
            {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            }
        );
        //leer resultado
        if (resultado.status === 200) {
            //alerta de todo bien
            Swal.fire({
                title: "Agregado Correctamente",
                text: resultado.data.message,
                icon: "success",
            });
        } else {
            //error
            Swal.fire({
                title: "Hubo un error",
                text: "Vuelva a intentarlo mas tarde",
                icon: "error",
            });
        }

        //redireccionar
        redirect("/");
    };

    // Si el state esta como false
    if (!auth.auth) {
        return <Navigate to={"/iniciar-sesion"} />;
    }

    return (
        <>
            <h2>Nuevo Pedido</h2>

            <div className="ficha-cliente">
                <h3>Datos de Cliente</h3>
                <p>
                    Nombre: {cliente.nombre} {cliente.apellido}
                </p>
                <p>Telefono: {cliente.telefono}</p>
            </div>

            <FormBuscarPedido
                buscarProducto={buscarProducto}
                leerDatosBusqueda={leerDatosBusqueda}
            />

            <ul className="resumen">
                {productos.map((producto, index) => (
                    <FormCantidadProducto
                        key={producto.producto}
                        producto={producto}
                        restarProductos={restarProductos}
                        aumentarProductos={aumentarProductos}
                        eliminarProductoPedido={eliminarProductoPedido}
                        index={index}
                    />
                ))}
            </ul>

            <p className="total">
                Total a pagar: $<span>{total}</span>
            </p>

            {total > 0 ? (
                <form onSubmit={realizarPedidos}>
                    <input
                        type="submit"
                        className="btn btn-verde btn-block"
                        value="Realizar Pedido"
                    />
                </form>
            ) : null}
        </>
    );
};

export default NuevoPedido;
