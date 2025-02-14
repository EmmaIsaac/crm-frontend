const FormCantidadProducto = (props) => {
    const {
        // eslint-disable-next-line react/prop-types
        producto,
        restarProductos,
        aumentarProductos,
        eliminarProductoPedido,
        index,
    } = props;
    // eslint-disable-next-line react/prop-types
    const { _id, nombre, precio, cantidad } = producto;
    return (
        <li>
            <div className="texto-producto">
                <p className="nombre">{nombre}</p>
                <p className="precio">${precio}</p>
            </div>
            <div className="acciones">
                <div className="contenedor-cantidad">
                    <i
                        className="fas fa-minus"
                        onClick={() => restarProductos(index)}
                    ></i>

                    <p>{cantidad}</p>

                    <i
                        className="fas fa-plus"
                        onClick={() => aumentarProductos(index)}
                    ></i>
                </div>
                <button
                    type="button"
                    className="btn btn-rojo"
                    onClick={() => eliminarProductoPedido(_id)}
                >
                    <i className="fas fa-minus-circle"></i>
                    Eliminar Producto
                </button>
            </div>
        </li>
    );
};

export default FormCantidadProducto;
