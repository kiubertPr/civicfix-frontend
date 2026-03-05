import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { User, Mail, Shield, Calendar, Gift } from "lucide-react"

import * as selectors from "../../users/selectors"
import * as posts from "../../posts"

import { Home } from "../../app"
import { BackLink } from "../../common"

const Profile = () => {
  const user = useSelector(selectors.getUser)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(posts.default.actions.getUserPosts())
  }, [])

  return (
    <Home>
      <div className="xl:5/8 lg:w-2/5 lg:max-w-5xl w-full mt-15 lg:mt-0 mx-auto px-4 py-6 overflow-y-auto scroll-auto scroll no-scrollbar">
        <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="block mt-4 ml-4">
            <BackLink size={20} />
          </div>

          {/* Header con avatar */}
          <div className="flex flex-col items-center py-8 px-4 border-b border-gray-700">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700 mb-4">
              <img
                src={user.avatar}
                alt={`${user.username}'s avatar`}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-white mt-2">{user.username}</h2>
            {user.role && (
              <span
                className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                  user.role === "ADMIN" ? "bg-red-900 text-red-100" : "bg-blue-900 text-blue-100"
                }`}
              >
                {user.role === "ADMIN" ? "Administrador" : "Usuario"}
              </span>
            )}
          </div>

          <div className="lg:p-6 p-2 lg:space-y-6 space-y-4">
            {/* Información Personal - Ocupa todo el ancho */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 border-b border-gray-700 pb-2 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Información Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Nombre:
                    </span>
                    <span className="text-white font-medium">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email:
                    </span>
                    <span className="text-white font-medium">{user.email}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Rol:
                    </span>
                    <span className="text-white font-medium">
                      {user.role === "ADMIN" ? "Administrador" : "Usuario"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center">
                      <Gift className="h-4 w-4 mr-2" />
                      Puntos Usuario:
                    </span>
                    <span className={`${user.points >= 0 ? "text-green-400 font-medium" : "text-red-400 font-medium"}` }>{user.points}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Acciones</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded-lg transition-colors font-medium"
                  onClick={() => navigate("/updateprofile")}
                >
                  Editar Perfil
                </button>
                <button
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors font-medium"
                  onClick={() => navigate("/points/history")}
                >
                  Historial de Puntos
                </button>
              </div>
            </div>

            {/* Actividad Reciente */}
            <div className="bg-gray-900 rounded-xl lg:p-6 p-2">
              <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                Actividad Reciente
              </h3>
              <div className="text-gray-400">
                <posts.MyPostsSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Home>
  )
}

export default Profile
