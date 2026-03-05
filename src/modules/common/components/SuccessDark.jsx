import PropTypes from "prop-types"
import { CheckCircle, X } from "lucide-react"

// Versión del componente Success adaptada para tema oscuro
const SuccessDark = ({ message, onClose }) => {
  if (!message) return null

  return (
    <div
      className="bg-green-900/30 border border-green-700 text-green-300 px-4 py-3 rounded shadow-md mb-4"
      role="alert"
    >
      <div className="flex items-center">
        <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
        <span className="flex-1">{message}</span>
        <button
          type="button"
          className="text-green-400 hover:text-green-300 focus:outline-none transition-colors"
          aria-label="Close"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

SuccessDark.propTypes = {
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired,
}

export default SuccessDark