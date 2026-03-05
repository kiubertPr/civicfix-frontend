import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Users,
  Grid,
  List,
  X,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  User2
} from "lucide-react"

import { ErrorDisplay, BackLink, SuccessDark } from "../../common"
import { Home } from "../../app"
import * as actions from "../actions"
import * as selectors from "../selectors"
import UserCard from "./UserCard"
import UserCardCompact from "./UserCompact"
import { useNavigate } from "react-router-dom"

const UserSection = () => {
  const userList = useSelector(selectors.getUserList)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [backendErrors, setBackendErrors] = useState(null)
  const [size, setSize] = useState(10)
  const [page, setPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("ALL")
  const [viewMode, setViewMode] = useState("grid")
  const [isCompact, setIsCompact] = useState(false)
  const [showFilters, setShowFilters] = useState(true)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showDisableConfirmation, setShowDisableConfirmation] = useState(false)
  const [showAbleConfirmation, setShowAbleConfirmation] = useState(false)
  const [selectedUser, setselectedUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    dispatch(actions.getUsersList(page, size, searchTerm, roleFilter))
  }, [page, size, searchTerm])

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (userList && page < userList.totalPages - 1) {
      setPage(page + 1)
    }
  }

  const handleFirstPage = () => {
    setPage(0)
  }

  const handleLastPage = () => {
    if (userList) {
      setPage(userList.totalPages - 1)
    }
  }

  const handlePageSizeChange = (newSize) => {
    setSize(newSize)
    setPage(0)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    setPage(0)
  }

  const handleRoleFilter = (role) => {
    setRoleFilter(role)
    setPage(0)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setRoleFilter("ALL")
    setPage(0)
  }

  const handleDeleteUser = (user) => {
    setselectedUser(user)
    setShowConfirmation(true)
  }

  const handleDisableUser = (user) => {
    setselectedUser(user)
    setShowDisableConfirmation(true)
  }

  const handleAbleUser = (user) => {
    setselectedUser(user)
    setShowAbleConfirmation(true)
  }

  const cancelAbleUser = () => {
    setShowAbleConfirmation(false)
    setselectedUser(null)
    setIsLoading(false)
  }

  const cancelDisableUser = () => {
    setShowDisableConfirmation(false)
    setselectedUser(null)
    setIsLoading(false)
  }

  const cancelDeleteUser = () => {
    setShowConfirmation(false)
    setselectedUser(null)
    setIsLoading(false)
  }

  const confirmDeleteUser = () => {
    if (!selectedUser) return
    setIsLoading(true)
    dispatch(
      actions.deleteUser(
        selectedUser.id, 
        () => {
        setShowConfirmation(false)
        setselectedUser(null)
        setIsLoading(false)
        setIsSuccess(true)        
      }, 
      (error) => {
        setBackendErrors(error)
        setIsLoading(false)
      })
    )
  }

  const confirmDisableUser = () => {
    if (!selectedUser) return
    setIsLoading(true)
    dispatch(
      actions.disableUser(
        selectedUser.id, 
        () => {
        setShowDisableConfirmation(false)
        setselectedUser(null)
        setIsLoading(false)
        setIsSuccess(true)        
      }, 
      (error) => {
        setBackendErrors(error)
        setIsLoading(false)
      })
    )
  }

  const filteredUsers =
    userList?.content?.filter((user) => {
      const matchesSearch =
        !searchTerm ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRole = roleFilter === "ALL" || user.role === roleFilter

      return matchesSearch && matchesRole
    }) || []

  const hasActiveFilters = searchTerm || roleFilter !== "ALL"

  const getPageNumbers = () => {
    const totalPages = userList?.totalPages || 0
    const currentPage = page
    const delta = 2 

    const pages = []

    if (totalPages > 0) pages.push(0)

    const start = Math.max(1, currentPage - delta)
    const end = Math.min(totalPages - 2, currentPage + delta)

    if (start > 1) pages.push("...")

    for (let i = start; i <= end; i++) {
      if (i > 0 && i < totalPages - 1) {
        pages.push(i)
      }
    }

    if (end < totalPages - 2) pages.push("...")

    if (totalPages > 1) pages.push(totalPages - 1)

    return pages
  }

  return (
    <Home>
      <div className="mt-15 lg:mt-0 min-w-3/5 relative w-full h-screen flex flex-col">
        {/* Header fijo con sombra */}
        <div className="sticky top-0 z-20 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 shadow-xl">
          <div className="block mt-4 ml-4">
            <BackLink size={20}/>
          </div>
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Título principal */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Users className="h-7 w-7 text-amber-500" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Usuarios</h1>
                  {userList?.totalElements && (
                    <p className="text-sm text-gray-400">
                      {filteredUsers.length} de {userList.totalElements} usuarios
                      {hasActiveFilters && " (filtrados)"}
                    </p>
                  )}
                </div>
              </div>

              {/* Botón para mostrar/ocultar filtros */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className=" p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
              >
                <Filter className="h-5 w-5" />
              </button>
            </div>

            {/* Panel de filtros colapsible */}
            <div className={`overflow-hidden transition-all duration-300 ${showFilters ? "max-h-96 pb-4" : "max-h-0"}`}>
              <div className="space-y-4">
                {/* Barra de búsqueda */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, usuario o email..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => handleSearch("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Filtros y controles */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Filtro por rol */}
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-400" />
                      <select
                        value={roleFilter}
                        onChange={(e) => handleRoleFilter(e.target.value)}
                        className="bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-amber-500 focus:outline-none min-w-[140px]"
                      >
                        <option value="ALL">Todos los roles</option>
                        <option value="ADMIN">Administradores</option>
                        <option value="USER">Usuarios</option>
                        <option value="DISABLED">Deshabilitados</option>
                      </select>
                    </div>

                    {/* Botón limpiar filtros */}
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="px-3 py-2 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-1"
                      >
                        <X className="h-3 w-3" />
                        Limpiar
                      </button>
                    )}
                  </div>

                  {/* Controles de vista */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "grid" ? "bg-amber-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                      title="Vista en cuadrícula"
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "list" ? "bg-amber-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                      title="Vista en lista"
                    >
                      <List className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setIsCompact(!isCompact)}
                      className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                        isCompact ? "bg-amber-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      Compacto
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal scrolleable */}
        <div className="flex-1 overflow-y-auto scroll-auto scroll no-scrollbar">
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32">
            {/* Errores */}
            {backendErrors && (
              <div className="mb-6">
                <ErrorDisplay backendErrors={backendErrors} handleCancelClick={() => setBackendErrors(null)} />
              </div>
            )}
            {isSuccess && (
              <div className="mb-6">
                <SuccessDark message={"Operación realizada correctamente"}  onClose={() => setIsSuccess(false)} />
              </div>
            )}

            {/* Lista de usuarios */}
            {filteredUsers.length === 0 ? (
              <div className="text-gray-400 text-center py-16">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-xl mb-2">
                  {hasActiveFilters ? "No se encontraron usuarios" : "No hay usuarios en la aplicación"}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {hasActiveFilters
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Los usuarios aparecerán aquí cuando se registren"}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            ) : (
              <div
                className={`
                ${
                  viewMode === "grid"
                    ? `grid gap-4 ${
                        isCompact
                          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                          : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
                      }`
                    : "space-y-4"
                }
              `}
              >
                {filteredUsers.map((user) =>
                  isCompact ? <UserCardCompact key={user.id} user={user} /> : <UserCard key={user.id} user={user} onDelete={handleDeleteUser} onDisable={handleDisableUser} />,
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal de confirmación */}
        {showConfirmation && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-white mb-4">Confirmar borrado</h3>

              <div className="bg-gray-700 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <User2 className="h-6 w-6 text-amber-500" />
                  <span className="text-amber-500 font-semibold">{selectedUser.username}</span>
                </div>
                <p className="text-gray-300 text-sm mb-3">Estás seguro de que deseas eliminar a este usuario?</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cancelDeleteUser}
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteUser}
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Eliminando usuario...
                    </>
                  ) : (
                    "Confirmar borrado"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {showDisableConfirmation && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-white mb-4">Confirmar deshabilitación</h3>

              <div className="bg-gray-700 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <User2 className="h-6 w-6 text-amber-500" />
                  <span className="text-amber-500 font-semibold">{selectedUser.username}</span>
                </div>
                <p className="text-gray-300 text-sm mb-3">Estás seguro de que deseas deshabilitar a este usuario?</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cancelDisableUser}
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDisableUser}
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deshabilitando usuario...
                    </>
                  ) : (
                    "Confirmar deshabilitación"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {showAbleConfirmation && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-white mb-4">Confirmar habilitación</h3>

              <div className="bg-gray-700 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <User2 className="h-6 w-6 text-amber-500" />
                  <span className="text-amber-500 font-semibold">{selectedUser.username}</span>
                </div>
                <p className="text-gray-300 text-sm mb-3">Estás seguro de que deseas habilitar a este usuario?</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cancelAbleUser}
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDisableUser}
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Habilitando usuario...
                    </>
                  ) : (
                    "Confirmar habilitación"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Paginación fija mejorada */}
        {userList && userList.totalPages > 1 && (
          <div className="sticky bottom-0 z-10 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 shadow-2xl">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                {/* Controles de tamaño de página */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Mostrar:</span>
                  <select
                    value={size}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="bg-gray-700 text-white text-sm rounded px-3 py-2 border border-gray-600 focus:border-amber-500 focus:outline-none"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-400">por página</span>
                </div>

                {/* Navegación de páginas */}
                <div className="flex items-center space-x-2">
                  {/* Botón primera página */}
                  <button
                    onClick={handleFirstPage}
                    disabled={page === 0}
                    className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    title="Primera página"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </button>

                  {/* Botón página anterior */}
                  <button
                    onClick={handlePreviousPage}
                    disabled={page === 0}
                    className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    title="Página anterior"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {/* Números de página */}
                  <div className="hidden sm:flex items-center space-x-1">
                    {getPageNumbers().map((pageNum, index) => (
                      <button
                        key={index}
                        onClick={() => typeof pageNum === "number" && setPage(pageNum)}
                        disabled={pageNum === "..."}
                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                          pageNum === page
                            ? "bg-amber-500 text-white"
                            : pageNum === "..."
                              ? "text-gray-400 cursor-default"
                              : "bg-gray-700 hover:bg-gray-600 text-white"
                        }`}
                      >
                        {typeof pageNum === "number" ? pageNum + 1 : pageNum}
                      </button>
                    ))}
                  </div>

                  {/* Botón página siguiente */}
                  <button
                    onClick={handleNextPage}
                    disabled={page >= userList.totalPages - 1}
                    className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    title="Página siguiente"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  {/* Botón última página */}
                  <button
                    onClick={handleLastPage}
                    disabled={page >= userList.totalPages - 1}
                    className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    title="Última página"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Información de página */}
                <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-400">
                  <span>
                    Página {page + 1} de {userList.totalPages}
                  </span>
                  <span className="text-xs">
                    {filteredUsers.length} de {userList.totalElements} usuarios
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Home>
  )
}

export default UserSection