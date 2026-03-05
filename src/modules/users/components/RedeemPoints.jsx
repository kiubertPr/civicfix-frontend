import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Gift, Coffee, ShoppingBag, Ticket, Star, Loader2, AlertCircle } from "lucide-react"

import users from "../../users"
import { Home } from "../../app"
import { BackLink, ErrorDisplay, SuccessDark } from "../../common"

const RedeemPoints = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(users.selectors.getUser)
  const userPoints = user.points || 0
  const [isRedeemLoading, setIsRedeemLoading] = useState(false)

  const [selectedReward, setSelectedReward] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [redeemSuccess, setRedeemSuccess] = useState(null)
  const [redeemError, setRedeemError] = useState(null)

  // Recompensas disponibles
  const rewards = [
    {
      id: 1,
      title: "Café Gratis",
      description: "Un café gratis en cualquier cafetería local participante",
      points: 1,
      icon: Coffee,
      color: "from-amber-500 to-orange-600",
      category: "Gastronomía",
    },
    {
      id: 2,
      title: "Descuento Comercio Local",
      description: "10% de descuento en comercios locales participantes",
      points: 1,
      icon: ShoppingBag,
      color: "from-blue-500 to-purple-600",
      category: "Compras",
    },
    {
      id: 3,
      title: "Entrada Evento Cultural",
      description: "Entrada gratuita a eventos culturales del municipio",
      points: 3,
      icon: Ticket,
      color: "from-green-500 to-teal-600",
      category: "Cultura",
    },
    {
      id: 4,
      title: "Reconocimiento Ciudadano",
      description: "Certificado de reconocimiento por participación ciudadana",
      points: 10,
      icon: Star,
      color: "from-purple-500 to-pink-600",
      category: "Reconocimiento",
    },
  ]

  const handleRedeemClick = (reward) => {
    if (userPoints < reward.points) {
      setRedeemError(`Necesitas ${reward.points - userPoints} puntos más para canjear esta recompensa`)
      return
    }

    setSelectedReward(reward)
    setShowConfirmation(true)
    setRedeemError(null)
  }

  const confirmRedeem = () => {
    if (!selectedReward) return

    setIsRedeemLoading(true)

    dispatch(
      users.actions.redeemPrice(
        selectedReward.points,
        (response) => {
          setRedeemSuccess({
            reward: selectedReward,
            code: "CIVIC-" + Date.now(),
          })
          setShowConfirmation(false)
          setIsRedeemLoading(false)
          setSelectedReward(null)
        },
        (error) => {
          setRedeemError(error.message || "Error al canjear la recompensa")
          setShowConfirmation(false)
          setSelectedReward(null)
        },
      ),
    )
  }

  const cancelRedeem = () => {
    setShowConfirmation(false)
    setSelectedReward(null)
  }

  if (!user) {
    return (
      <Home>
        <div className="w-full mt-15 lg:mt-0 max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Acceso Requerido</h2>
            <p className="text-gray-400 mb-6">Necesitas iniciar sesión para canjear puntos</p>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </Home>
    )
  }

  return (
    <Home>
      <div className="w-full mt-15 lg:mt-0 max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <BackLink size={20} />
            <div>
              <h1 className="text-3xl font-bold text-white">Canjear Puntos</h1>
              <p className="text-gray-400">Intercambia tus puntos por recompensas</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="flex items-center gap-2 justify-center mb-1">
              <Gift className="h-5 w-5 text-amber-500" />
              <span className="text-sm text-gray-400">Tus puntos</span>
            </div>
            <div className="text-2xl font-bold text-amber-500">{userPoints.toLocaleString()}</div>
          </div>
        </div>

        {redeemSuccess && (
          <SuccessDark
            message={`¡Has canjeado "${redeemSuccess.reward.title}" exitosamente! Código: ${redeemSuccess.code}`}
            onClose={() => setRedeemSuccess(null)}
          />
        )}

        {redeemError && <ErrorDisplay backendErrors={redeemError} handleCancelClick={() => setRedeemError(null)} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rewards.map((reward) => {
            const canAfford = userPoints >= reward.points
            const IconComponent = reward.icon

            return (
              <div
                key={reward.id}
                className={`bg-gray-800 rounded-xl overflow-hidden border transition-all duration-200 ${
                  canAfford
                    ? "border-gray-700 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/20"
                    : "border-gray-700 opacity-60"
                }`}
              >
                <div className={`bg-gradient-to-r ${reward.color} p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 rounded-lg p-2">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{reward.title}</h3>
                        <span className="text-white/80 text-sm">{reward.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold text-lg">{reward.points.toLocaleString()}</div>
                      <div className="text-white/80 text-sm">puntos</div>
                    </div>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-4">
                  <p className="text-gray-300 mb-4">{reward.description}</p>

                  <button
                    onClick={() => handleRedeemClick(reward)}
                    disabled={!canAfford || isRedeemLoading}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                      canAfford
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {!canAfford
                      ? `Necesitas ${(reward.points - userPoints).toLocaleString()} puntos más`
                      : "Canjear Ahora"}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {showConfirmation && selectedReward && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-white mb-4">Confirmar Canje</h3>

              <div className="bg-gray-700 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <selectedReward.icon className="h-6 w-6 text-amber-500" />
                  <span className="text-white font-semibold">{selectedReward.title}</span>
                </div>
                <p className="text-gray-300 text-sm mb-3">{selectedReward.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Costo:</span>
                  <span className="text-amber-500 font-bold">{selectedReward.points.toLocaleString()} puntos</span>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Puntos actuales:</span>
                  <span className="text-white">{userPoints.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Puntos después del canje:</span>
                  <span className="text-amber-500 font-semibold">
                    {(userPoints - selectedReward.points).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cancelRedeem}
                  disabled={isRedeemLoading}
                  className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmRedeem}
                  disabled={isRedeemLoading}
                  className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isRedeemLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Canjeando...
                    </>
                  ) : (
                    "Confirmar Canje"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Home>
  )
}

export default RedeemPoints
