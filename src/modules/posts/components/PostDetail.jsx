import { useState, useRef, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import * as selectors from "../selectors"
import * as userSelectors from "../../users/selectors"
import * as actions from "../actions"
import { useNavigate } from "react-router-dom"

import {
  MapPin,
  CalendarDays,
  Images,
  User,
  MoreVertical,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  FileText,
  Download,
  Eye,
  Shield,
} from "lucide-react"

import { Home } from "../../app"
import { BackLink, formatRelativeTime, MultiMarkersMap, ImageViewer, ErrorDisplay } from "../../common"

const PostDetail = () => {
  const post = useSelector(selectors.getPostDetail)
  const user = useSelector(userSelectors.getUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [viewerOpen, setViewerOpen] = useState(false)
  const [initialImageIndex, setInitialImageIndex] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [backendErrors, setBackendErrors] = useState(null)

  const menuRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen])

  if (!post) navigate("/home")

  const marker = [
    {
      id: post.id,
      lat: post.latitude,
      lng: post.longitude,
      title: post.title,
      location: post.location,
    },
  ]

  const handleImageClick = (index) => {
    setInitialImageIndex(index)
    setViewerOpen(true)
  }

  const handleCloseViewer = () => {
    setViewerOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleMenuAction = (action) => {
    setIsMenuOpen(false)

    switch (action) {
      case "edit":
        navigate(`/posts/${post.id}/edit/`)
        break
      case "delete":
        dispatch(
          actions.deletePost(
            post.id,
            () => navigate("/"),
            (error) => setBackendErrors(error),
          ),
        )
        break
      default:
        break
    }
  }

  const handleVote = (voteValue) => {
    if (isVoting) return

    setIsVoting(true)

    if (post.userVote === voteValue) {
      dispatch(
        actions.deleteVote(post.id, () => {
          setIsVoting(false)
        }),
      )
    } else {
      dispatch(
        actions.votePost(
          post.id,
          voteValue,
          () => {
            setIsVoting(false)
          },
          (error) => {
            console.error("Error al votar:", error)
            setIsVoting(false)
          },
        ),
      )
    }
  }

  const handleRelatedPostClick = (relatedPostId) => {
    dispatch(actions.getPost(relatedPostId, () => navigate('/posts/postDetail')));
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

  const isAuthor = user && post.author && user.id === post.author.id
  const isAdmin = user && user.role && user.role === "ADMIN"

  const pdfFiles = post.files ? post.files : []
  const hasPdfFiles = post.category === "ADMINISTRATION" && pdfFiles.length > 0

  const canVote = user && post.author && user.id !== post.author.id

  return (
    <Home>
      <div className="lg:w-3/5 w-full max-w-5xl lg:mt-0 mt-15 mx-auto px-4 py-6 overflow-y-auto scroll-auto scroll no-scrollbar">
        {backendErrors && (
          <ErrorDisplay backendErrors={backendErrors} handleCancelClick={() => setBackendErrors(null)} />
        )}
        <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex justify-between mt-4 ml-4 align-baseline">
            <BackLink size={20} />
            {user && (isAdmin || isAuthor) && !post.solved && (
              <div className="relative">
                <button
                  ref={buttonRef}
                  className="p-2 rounded-full hover:bg-gray-700 transition-colors mr-4 focus:outline-none"
                  onClick={toggleMenu}
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen}
                >
                  <MoreVertical size={20} />
                </button>

                {isMenuOpen && (
                  <div
                    ref={menuRef}
                    className="absolute top-full right-0 w-48 rounded-lg mt-1 shadow-lg z-10 bg-gray-900 border border-gray-700 overflow-hidden"
                    style={{
                      animation: "scaleIn 0.15s ease-in-out forwards",
                    }}
                  >
                    <div className="py-1">
                      {(isAuthor || isAdmin) && (
                        <>
                          <button
                            className="w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-gray-800 flex items-center gap-2"
                            onClick={() => handleMenuAction("edit")}
                          >
                            <Edit size={16} />
                            <span>Editar publicación</span>
                          </button>

                          <button
                            className="w-full px-4 py-2 text-sm text-left text-red-400 hover:bg-gray-800 flex items-center gap-2"
                            onClick={() => handleMenuAction("delete")}
                          >
                            <Trash2 size={16} />
                            <span>Eliminar publicación</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium text-white mb-2">{post.title}</h3>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  post.category === "ADMINISTRATION" ? "bg-red-900 text-white" : "bg-amber-600 text-white"
                }`}
              >
                {post.category === "ADMINISTRATION" ? "Administración" : "Usuario"}
              </span>
            </div>

            <div className="text-sm text-gray-400 mt-1 flex items-center gap-2 mb-1">
              <MapPin size={20} />
              {post.location}
            </div>

            <div className="text-sm text-gray-400 mt-1 flex items-center gap-2 mb">
              <CalendarDays size={20} />
              {formatRelativeTime(post.date)}
            </div>

            <div className="mt-3 text-gray-300 text-justify">{post.content}</div>

            <div className="mt-3 rounded-lg overflow-hidden border border-gray-700 h-[20rem]">
              <MultiMarkersMap markers={marker} markerColor="#f59e0b" fitBounds={true} searchEnabled={false} />
            </div>

            {/* Sección de documentos PDF para publicaciones de administración */}
            {hasPdfFiles && (
              <div className="mt-4 bg-amber-900/20 border border-amber-600/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-5 w-5 text-amber-500" />
                  <h4 className="text-amber-400 font-medium">Documentos oficiales ({pdfFiles.length})</h4>
                </div>
                <div className="space-y-2">
                  {pdfFiles.map((fileUrl, index) => (
                    <div key={`pdf-${index}`} className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-6 w-6 text-red-400 mr-3" />
                        <div>
                          <p className="text-white text-sm font-medium">
                            {getFileNameFromUrl(fileUrl) || `Documento ${index + 1}`}
                          </p>
                          <p className="text-xs text-gray-400">Documento PDF</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(fileUrl, "_blank")}
                          className="p-1.5 rounded-full bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
                          title="Ver documento"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <a
                          href={fileUrl}
                          download={getFileNameFromUrl(fileUrl) || `documento-${index + 1}.pdf`}
                          className="p-1.5 rounded-full bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors"
                          title="Descargar documento"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {post.images && post.images.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-1 mb-2 text-sm text-gray-400">
                  <Images size={20} />
                  <span>
                    {post.images.length} {post.images.length === 1 ? "imagen" : "imágenes"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {post.images.slice(0, 4).map((img, index) => (
                    <div
                      key={index}
                      className="relative rounded-md overflow-hidden cursor-pointer group"
                      onClick={() => handleImageClick(index)}
                    >
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Imagen ${index + 1} de ${post.title}`}
                        className="w-full h-auto object-cover max-h-[150px] transition-transform duration-200 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Ver imagen</span>
                      </div>
                    </div>
                  ))}
                </div>
                {post.images.length > 4 && (
                  <button
                    className="mt-2 text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
                    onClick={() => handleImageClick(4)}
                  >
                    Ver {post.images.length - 4} imágenes más
                  </button>
                )}
              </div>
            )}

            {/* Sección de posts relacionados */}
            {post.relatedPosts && post.relatedPosts.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-1 mb-2 text-sm text-gray-400">
                  <FileText size={20} /> {/* Using FileText as a generic document/link icon */}
                  <span>Posts relacionados ({post.relatedPosts.length})</span>
                </div>
                <div className="space-y-2  overflow-y-auto scroll-auto scroll no-scrollbar">
                  {post.relatedPosts.map((relatedPost) => (
                    <div
                      key={relatedPost.id}
                      onClick={() => handleRelatedPostClick(relatedPost.id)}
                      className="bg-gray-700 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center">
                        <FileText className="h-6 w-6 text-gray-400 mr-3" />
                        <div>
                          <p className="text-white text-sm font-medium">{relatedPost.title}</p>
                          <p className="text-xs text-gray-400">Ver publicación</p>
                        </div>
                      </div>
                      <ChevronUp size={16} className="rotate-90 text-gray-400" /> {/* Right arrow icon */}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-700 px-4 py-3 flex items-center justify-between mt-6">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-600 mr-2 overflow-hidden">
                  <img
                    src={post.author.avatar || "/placeholder.svg"}
                    alt={post.author.username}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <User size={20} />
                  {post.author.username}
                </div>
              </div>

              {/* Sistema de votación */}
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-gray-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleVote(1)}
                    disabled={isVoting}
                    hidden={!canVote || post.solved}
                    className={`p-2 transition-colors ${
                      post.userVote === 1 ? "bg-green-600 text-white" : "hover:bg-gray-600 text-gray-300"
                    } ${isVoting ? "opacity-50 cursor-not-allowed" : ""}`}
                    title="Votar positivo"
                  >
                    <ChevronUp size={18} />
                  </button>

                  <div className={`px-3 py-2 ${post.votes >= 0 ? "text-green-400" : "text-red-400" } font-medium min-w-[2.5rem] text-center text-sm`}>
                    {post.votes}
                  </div>

                  <button
                    onClick={() => handleVote(-1)}
                    disabled={isVoting}
                    hidden={!canVote ||post.solved}
                    className={`p-2 transition-colors ${
                      post.userVote === -1 ? "bg-red-600 text-white" : "hover:bg-gray-600 text-gray-300"
                    } ${isVoting ? "opacity-50 cursor-not-allowed" : ""}`}
                    title="Votar negativo"
                  >
                    <ChevronDown size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {viewerOpen && <ImageViewer images={post.images} initialIndex={initialImageIndex} onClose={handleCloseViewer} />}

      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </Home>
  )
}

export default PostDetail
