import { useState, useRef, useEffect } from "react"
import { Mail, User, Shield, MoreVertical, Edit, Trash2, Eye, TreeDeciduous, ShieldBan } from "lucide-react"

const UserCard = ({ user, onDelete, onDisable }) => {
  const [imageError, setImageError] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowActions(false)
      }
    }

    if (showActions) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showActions])

  const handleImageError = () => {
    setImageError(true)
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase()
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-900 text-red-100"
      case "USER":
        return "bg-amber-600 text-blue-100"
      default:
        return "bg-gray-700 text-gray-300"
    }
  }

  const getRoleLabel = (role) => {
    switch (role) {
      case "ADMIN":
        return "Administrador"
      case "USER":
        return "Usuario"
      case "DISABLED":
        return "Deshabilitado"
      default:
        return role
    }
  }

  const handleMenuAction = (action) => {
    setShowActions(false)
    if (action) action(user)
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-md shadow-black/35 hover:border-gray-600 transition-all duration-200 group relative">
      <div className="p-4 sm:p-6">
        {/* Header con avatar y acciones */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              {!imageError && user.avatar ? (
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={`Avatar de ${user.username}`}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-600"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-semibold text-lg border-2 border-gray-600">
                  {getInitials(user.firstName, user.lastName) || user.username?.charAt(0)?.toUpperCase()}
                </div>
              )}
              {user.role === "ADMIN" && (
                <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1">
                  <Shield size={20} className="text-white" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-white truncate">
                {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
              </h3>
              <p className="text-sm text-gray-400 truncate">@{user.username}</p>
            </div>
          </div>

          {/* Menú de acciones */}
          <div className="relative flex-shrink-0">
            <button
              ref={buttonRef}
              onClick={() => setShowActions(!showActions)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Opciones de usuario"
            >
              <MoreVertical size={20} />
            </button>

            {/* Menú desplegable */}
            {showActions && (
              <div
                ref={menuRef}
                className="absolute right-0 top-full mt-2 bg-gray-700 rounded-lg shadow-xl border border-gray-600 py-2 z-50 min-w-[140px] animate-in fade-in-0 zoom-in-95 duration-100"
                style={{
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <button
                  onClick={() => handleMenuAction(onDelete)}
                  className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 flex items-center gap-3 transition-colors"
                >
                  <Trash2 size={20} />
                  Eliminar
                </button>
                <button
                  onClick={() => handleMenuAction(onDisable)}
                  className={`w-full px-4 py-2 text-left text-sm ${user.role === "DISABLED" ? "text-green-400 hover:bg-green-900/20 hover:text-green-300" : "text-red-400 hover:bg-red-900/20 hover:text-red-300"} flex items-center gap-3 transition-colors`}
                >
                  {user.role === "DISABLED" ? (
                    <Shield size={20} />
                  ) : (
                    <ShieldBan size={20} />
                  )}
                  {user.role === "DISABLED" ? "Habilitar" : "Deshabilitar"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Información del usuario */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}
            >
              {user.role === "ADMIN" && <Shield className="h-3 w-3 mr-1" />}
              {getRoleLabel(user.role)}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-300">
            <Mail size={20} className="mr-2 text-gray-400 flex-shrink-0" />
            <a href={`mailto:${user.email}`} className="hover:text-amber-400 transition-colors truncate">
              {user.email}
            </a>
          </div>

          <div className="flex items-center text-sm text-gray-300">
            <User size={20} className="mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">ID: {user.id}</span>
          </div>
        </div>

        {/* Acciones principales */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center text-sm text-green-300">
            <TreeDeciduous size={20} className="mr-2 text-green-400 flex-shrink-0" />
            <span className="truncate">{user.points}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserCard