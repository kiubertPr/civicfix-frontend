import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from "lucide-react"

const ImageViewer = ({ images, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [loading, setLoading] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(1)

  useEffect(() => {
    setZoomLevel(1)
    setLoading(true)
  }, [currentIndex])

  const handlePrevious = (e) => {
    e.stopPropagation()
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const handleNext = (e) => {
    e.stopPropagation()
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  const handleZoomIn = (e) => {
    e.stopPropagation()
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.25, 3))
  }

  const handleZoomOut = (e) => {
    e.stopPropagation()
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.25, 0.5))
  }

  const handleDownload = (e) => {
    e.stopPropagation()
    const link = document.createElement("a")
    link.href = images[currentIndex]
    link.download = `imagen-${currentIndex + 1}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleImageLoad = () => {
    setLoading(false)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowLeft":
          handlePrevious(e)
          break
        case "ArrowRight":
          handleNext(e)
          break
        case "Escape":
          onClose()
          break
        case "+":
          handleZoomIn(e)
          break
        case "-":
          handleZoomOut(e)
          break
        default:
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex, onClose])

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col justify-center items-center" onClick={onClose}>
      <div
        className="absolute top-0 left-0 right-0 h-16 bg-gray-900/80 flex items-center justify-between px-4 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            title="Reducir"
          >
            <ZoomOut size={20} />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            title="Ampliar"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            title="Descargar"
          >
            <Download size={20} />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            title="Cerrar"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        )}

        <img
          src={images[currentIndex] || "/placeholder.svg"}
          alt={`Imagen ${currentIndex + 1}`}
          className={`max-h-[calc(100vh-8rem)] max-w-[90vw] object-contain transition-transform duration-200 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
          style={{ transform: `scale(${zoomLevel})` }}
          onLoad={handleImageLoad}
        />

        {images.length > 1 && (
          <>
            <button
              className="absolute left-4 p-3 rounded-full bg-gray-800/70 hover:bg-gray-700 text-white transition-colors"
              onClick={handlePrevious}
              title="Anterior"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute right-4 p-3 rounded-full bg-gray-800/70 hover:bg-gray-700 text-white transition-colors"
              onClick={handleNext}
              title="Siguiente"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div
          className="absolute bottom-0 left-0 right-0 h-20 bg-gray-900/80 flex items-center justify-center gap-2 px-4 overflow-x-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, index) => (
            <div
              key={index}
              className={`h-16 w-16 flex-shrink-0 rounded overflow-hidden border-2 cursor-pointer ${
                index === currentIndex ? "border-amber-500" : "border-transparent"
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <img
                src={img || "/placeholder.svg"}
                alt={`Miniatura ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageViewer
