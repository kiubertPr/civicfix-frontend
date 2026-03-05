import PropTypes from "prop-types"
import { CheckCircle, X } from "lucide-react"

const Success = ({ message, onClose }) => {
  if (!message) return null

  return (
    <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded relative mb-4" role="alert">
      <div className="flex items-center">
        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
        <span className="flex-1">{message}</span>
        <button
          type="button"
          className="text-green-500 hover:text-green-700 focus:outline-none"
          aria-label="Close"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

Success.propTypes = {
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired,
}

export default Success
