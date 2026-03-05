import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import * as actions from "../actions"
import { ErrorDisplay } from "../../common" 
import { GoogleAuthButton, GoogleAuthProviderWrapper } from "../../app" 

const SignUp = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    getValues,
  } = useForm()

  const [backendErrors, setBackendErrors] = useState(null)

  const onSubmitTraditional = async (data) => {
    setBackendErrors(null)

    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Las contraseñas no coinciden",
      })
      return
    }

    dispatch(
      actions.signUp(
        {
          username: data.username.trim(),
          password: data.password,
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          email: data.email.trim(),
        },
        () => navigate("/"),
        (errors) => {
          setBackendErrors(errors)
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
    dispatch(
      actions.googleLogin(
        token,
        () => navigate("/"),
        (errors) => {
          setBackendErrors(errors)
        },
        () => {
          navigate("/login")
          dispatch(actions.logout())
        },
      ),
    )
  }

  const handleGoogleError = (error) => {
    console.error("Error en autenticación de Google:", error)
    setBackendErrors({ global: "Error al registrarse con Google. Inténtalo de nuevo." })
  }

  return (
    <GoogleAuthProviderWrapper>
      <div className="min-h-screen flex items-center justify-center p-2 sm:p-6 lg:p-8 w-full">
        <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg">
          <div className="md:absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg transform -skew-y-3 sm:skew-y-0 sm:-rotate-3 rounded-3xl"></div>
          <div className="relative bg-white shadow-lg rounded-3xl p-5 sm:p-10 md:p-12 flex flex-col justify-center mt-7">
            <div className="w-full mx-auto">
              {backendErrors && (
                <ErrorDisplay backendErrors={backendErrors} handleCancelClick={() => setBackendErrors(null)} />
              )}
              <h1 className="text-2xl font-bold text-center text-gray-900">Regístrate</h1>
              <div className="mt-6">
                <form className="space-y-8" onSubmit={handleSubmit(onSubmitTraditional)} noValidate>
                  <div className="relative">
                    <input
                      type="text"
                      id="firstName"
                      className="h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-500 px-2"
                      placeholder="Nombre"
                      {...register("firstName", { required: "El nombre es requerido" })}
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      id="lastName"
                      className="h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-500 px-2"
                      placeholder="Apellido"
                      {...register("lastName", { required: "El apellido es requerido" })}
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      className="h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-500 px-2"
                      placeholder="Email"
                      {...register("email", {
                        required: "El email es requerido",
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                          message: "Formato de email inválido",
                        },
                      })}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      id="username"
                      className="h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-500 px-2"
                      placeholder="Usuario"
                      {...register("username", { required: "El usuario es requerido" })}
                    />
                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      className="h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-500 px-2"
                      placeholder="Contraseña"
                      {...register("password", {
                        required: "La contraseña es requerida",
                        minLength: {
                          value: 6,
                          message: "La contraseña debe tener al menos 6 caracteres",
                        },
                      })}
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      id="confirmPassword"
                      className="h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-500 px-2"
                      placeholder="Confirmar Contraseña"
                      {...register("confirmPassword", {
                        required: "Confirma tu contraseña",
                        validate: (value) => value === getValues("password") || "Las contraseñas no coinciden",
                      })}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      id="signupBtn"
                      className="w-full bg-amber-400 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-md transition shadow-md"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Registrando..." : "Registrarse"}
                    </button>
                  </div>
                </form>
              </div>
              <div className="mt-8 flex justify-center">
                <GoogleAuthButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} isSignUp={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleAuthProviderWrapper>
  )
}

export default SignUp
