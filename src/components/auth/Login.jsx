import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";

// context
import { CRMContext } from "../../context/CRMContext";

const Login = () => {
    const redirect = useNavigate();

    // Auth y token
    // eslint-disable-next-line no-unused-vars
    const [auth, guardarAuth] = useContext(CRMContext);

    // State con los datos del formulario
    const [credenciales, guardarCredenciales] = useState({});

    // iniciar sesión en el servidor
    const iniciarSesion = async (e) => {
        e.preventDefault();

        // autenticar al usuario

        try {
            const respuesta = await clienteAxios.post(
                "/iniciar-sesion",
                credenciales
            );

            // extraer el token y colocarlo en localstorage

            const { token } = respuesta.data;
            localStorage.setItem("token", token);

            // colocarlo en el state
            guardarAuth({
                token,
                auth: true,
            });

            // alerta
            Swal.fire("Login Correcto", "Has iniciado Sesión", "success");

            // redireccionar
            redirect("/");
        } catch (error) {
            // console.log(error);
            if (error.response) {
                Swal.fire({
                    title: "Hubo un error",
                    text: error.response.data.message,
                    icon: "error",
                });
            } else {
                // Si el error es de CORS
                Swal.fire({
                    title: "Hubo un error",
                    text: "Hubo un error",
                    icon: "error",
                });
            }
        }
    };

    // almacenar lo que el usuario escribe en el state
    const leerDatos = (e) => {
        guardarCredenciales({
            ...credenciales,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="login">
            <h2>Login</h2>

            <div className="contenedor-formulario">
                <form onSubmit={iniciarSesion}>
                    <div className="campo">
                        <label>Email</label>
                        <input
                            type="text"
                            name="email"
                            placeholder="Email para Iniciar Sesión"
                            required
                            onChange={leerDatos}
                        />
                    </div>
                    <div className="campo">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password para Iniciar Sesión"
                            required
                            onChange={leerDatos}
                        />
                    </div>

                    <input
                        type="submit"
                        value="Iniciar Sesión"
                        className="btn btn-verde btn-block"
                    />
                </form>
            </div>
        </div>
    );
};

export default Login;
