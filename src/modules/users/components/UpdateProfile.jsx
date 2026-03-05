import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { User, Camera, Save, X, Eye, EyeOff, Lock } from "lucide-react"

import * as selectors from "../../users/selectors"
import * as actions from "../../users/actions"
import { Home } from "../../app"
import { BackLink, ErrorDisplay } from "../../common"

const UpdateProfile = () => {
  const user = useSelector(selectors.getUser)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isGoogleUser = user && user.provider === "GOOGLE"

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [backendErrors, setBackendErrors] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState("")
  const [avatarFile, setAvatarFile] = useState(null) // Guardar el archivo real
  const [changePassword, setChangePassword] = useState(false)

  const newPassword = watch("newPassword")

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        username: user.username || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setAvatarPreview(user.avatar || "")
    }
  }, [user, reset])

  const validationRules = {
    firstName: {
      required: "El nombre es requerido",
      minLength: {
        value: 2,
        message: "El nombre debe tener al menos 2 caracteres",
      },
    },
    email: {
      required: "El email es requerido",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "El email no es válido",
      },
    },
    username: {
      required: "El nombre de usuario es requerido",
      minLength: {
        value: 3,
        message: "El nombre de usuario debe tener al menos 3 caracteres",
      },
      pattern: {
        value: /^[a-zA-Z0-9_]+$/,
        message: "Solo se permiten letras, números y guiones bajos",
      },
    },
    currentPassword: changePassword
      ? {
          required: "La contraseña actual es requerida",
        }
      : {},
    newPassword: changePassword
      ? {
          required: "La nueva contraseña es requerida",
          minLength: {
            value: 6,
            message: "La contraseña debe tener al menos 6 caracteres",
          },
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            message: "La contraseña debe contener al menos una mayúscula, una minúscula y un número",
          },
        }
      : {},
    confirmPassword: changePassword
      ? {
          required: "Confirma tu nueva contraseña",
          validate: (value) => value === newPassword || "Las contraseñas no coinciden",
        }
      : {},
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        setBackendErrors("Por favor selecciona una imagen válida")
        return
      }

      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setBackendErrors("La imagen debe ser menor a 5MB")
        return
      }

      // Guardar el archivo real para envío
      setAvatarFile(file)

      // Crear preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data) => {
    setBackendErrors(null)

    try {
      const formData = new FormData()

      // Datos del usuario
      const userDto = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        username: data.username,
        provider: user.provider,
      }
      formData.append("userDto", JSON.stringify(userDto))

      // Datos de contraseña (solo si se está cambiando)
      if (changePassword && data.currentPassword && data.newPassword) {
        const passwordData = {
          oldPassword: data.currentPassword,
          newPassword: data.newPassword,
        }
        formData.append("changePasswordParamsDto", JSON.stringify(passwordData))
      } else {
        // Enviar objeto vacío si no se cambia contraseña
        formData.append("changePasswordParamsDto", JSON.stringify({}))
      }

      // Avatar (solo si hay uno nuevo)
      if (avatarFile) {
        formData.append("avatar", avatarFile)
      } else {
        // Crear un blob vacío para mantener la estructura multipart
        const emptyBlob = new Blob([], { type: "application/octet-stream" })
        formData.append("avatar", emptyBlob, "")
      }

      await dispatch(
        actions.update(
          formData,
          () => {
            // Success callback
            navigate("/profile")
          },
          (errors) => {
            // Error callback
            setBackendErrors(errors)
          },
        ),
      )
      
    } catch (error) {
      setBackendErrors(error.message || "Error al actualizar el perfil")
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleChangePasswordToggle = () => {
    setChangePassword(!changePassword)
    if (changePassword) {
      setValue("currentPassword", "")
      setValue("newPassword", "")
      setValue("confirmPassword", "")
    }
  }

  return (
    <Home>
      <div className="xl:w-5/8 lg:w-3/5 lg:max-w-5xl lg:mt-0 mt-15 w-full mx-auto px-4 py-6 overflow-y-auto scroll-auto scroll no-scrollbar">
        <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="block mt-4 ml-4">
            <BackLink size={20} />
          </div>

          <div className="flex items-center justify-center py-6 px-4 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-white">Editar Perfil</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {backendErrors && (
              <ErrorDisplay backendErrors={backendErrors} handleCancelClick={() => setBackendErrors(null)} />
            )}

            {/* Avatar */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Foto de Perfil
              </h3>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700">
                    <img
                      src={avatarPreview || "/placeholder.svg"}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="absolute bottom-0 right-0 bg-amber-500 hover:bg-amber-600 rounded-full p-2 cursor-pointer transition-colors">
                    <Camera className="h-4 w-4 text-white" />
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </label>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-white font-medium mb-2">Cambiar foto de perfil</p>
                  <p className="text-gray-400 text-sm">
                    Formatos soportados: JPG, PNG, GIF
                    <br />
                    Tamaño máximo: 5MB
                  </p>
                  {avatarFile && (
                    <p className="text-green-400 text-sm mt-2">✓ Nueva imagen seleccionada: {avatarFile.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Información Personal */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Información Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Nombre *</label>
                  <Controller
                    name="firstName"
                    control={control}
                    rules={validationRules.firstName}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg border ${
                          errors.firstName ? "border-red-500" : "border-gray-600"
                        } focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all`}
                        placeholder="Tu nombre"
                      />
                    )}
                  />
                  {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName.message}</p>}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Apellido</label>
                  <Controller
                    name="lastName"
                    control={control}
                    rules={validationRules.lastName}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg border ${
                          errors.lastName ? "border-red-500" : "border-gray-600"
                        } focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all`}
                        placeholder="Tu apellido"
                      />
                    )}
                  />
                  {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName.message}</p>}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Email *</label>
                  <Controller
                    name="email"
                    control={control}
                    rules={validationRules.email}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="email"
                        disabled={isGoogleUser}
                        className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg border ${
                          errors.email ? "border-red-500" : "border-gray-600"
                        } focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all`}
                        placeholder="tu@email.com"
                      />
                    )}
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Nombre de Usuario *</label>
                  <Controller
                    name="username"
                    control={control}
                    rules={validationRules.username}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg border ${
                          errors.username ? "border-red-500" : "border-gray-600"
                        } focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all`}
                        placeholder="tu_usuario"
                      />
                    )}
                  />
                  {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>}
                </div>
              </div>
            </div>

            {/* Cambiar Contraseña */}
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Cambiar Contraseña
                </h3>
                <button
                  type="button"
                  disabled={isGoogleUser}
                  onClick={handleChangePasswordToggle}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    changePassword
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  }`}
                >
                  {changePassword ? "Cancelar" : "Cambiar"}
                </button>
              </div>

              {changePassword && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Contraseña Actual *</label>
                    <div className="relative">
                      <Controller
                        name="currentPassword"
                        control={control}
                        rules={validationRules.currentPassword}
                        render={({ field }) => (
                          <input
                            {...field}
                            type={showPasswords.current ? "text" : "password"}
                            className={`w-full px-4 py-3 pr-12 bg-gray-700 text-white rounded-lg border ${
                              errors.currentPassword ? "border-red-500" : "border-gray-600"
                            } focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all`}
                            placeholder="Tu contraseña actual"
                          />
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="text-red-400 text-sm mt-1">{errors.currentPassword.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">Nueva Contraseña *</label>
                      <div className="relative">
                        <Controller
                          name="newPassword"
                          control={control}
                          rules={validationRules.newPassword}
                          render={({ field }) => (
                            <input
                              {...field}
                              type={showPasswords.new ? "text" : "password"}
                              className={`w-full px-4 py-3 pr-12 bg-gray-700 text-white rounded-lg border ${
                                errors.newPassword ? "border-red-500" : "border-gray-600"
                              } focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all`}
                              placeholder="Nueva contraseña"
                            />
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("new")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {errors.newPassword && <p className="text-red-400 text-sm mt-1">{errors.newPassword.message}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">Confirmar Contraseña *</label>
                      <div className="relative">
                        <Controller
                          name="confirmPassword"
                          control={control}
                          rules={validationRules.confirmPassword}
                          render={({ field }) => (
                            <input
                              {...field}
                              type={showPasswords.confirm ? "text" : "password"}
                              className={`w-full px-4 py-3 pr-12 bg-gray-700 text-white rounded-lg border ${
                                errors.confirmPassword ? "border-red-500" : "border-gray-600"
                              } focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all`}
                              placeholder="Confirmar contraseña"
                            />
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("confirm")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors font-medium flex items-center justify-center"
              >
                <X className="h-5 w-5 mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || (!isDirty && avatarFile === null)}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-700 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg transition-colors font-medium flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>

            {isDirty && (
              <div className="text-center">
                <p className="text-amber-400 text-sm">Tienes cambios sin guardar</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </Home>
  )
}

export default UpdateProfile
