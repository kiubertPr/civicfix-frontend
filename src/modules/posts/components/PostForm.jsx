import { Check, Download, Eye, FileText, Shield, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import backend from "../../../backend"
import { Home } from "../../app"
import { BackLink, ErrorDisplay, MapLocation } from "../../common"
import * as selectors from "../../users/selectors"
import * as actions from "../actions"

const PostForm = ({ mode = "create", initialData = {}, onSuccess }) => {
  const [files, setFiles] = useState([])
  const [postSelect, setPostSelect] = useState([])
  const [previews, setPreviews] = useState([])
  const [existingFiles, setExistingFiles] = useState([...(initialData.files || []), ...(initialData.images || [])])
  const [selectedLocation, setSelectedLocation] = useState(
    initialData.latitude && initialData.longitude
      ? {
          lat: initialData.latitude,
          lng: initialData.longitude,
          address: initialData.location,
        }
      : null,
  )
  const [backendErrors, setBackendErrors] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const user = useSelector(selectors.getUser)
  const navigate = useNavigate()
  const isEditMode = mode === "edit"
  const isAdmin = user?.role === "ADMIN" || user?.roles?.includes("ADMIN")

  const [relatedPosts, setRelatedPosts] = useState(initialData.relatedPostsIds || [])
  const [oldRelatedPosts, setOldRelatedPosts] = useState(initialData.oldRelatedPosts || [])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData.title || "",
      content: initialData.content || "",
      relatedPosts: initialData.relatedPostsIds || [],
    },
  })

  useEffect(() => {
    setValue("relatedPosts", relatedPosts)
  }, [relatedPosts, setValue])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const getFileType = (file) => {
    if (file.type.startsWith("image/")) return "image"
    if (file.type === "application/pdf") return "pdf"
    return "other"
  }

  const getFileNameFromUrl = (url) => {
    try {
      const pathParts = url.split("/")
      const fileName = pathParts[pathParts.length - 1]
      return decodeURIComponent(fileName.split("?")[0])
    } catch (e) {
      return "Documento"
    }
  }

  const createFilePreview = (file) => {
    const fileType = getFileType(file)
    if (fileType === "image") {
      return {
        type: "image",
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      }
    } else if (fileType === "pdf" && isAdmin) {
      return {
        type: "pdf",
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      }
    }
    return null
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files)
      const validFiles = fileArray.filter((file) => {
        const fileType = getFileType(file)
        if (fileType === "image") {
          return true
        } else if (fileType === "pdf") {
          return isAdmin
        }
        return false
      })
      const rejectedFiles = fileArray.length - validFiles.length
      if (rejectedFiles > 0) {
        if (!isAdmin) {
          alert(`${rejectedFiles} archivo(s) PDF rechazado(s). Solo los administradores pueden subir documentos PDF.`)
        } else {
          alert(`${rejectedFiles} archivo(s) rechazado(s). Solo se permiten imágenes y archivos PDF.`)
        }
      }
      setFiles((prevFiles) => [...prevFiles, ...validFiles])
      const newPreviews = validFiles.map(createFilePreview).filter(Boolean)
      setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews])
    }
  }

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        if (preview.url) {
          URL.revokeObjectURL(preview.url)
        }
      })
    }
  }, [previews])

  useEffect(() => {
    if (isAdmin) {
      backend.postService.getPostSelect((result) => {
        setPostSelect(result)
      })
    }
  }, [isAdmin])

  const handleLocationSelected = (location) => {
    if (!isLoading) {
      setSelectedLocation(location)
    }
  }

  const handleRemoveExistingFile = (index) => {
    setExistingFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveNewFile = (index) => {
    if (previews[index]?.url) {
      URL.revokeObjectURL(previews[index].url)
    }
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index))
  }

  const handlePreviewPdf = (url) => {
    window.open(url, "_blank")
  }

  const handleRelatedPostChange = (postId, checked) => {
    if (checked) {
      setRelatedPosts((prev) => [...prev, postId])
    } else {
      setRelatedPosts((prev) => prev.filter((id) => id !== postId))
    }

    if (oldRelatedPosts.some((op) => op.id === postId)) {
      setOldRelatedPosts((prev) => prev.filter((op) => op.id !== postId))
    }
  }

  const onSubmit = async (data) => {
    setBackendErrors(null)
    setIsLoading(true)
    if (!selectedLocation) {
      setBackendErrors({ location: ["Debes seleccionar una ubicación en el mapa"] })
      setIsLoading(false)
      return
    }
    try {
      const formData = new FormData()
      const postRequestDto = {
        title: data.title,
        content: data.content,
        location: selectedLocation.address,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        ...(isEditMode && { existingFiles: existingFiles }),
        ...(isAdmin && { relatedPostIds: relatedPosts }),
      }
      formData.append("postData", JSON.stringify(postRequestDto))
      if (files.length > 0) {
        files.forEach((file) => {
          formData.append(`files`, file)
        })
      }
      if (isEditMode) {
        dispatch(
          actions.updatePost(
            initialData.id,
            formData,
            () => {
              setIsLoading(false)
              onSuccess ? onSuccess() : navigate(`/`)
            },
            (errors) => {
              setBackendErrors(errors)
              setIsLoading(false)
            },
          ),
        )
      } else {
        dispatch(
          actions.addPost(
            formData,
            () => {
              onSuccess ? onSuccess() : navigate("/")
              setIsLoading(false)
            },
            (errors) => {
              setBackendErrors(errors)
              setIsLoading(false)
            },
          ),
        )
      }
    } catch (error) {
      setIsLoading(false)
      setBackendErrors({ upload: [error.message] })
    }
  }

  const getAcceptedFileTypes = () => {
    return isAdmin ? "image/*,.pdf" : "image/*"
  }

  const getFileHelpText = () => {
    if (isAdmin) {
      return "Puedes seleccionar múltiples archivos (imágenes: JPG, PNG, GIF | Documentos: PDF)"
    }
    return "Puedes seleccionar múltiples imágenes (JPG, PNG, GIF)"
  }

  const OldRelatedPostsSection = () => (
      <>
        {oldRelatedPosts.length > 0 && oldRelatedPosts.map((op) => (
          <span
            key={op.id}
            className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-semibold text-white"
          >
            <span>{op.title}</span>
            <button
              type="button"
              onClick={() => handleRelatedPostChange(op.id, false)}
              disabled={isLoading}
              className="ml-1 text-white hover:text-amber-100 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </>
    );

  return (
    <Home>
      <div className="lg:w-3/5 max-w-5xl w-full lg:mt-0 mt-15 mx-auto px-4 py-6 overflow-y-auto scroll-auto scroll no-scrollbar">
        <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden p-5">
          <BackLink />
          <div className="border-b border-gray-700 lg:p-6 pb-4 pt-4">
            <h2 className="text-2xl font-bold text-white">{isEditMode ? "Editar Post" : "Crear Nuevo Post"}</h2>
            <p className="text-gray-400 mt-1">
              {isEditMode ? "Modifica la información de tu publicación" : "Comparte lo que has visto con la comunidad"}
            </p>
            {isAdmin && (
              <div className="mt-2 flex items-center text-amber-400 text-sm">
                <Shield className="h-4 w-4 mr-1" />
                Modo Administrador: Puedes subir documentos PDF
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="pt-4 lg:p-6 space-y-6">
            {backendErrors && (
              <ErrorDisplay backendErrors={backendErrors} handleCancelClick={() => setBackendErrors(null)} />
            )}
            {/* Título */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                Título
              </label>
              <input
                id="title"
                disabled={isLoading}
                {...register("title", { required: "El título es obligatorio" })}
                className="bg-gray-700 text-white rounded-lg p-3 w-full border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition"
                placeholder="Título de tu post"
              />
              {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
            </div>
            {/* Contenido */}
            <div className="space-y-2">
              <label htmlFor="content" className="block text-sm font-medium text-gray-300">
                Contenido
              </label>
              <textarea
                id="content"
                disabled={isLoading}
                {...register("content", { required: "El contenido es obligatorio" })}
                className="bg-gray-700 text-white rounded-lg p-3 w-full min-h-[120px] border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition"
                placeholder="Cuenta lo que has visto..."
              />
              {errors.content && <span className="text-red-500 text-sm">{errors.content.message}</span>}
            </div>

            {isAdmin && (
              <div className="space-y-2">
                <label htmlFor="relatedPosts" className="block text-sm font-medium text-gray-300">
                  Posts Relacionados
                </label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full justify-between bg-gray-700 text-white hover:bg-gray-600 focus:ring-amber-500 focus:border-amber-500 border border-gray-700 rounded-lg py-3 px-4 flex items-center"
                    disabled={isLoading}
                  >
                    <span>
                      {relatedPosts.length > 0 ? `${relatedPosts.length} post(s) seleccionado(s)` : "Seleccionar posts"}
                    </span>
                    <Download className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 max-h-60 overflow-y-auto">
                      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {postSelect.length === 0 && (
                          <div className="block px-4 py-2 text-sm text-gray-400" role="menuitem">
                            No hay posts disponibles
                          </div>
                        )}
                        {postSelect.map((post) => (
                          <div
                            key={post.id}
                            className="relative flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700 cursor-pointer"
                            onClick={() => handleRelatedPostChange(post.id, !relatedPosts.includes(post.id))}
                            role="menuitemcheckbox"
                            aria-checked={relatedPosts.includes(post.id)}
                          >
                            <span
                              className={`absolute right-4 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 ${
                                relatedPosts.includes(post.id) ? "opacity-100" : "opacity-0"
                              }`}
                            >
                              <Check className="h-3 w-3 text-white" />
                            </span>
                            #{post.id} - {post.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Display selected posts with remove option */}
                {(relatedPosts.length > 0 || oldRelatedPosts.length > 0) && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <OldRelatedPostsSection />
                    {relatedPosts.map((postId) => {
                      const post = postSelect.find((p) => p.id === postId)
                      return (
                        post && (
                          <span
                            key={postId}
                            className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-semibold text-white"
                          >
                            <span>{post.title}</span>
                            <button
                              type="button"
                              onClick={() => handleRelatedPostChange(postId, false)}
                              disabled={isLoading}
                              className="ml-1 text-white hover:text-amber-100 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        )
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Mapa para seleccionar ubicación */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Ubicación <span className="text-red-400">*</span>
              </label>
              <div className="rounded-lg overflow-hidden border border-gray-700 h-[300px]">
                <MapLocation onLocationSelected={handleLocationSelected} initialLocation={selectedLocation} />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Haz clic en el mapa para seleccionar una ubicación o usa la barra de búsqueda del mapa
              </p>
            </div>
            {/* Mostrar ubicación seleccionada */}
            {selectedLocation ? (
              <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Ubicación seleccionada:</h4>
                    <p className="text-white text-sm">{selectedLocation.address}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Coordenadas: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setSelectedLocation(null)}
                    className="ml-3 text-red-400 hover:text-red-300 transition-colors text-sm underline"
                  >
                    Cambiar ubicación
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400">⚠️</span>
                  <p className="text-amber-200 text-sm">
                    Debes seleccionar una ubicación en el mapa antes de continuar
                  </p>
                </div>
              </div>
            )}
            {/* Archivos existentes (solo en modo edición) */}
            {isEditMode && existingFiles.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-300">Archivos actuales ({existingFiles.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {existingFiles.map((file, index) => (
                    <div
                      key={`existing-${index}`}
                      className="relative rounded-lg overflow-hidden border border-gray-700 shadow-md group bg-gray-700"
                    >
                      {file.endsWith("jpg") || file.endsWith("jpeg") || file.endsWith("png") ? (
                        <div className="aspect-video">
                          <img
                            src={file || "/placeholder.svg"}
                            alt={`Archivo existente ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="p-4 flex items-center space-x-3 min-h-25">
                          <FileText className="h-8 w-8 text-red-400" />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{getFileNameFromUrl(file)}</p>
                            {file.endsWith("pdf") && (
                              <div className="flex items-center mt-1">
                                <Shield className="h-3 w-3 text-amber-400 mr-1" />
                                <span className="text-amber-400 text-xs">Documento oficial</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <button
                        type="button"
                        disabled={isLoading}
                        title="Eliminar archivo"
                        onClick={() => handleRemoveExistingFile(index)}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {file.endsWith("pdf") && (
                        <button
                          type="button"
                          title="Abrir"
                          disabled={isLoading}
                          onClick={() => handlePreviewPdf(file)}
                          className="absolute top-10 right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1.5">
                        {getFileNameFromUrl(file) || file}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Subida de archivos */}
            <div className="space-y-2">
              <label htmlFor="files" className="block text-sm font-medium text-gray-300">
                {isEditMode ? "Agregar nuevos archivos" : "Archivos"}
                <span className="text-gray-400 text-xs ml-2">{isAdmin ? "(Imágenes y PDFs)" : "(Solo imágenes)"}</span>
              </label>
              <div className="relative">
                <input
                  id="files"
                  type="file"
                  disabled={isLoading}
                  multiple
                  accept={getAcceptedFileTypes()}
                  className="bg-gray-700 text-white rounded-lg p-3 w-full border border-gray-700
                                file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                                file:text-sm file:font-medium file:bg-amber-500 file:text-white
                                hover:file:bg-amber-600 file:cursor-pointer
                                focus:outline-none"
                  onChange={handleFileChange}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{getFileHelpText()}</p>
            </div>
            {/* Vista previa de nuevos archivos */}
            {previews.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-300">Nuevos archivos seleccionados ({files.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {previews.map((preview, index) => (
                    <div
                      key={`new-${index}`}
                      className="relative rounded-lg overflow-hidden border border-gray-700 shadow-md group bg-gray-700"
                    >
                      {preview.type === "image" ? (
                        <div className="aspect-video">
                          <img
                            src={preview.url || "/placeholder.svg"}
                            alt={`Vista previa ${index + 1}`}
                            className="w-full h-full object-cover group-hover:opacity-75 transition"
                          />
                        </div>
                      ) : (
                        <div className="p-4 flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-red-400" />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{preview.name}</p>
                            <div className="flex items-center mt-1">
                              <Shield className="h-3 w-3 text-amber-400 mr-1" />
                              <span className="text-amber-400 text-xs">Documento oficial</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() => handlePreviewPdf(preview.url)}
                              className="text-blue-400 hover:text-blue-300"
                              title="Ver PDF"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleRemoveNewFile(index)}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1.5 truncate">
                        {preview.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={!selectedLocation || isLoading}
              className={`w-full font-medium rounded-lg py-3 px-4 transition-colors
                                focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800
                                flex items-center justify-center ${
                                  selectedLocation
                                    ? "bg-amber-500 hover:bg-amber-600 text-white"
                                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                                }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : isEditMode ? (
                "Actualizar Post"
              ) : (
                "Crear Post"
              )}
            </button>
          </form>
        </div>
      </div>
    </Home>
  )
}
export default PostForm
