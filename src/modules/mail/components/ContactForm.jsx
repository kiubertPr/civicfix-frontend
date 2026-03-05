import { useState } from "react"
import { Home } from "../../app"
import { BackLink, ErrorDisplay, SuccessDark } from "../../common"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import * as actions from "../actions"

const ContactForm = () => {
  const dispatch = useDispatch()
  // Corregido: useState en lugar de destructuring incorrecto
  const [backendErrors, setBackendErrors] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null) // Añadido estado para mensaje de éxito
  const [isLoading, setIsLoading] = useState(false) // Añadido estado de loading

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    setBackendErrors(null)
    setSuccessMessage(null)

    const contactFormDto = {
      // Corregido: typo en el nombre
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    }

    dispatch(
      actions.contact(
        contactFormDto,
        (response) => {
          setSuccessMessage("¡Mensaje enviado correctamente! Te responderemos lo antes posible.")
          setBackendErrors(null)
          reset()
          setIsLoading(false)
        },
        (errors) => {
          setBackendErrors(errors)
          setSuccessMessage(null)
          setIsLoading(false)
        },
      ),
    )
  }

  return (
    <Home>
      <div className="xl:w-5/8 lg:2/5 w-full flex justify-center lg:mt-0 mt-15 mx-auto px-4 py-6 overflow-y-auto scroll-auto scroll no-scrollbar">
        <div className="max-w-5xl">
          <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden p-5">
            <BackLink />
            <div className="border-b border-gray-700 pt-4 pb-4 lg:p-6">
              <h2 className="text-2xl font-bold text-white"> Formulario de Contacto</h2>
              <br />
              <p className="text-gray-400 text-justify">
                Si tienes alguna pregunta o necesitas más información, por favor completa el siguiente formulario y nos
                pondremos en contacto contigo lo antes posible.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="pt-4 pb-4 lg:p-6 space-y-4">
              {/* Mostrar mensaje de éxito */}
              {successMessage && <SuccessDark message={successMessage} onClose={() => setSuccessMessage(null)} />}

              {/* Mostrar errores del backend */}
              {backendErrors && (
                <ErrorDisplay backendErrors={backendErrors} handleCancelClick={() => setBackendErrors(null)} />
              )}

              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Nombre y Apellidos
                </label>
                <input
                  id="name"
                  {...register("name", { required: "El nombre es obligatorio" })}
                  className="bg-gray-700 text-white rounded-lg p-3 w-full border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition"
                  placeholder="Nombre completo"
                  disabled={isLoading}
                />
                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  {...register("email", {
                    required: "El correo electrónico es obligatorio",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Formato de email inválido",
                    },
                  })}
                  className="bg-gray-700 text-white rounded-lg p-3 w-full border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition"
                  placeholder="Correo electrónico"
                  type="email"
                  disabled={isLoading}
                />
                {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300">
                  Asunto
                </label>
                <input
                  id="subject" // Corregido: era "name" antes
                  {...register("subject", {
                    required: "El asunto es obligatorio",
                    maxLength: { value: 200, message: "El asunto no puede exceder los 200 caracteres" },
                  })}
                  className="bg-gray-700 text-white rounded-lg p-3 w-full border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition"
                  placeholder="Asunto del mensaje"
                  disabled={isLoading}
                />
                {errors.subject && <span className="text-red-500 text-sm">{errors.subject.message}</span>}
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  {...register("message", {
                    required: "Es obligatorio que nos cuentes como podemos ayudarte",
                    maxLength: { value: 2000, message: "El mensaje no puede exceder los 2000 caracteres" },
                  })}
                  className="bg-gray-700 text-white rounded-lg p-3 w-full min-h-[120px] border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition"
                  placeholder="¿En qué te podemos ayudar?"
                  disabled={isLoading}
                />
                {errors.message && <span className="text-red-500 text-sm">{errors.message.message}</span>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full font-medium rounded-lg py-3 px-4 transition-colors
                            focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800
                            flex items-center justify-center bg-amber-500 hover:bg-amber-600 disabled:bg-amber-700 disabled:cursor-not-allowed text-white"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  "Enviar"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Home>
  )
}

export default ContactForm