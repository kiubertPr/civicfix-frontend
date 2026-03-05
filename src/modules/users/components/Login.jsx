import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import * as actions from "../actions"
import { ErrorDisplay } from "../../common"
import {GoogleAuthButton} from "../../app" // El nuevo botón de Google

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Configura react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm()

  const [backendErrors, setBackendErrors] = useState(null)

  const onSubmitTraditional = async (data) => {
    setBackendErrors(null) // Limpiar errores previos del backend
    dispatch(
      actions.login(
        data.username.trim(),
        data.password,
        () => navigate("/"),
        (errors) => {
          // Manejar errores del backend, puedes mapearlos a errores de react-hook-form si quieres
          setBackendErrors(errors)
          // Ejemplo de cómo podrías establecer un error en un campo específico
          // setError("username", { type: "manual", message: "Usuario o contraseña incorrectos" });
        },
        () => {
          navigate("/login")
          dispatch(actions.logout())
        },
      ),
    )
  }

  const handleGoogleSuccess = async (token) => {
    setBackendErrors(null)
    console.log("Token de Google:", token)
    dispatch(
      actions.googleLogin(
        token,
        () => navigate("/"),
        (errors) => {
          setBackendErrors(errors)
        },
        () => {
          navigate("/login")
          dispatch(actions.logout()) // O una acción específica para logout de Google
        },
      ),
    )
  }

  const handleGoogleError = (error) => {
    console.error("Error en autenticación de Google:", error)
    setBackendErrors({ global: "Error al iniciar sesión con Google. Inténtalo de nuevo." }) // Mostrar un error genérico
  }

  return (
    <div className="min-h-screen w-4xl flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg transform -skew-y-3 sm:skew-y-0 sm:-rotate-3 rounded-3xl"></div>
        <div className="relative bg-white shadow-lg rounded-3xl p-5 sm:p-10 md:p-12 min-h-[500px] sm:min-h-[600px] md:min-h-[650px] flex flex-col justify-center">
          <div className="max-w-md mx-5">
            {backendErrors && (
              <ErrorDisplay backendErrors={backendErrors} handleCancelClick={() => setBackendErrors(null)} />
            )}
            <h1 className="text-2xl font-bold text-center text-gray-900">Login</h1>
            <div className="mt-6">
              {/* Formulario tradicional con react-hook-form */}
              <form className="space-y-8" onSubmit={handleSubmit(onSubmitTraditional)} noValidate>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    className="h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-500 px-2"
                    placeholder="Username"
                    {...register("username", { required: "El usuario es requerido" })} // Registro de react-hook-form
                  />
                  {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    className="h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-500 px-2"
                    placeholder="Password"
                    {...register("password", { required: "La contraseña es requerida" })} // Registro de react-hook-form
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <a href="/signup" className="text-sm text-cyan-500 hover:text-cyan-700">
                    No tienes cuenta? Regístrate
                  </a>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    id="loginBtn"
                    className="w-full bg-amber-400 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-md transition shadow-md"
                    disabled={isSubmitting} // Deshabilitar mientras se envía
                  >
                    {isSubmitting ? "Enviando..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
            <div className="mt-8 flex justify-center">
              {/* Botón de Google */}
              <GoogleAuthButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
