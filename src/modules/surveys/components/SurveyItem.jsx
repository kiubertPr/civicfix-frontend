import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { CheckCircle, Send, Clock, ChevronDown, DoorClosed } from "lucide-react"
import * as actions from "../actions"
import users from "../../users"

// Recharts components for both BarChart and PieChart
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from "recharts";


const SurveyItem = ({ survey, callBack, onErrors }) => {
  const dispatch = useDispatch()
  const currentUser = useSelector(users.selectors.getUser)
  const userVoteCount = survey.userVote?.length ?? 0
  const [selectedOptions, setSelectedOptions] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(userVoteCount !== 0)
  const isAdmin = currentUser?.role === "ADMIN"
  const [isSurveyStatsOpen, setIsSurveyStatsOpen] = useState(false)
  const isEnded = survey.endDateTime && new Date(survey.endDateTime) < new Date()
  
  
  const totalRespondents = survey.responseCount || 0
  const rawParticipationRate = survey.participationRate || 0.0
  const displayParticipationRate = rawParticipationRate.toFixed(1)

  const estimatedTotalUsers = Math.max(
    totalRespondents,
    Math.round(totalRespondents / (rawParticipationRate / 100))
  )

  const nonRespondents = Math.max(0, estimatedTotalUsers - totalRespondents)

  const PIE_COLORS_PARTICIPATION = ["#ffba00", "#0ea5e9"]

  const chartDataParticipation = [
    { name: "Respondidos", value: totalRespondents, color: PIE_COLORS_PARTICIPATION[0] },
    { name: "No Respondidos", value: nonRespondents, color: PIE_COLORS_PARTICIPATION[1] },
  ]

  const PIE_COLORS_OPTIONS = ["#FFBB28", "#FF8042", "#00C49F", "#0088FE", "#FF00FF", "#00FFFF", "#FF6384", "#36A2EB"]

  const chartDataOptions = survey.options.map((option, index) => ({
    name: option,
    votes: survey.voteTotals?.[index] || 0, 
    color: PIE_COLORS_OPTIONS[index % PIE_COLORS_OPTIONS.length],
  }))

  const handleOptionChange = (optionValue, isChecked = null) => {
    if (survey.type === 0) {
      setSelectedOptions([optionValue])
    } else if (survey.type === 1) {
      if (isChecked) {
        setSelectedOptions((prev) => [...prev, optionValue])
      } else {
        setSelectedOptions((prev) => prev.filter((option) => option !== optionValue))
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsSubmitting(true)
    setIsSubmitted(false)
    onErrors(null)

    if (selectedOptions.length === 0) {
      onErrors("Por favor, selecciona al menos una opción.")
      setIsSubmitting(false)
      return
    }

    try {
      dispatch(
        actions.answerSurvey(
          survey.id,
          selectedOptions,
          () => {
            setIsSubmitted(true)
            setIsSubmitting(false)
            setSelectedOptions([])
            callBack()
            onErrors(null)
          },
          (error) => {
            onErrors(error)
            setIsSubmitting(false)
          },
        ),
      )
    } catch (error) {
      onErrors(error)
      setIsSubmitting(false)
    }
  }

  const getSurveyTypeLabel = () => {
    return survey.type === 0 ? "Selección única" : "Selección múltiple"
  }

  let optionsSection = null

  if (survey && survey.options && !isSubmitted && !isEnded) {
    if (survey.type === 0) {
      optionsSection = (
        <div className="space-y-3">
          {survey.options.map((option, index) => (
            <div key={index} className="flex items-center">
              <input
                type="radio"
                id={`survey-${survey.id}-option-${index}`}
                name={`survey-${survey.id}`}
                value={index}
                checked={selectedOptions.includes(index)}
                onChange={() => handleOptionChange(index)}
                className="mr-3 h-4 w-4 text-amber-500 border-gray-600 bg-gray-700 focus:ring-amber-500 focus:ring-2"
                disabled={isSubmitting}
              />
              <label
                htmlFor={`survey-${survey.id}-option-${index}`}
                className="text-sm text-gray-300 cursor-pointer hover:text-white transition-colors"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      )
    } else if (survey.type === 1) {
      // Checkboxes
      optionsSection = (
        <div className="space-y-3">
          {survey.options.map((option, index) => (
            <div key={index} className="flex items-center">
              <input
                type="checkbox"
                id={`survey-${survey.id}-option-${index}`}
                name={`survey-${survey.id}-option-${index}`}
                value={index}
                checked={selectedOptions.includes(index)}
                onChange={(e) => handleOptionChange(index, e.target.checked)}
                className="mr-3 h-4 w-4 text-amber-500 border-gray-600 bg-gray-700 focus:ring-amber-500 focus:ring-2 rounded"
                disabled={isSubmitting}
              />
              <label
                htmlFor={`survey-${survey.id}-option-${index}`}
                className="text-sm text-gray-300 cursor-pointer hover:text-white transition-colors"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      )
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden mb-4 border border-gray-700 shadow-md shadow-black/35">
      {/* Survey Details Section (always open) */}
      <div className="w-full lg:p-4 p-2">
        <div className="flex justify-between items-center w-full text-left">
          <h3 className="lg:text-lg font-medium text-white">{survey.question}</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 ml-3 bg-gray-700 text-gray-300 rounded-full">
              {getSurveyTypeLabel()}
            </span>
            {isSubmitted && (
              <div className="flex items-center text-green-400 text-xs">
                <CheckCircle className="h-4 w-4 mr-1" />
                Respondida
              </div>
            )}
          </div>
        </div>
        <div className="pt-10">
          <form onSubmit={handleSubmit}>
            <section className="mb-4">{optionsSection}</section>

            {isSubmitted && (
              <div className="flex items-center justify-center p-3 bg-green-900/30 border border-green-700 text-green-300 rounded-lg">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>¡Gracias por tu respuesta!</span>
              </div>
            )}

            {isEnded && !isSubmitted && (
                <div className="flex items-center justify-center p-3 bg-amber-900/30 border border-amber-700 text-amber-300 rounded-lg">
                  <DoorClosed className="h-5 w-5 mr-2" />
                  <span>La encuesta ha finalizado.</span>
                </div>
              )}

            {(!isSubmitted && !isEnded) && (
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  {selectedOptions.length > 0 && (
                    <span>
                      {selectedOptions.length} opción{selectedOptions.length !== 1 ? "es" : ""} seleccionada
                      {selectedOptions.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || selectedOptions.length === 0 || isAdmin}
                  className="flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:focus:ring-offset-gray-800"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Respuesta
                    </>
                  )}
                </button>
              </div>
            )}
            </form>
          </div>
        </div>

      {isAdmin && (
        <div className="w-full border-t border-gray-700">
          <button
            className="flex justify-between items-center w-full lg:p-4 p-2 text-left hover:bg-gray-700 transition-colors"
            onClick={() => setIsSurveyStatsOpen(!isSurveyStatsOpen)}
          >
            <h3 className="lg:text-lg font-medium text-white">Estadísticas de la Encuesta</h3>
            <ChevronDown
              className={`h-5 w-5 text-gray-400 transition-transform ${isSurveyStatsOpen ? "rotate-180" : ""}`}
            />
          </button>
          {isSurveyStatsOpen && (
            <div className="lg:px-4 px-2 pb-4 grid gap-4 md:grid-cols-2">
              <div className="bg-gray-700 border border-gray-600 text-white rounded-lg p-4">
                <div className="mb-2">
                  <h4 className="text-lg font-medium">Participación de Usuarios</h4>
                  <p className="text-gray-300 text-sm">
                    Total de usuarios que han respondido la encuesta: {totalRespondents}
                    <br />
                    Tasa de participación: {displayParticipationRate}%
                  </p>
                </div>
                <div className="flex items-center justify-center h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartDataParticipation}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        paddingAngle={5}
                        labelLine={false}
                      >
                        {chartDataParticipation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ paddingTop: "10px" }}
                        layout="horizontal"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-700 border border-gray-600 text-white rounded-lg p-4">
                <div className="mb-2">
                  <h4 className="text-lg font-medium">Respuestas Más Votadas</h4>
                  <p className="text-gray-300 text-sm">Distribución de votos por opción.</p>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer
                    width="100%"
                    height={Math.max(250, chartDataOptions.length * 40)}
                  >
                    <BarChart
                      data={chartDataOptions}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis 
                        type="number" 
                        allowDecimals={false} 
                        tick={{ fill: '#ccc', fontSize: 12 }}
                        domain={[0, 'dataMax']} 
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={120}
                        tick={{ fill: 'white', fontSize: 12 }}
                        tickFormatter={(name) =>
                          name.length > 15 ? name.slice(0, 15) + '…' : name
                        }
                      />
                      <Tooltip
                        formatter={(value, name, props) => [`${value} votos`, props.payload.name]}
                      />
                      <Bar dataKey="votes" fill="#8884d8">
                        {chartDataOptions.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SurveyItem
