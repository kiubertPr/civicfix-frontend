import { User } from "lucide-react"

const UserCardCompact = ({ user }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-900 text-white"
      case "USER":
        return "bg-amber-600 text-gray-200"
      case "DISABLED":
        return "bg-gray-600 text-gray-200"
      default:
        return "bg-gray-600 text-gray-200"
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 p-3">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="h-10 w-10 rounded-full bg-gray-600 overflow-hidden flex-shrink-0">
          <img
            src={user.avatar || "/placeholder.svg"}
            alt={`Avatar de ${user.username}`}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.src = "/placeholder.svg"
            }}
          />
        </div>

        {/* Info principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-white truncate">{user.username}</h4>
            <span className={`text-xs px-2 py-0.5 rounded ${getRoleColor(user.role)}`}>{user.role}</span>
          </div>
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
        </div>
      </div>
    </div>
  )
}

export default UserCardCompact
