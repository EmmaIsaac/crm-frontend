const FormBuscarPedido = (props) => {
    return (
        // eslint-disable-next-line react/prop-types
        <form onSubmit={props.buscarProducto}>
            <legend>Busca un Producto y agrega una cantidad</legend>

            <div className="campo">
                <label>Productos:</label>
                <input
                    type="text"
                    placeholder="Nombre Productos"
                    name="productos"
                    // eslint-disable-next-line react/prop-types
                    onChange={props.leerDatosBusqueda}
                />
            </div>
            <input
                type="submit"
                className="btn btn-azul btn-block"
                value="Buscar Producto"
            />
        </form>
    );
};

export default FormBuscarPedido;
