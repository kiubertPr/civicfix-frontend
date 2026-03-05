import { useState } from "react"
import {
  CircleUserIcon,
  UserRoundIcon as UserRoundPenIcon,
  DoorClosedIcon,
  SquarePlus,
  CircleHelpIcon,
  Settings2,
  ClipboardPlus,
  UsersRound,
  Menu,
  X,
  ShoppingCart,
} from "lucide-react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import * as selectors from "../../users/selectors"

const SideHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const user = useSelector(selectors.getUser)
  const isAdmin = user && user.role && user.role === "ADMIN"

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const NavigationContent = () => (
    <>
      {user && (
        <>
          <nav className="flex flex-col gap-4 w-full px-auto">
            <Link
              to="/profile"
              className="grid grid-cols-[2rem_auto] gap-4 p-3 w-full hover:bg-gray-800 rounded-xl transition"
              onClick={closeMobileMenu}
            >
              <CircleUserIcon size={24} />
              <span className="text-lg text-white truncate overflow-hidden whitespace-nowrap">{user.username}</span>
            </Link>

            <Link
              to="/points/redeem"
              className="grid grid-cols-[2rem_auto] gap-4 p-3 w-full hover:bg-gray-800 rounded-xl transition"
              onClick={closeMobileMenu}
            >
              <ShoppingCart size={24} />
              <span className="text-lg text-white">Canjaer puntos</span>
            </Link>

            <Link
              to="/posts/create"
              className="grid grid-cols-[2rem_auto] gap-4 p-3 w-full hover:bg-gray-800 rounded-xl transition"
              onClick={closeMobileMenu}
            >
              <SquarePlus size={24} />
              <span className="text-lg text-white">Crear post</span>
            </Link>

            {isAdmin && (
              <>
                <Link
                  to="/surveys/create"
                  className="grid grid-cols-[2rem_auto] gap-4 p-3 w-full hover:bg-gray-800 rounded-xl transition"
                  onClick={closeMobileMenu}
                >
                  <ClipboardPlus size={24} />
                  <span className="text-lg text-white">Crear encuesta</span>
                </Link>
                <Link
                  to="/users/list"
                  className="grid grid-cols-[2rem_auto] gap-4 p-3 w-full hover:bg-gray-800 rounded-xl transition"
                  onClick={closeMobileMenu}
                >
                  <UsersRound size={24} />
                  <span className="text-lg text-white">Gestionar usuarios</span>
                </Link>
              </>
            )}

            <Link
              to="/logout"
              className="grid grid-cols-[2rem_auto] gap-4 p-3 w-full hover:bg-gray-800 rounded-xl transition"
              onClick={closeMobileMenu}
            >
              <DoorClosedIcon size={24} />
              <span className="text-lg">Logout</span>
            </Link>
          </nav>
        </>
      )}

      {!user && (
        <>
          <nav className="flex flex-col gap-4 w-full px-auto">
              <Link
                to="/login"
                className="grid grid-cols-[2rem_auto] justify-center gap-4 p-3 w-full hover:bg-gray-800 rounded-xl transition"
                onClick={closeMobileMenu}
              >
                <CircleUserIcon size={24} />
                <span className="text-lg">Login</span>
              </Link>
            
              <Link
                to="/signup"
                className="grid grid-cols-[2rem_auto] justify-center gap-4 p-3 w-full hover:bg-gray-800 rounded-xl transition"
                onClick={closeMobileMenu}
              >
                <UserRoundPenIcon size={24} />
                <span className="text-lg">SignUp</span>
              </Link>
          </nav>
        </>
      )}

      <nav className="flex gap-4 w-full px-auto mt-auto justify-between pl-4 pr-4">
        <Link
          to="/contact"
          className="flex justify-center p-3 hover:bg-gray-800 rounded-xl transition"
          onClick={closeMobileMenu}
        >
          <CircleHelpIcon size={24} />
        </Link>
        <Link
          to="/settings"
          className="flex justify-center p-3 hover:bg-gray-800 rounded-xl transition"
          onClick={closeMobileMenu}
        >
          <Settings2 size={24} />
        </Link>
      </nav>
    </>
  )

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gray-900">
        <div className="relative flex items-center justify-between p-4">
          <button
            onClick={toggleMobileMenu}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="w-10" />

          <Link to="/" onClick={closeMobileMenu} className="absolute left-1/2 transform -translate-x-1/2">
            <img src="/logo.png" alt="Logo CivicFix" className="h-15 w-auto object-cover" />
          </Link>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 backdrop-blur-sm bg-black/20 z-40" onClick={closeMobileMenu} />
      )}

      <div
        className={`
        lg:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full p-5 gap-8">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" onClick={closeMobileMenu}>
              <img src="/logo.png" alt="Logo CivicFix" className="h-25 w-auto object-cover" />
            </Link>
            <button
              onClick={closeMobileMenu}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          <NavigationContent />
        </div>
      </div>

      <div className="hidden lg:flex w-1/8 lg:w-1/5 flex-col items-center p-5 border-r border-gray-700 shadow-md h-screen sticky top-0 gap-8">
        <Link to="/" onClick={closeMobileMenu}>
          <img src="/logo.png" alt="Logo CivicFix" className="h-25 w-auto object-cover" />
        </Link>
        <NavigationContent />
      </div>


    </>
  )
}

export default SideHeader