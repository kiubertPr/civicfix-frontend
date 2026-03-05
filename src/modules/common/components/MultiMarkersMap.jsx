import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder"
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

/**
 * Componente que muestra múltiples marcadores en un mapa Mapbox
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.markers - Array de objetos con información de los marcadores
 *   Cada objeto debe tener: { lat, lng, title, location}
 * @param {Object} props.defaultCenter - Centro inicial del mapa { lat, lng }
 * @param {Number} props.defaultZoom - Zoom inicial del mapa
 * @param {String} props.markerColor - Color de los marcadores (por defecto: #f59e0b - amber-500)
 * @param {Boolean} props.fitBounds - Si es true, ajusta el mapa para mostrar todos los marcadores
 * @param {Function} props.onMarkerClick - Función que se ejecuta al hacer clic en un marcador
 */
const MultiMarkersMap = ({
  markers = [],
  defaultCenter = { lat: 43.35247, lng: -8.406482 },
  defaultZoom = 12,
  markerColor = "#f59e0b",
  fitBounds = true,
  onMarkerClick = null,
  searchEnabled = true,
}) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markersRef = useRef([])
  const geocoder = useRef(null)

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [defaultCenter.lng, defaultCenter.lat],
      zoom: defaultZoom,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

    if (searchEnabled) {
      geocoder.current = new MapboxGeocoder({
        accessToken: MAPBOX_ACCESS_TOKEN,
        mapboxgl: mapboxgl,
        marker: {
          color: "#ef4444",
        },
        placeholder: "Buscar ubicación...",
        language: "es",
        zoom: 15,
      })

      map.current.addControl(geocoder.current, "top-left")
    }
    
    map.current.on("load", () => {
      if (markers && markers.length > 0) {
        addMarkersToMap()
      }
    })

    return () => {
      if (map.current) {
        if (geocoder.current) {
          map.current.removeControl(geocoder.current)
        }
        map.current.remove()
      }
    }
  }, [])

  useEffect(() => {
    if (map.current && map.current.loaded()) {
      clearMarkers()
      addMarkersToMap()
    }
  }, [markers])

  const clearMarkers = () => {
    if (markersRef.current.length > 0) {
      markersRef.current.forEach((marker) => {
        marker.remove()
      })
      markersRef.current = []
    }
  }

  const addMarkersToMap = () => {
    if (!map.current || !markers || markers.length === 0) return

    const bounds = new mapboxgl.LngLatBounds()

    markers.forEach((markerData) => {
      if (!markerData.lat || !markerData.lng) return

      const el = document.createElement("div")
      el.className = "custom-marker"
      el.style.backgroundColor =
        markerData.category && markerData.category === "ADMINISTRATION" ? "#b40d1b" : markerColor
      el.style.width = "15px"
      el.style.height = "15px"
      el.style.borderRadius = "50%"
      el.style.border = "2px solid white"
      el.style.cursor = "pointer"
      el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)"

      let popup = null
      if (markerData.title || markerData.location) {
        popup = new mapboxgl.Popup({
          offset: 25,
          className: "custom-popup",
          closeButton: false,
          closeOnClick: false,
        }).setHTML(
          `<div>
            ${markerData.title ? `<h3 class="font-bold text-sm">${markerData.title}</h3>` : ""}
            ${markerData.location ? `<p class="text-xs mt-1">${markerData.location}</p>` : ""}
          </div>`,
        )
      }

      const marker = new mapboxgl.Marker({ element: el, color: markerColor })
        .setLngLat([markerData.lng, markerData.lat])
        .addTo(map.current)

      // Evento mouseenter para mostrar popup
      el.addEventListener("mouseenter", () => {
        if (popup) {
          marker.setPopup(popup)
          popup.addTo(map.current)
        }
      })

      // Evento mouseleave para ocultar popup
      el.addEventListener("mouseleave", () => {
        if (popup && popup.isOpen()) {
          popup.remove()
        }
      })

      // Evento click para ejecutar onMarkerClick
      el.addEventListener("click", (e) => {
        e.stopPropagation()
        if (onMarkerClick) {
          onMarkerClick(markerData)
        }
      })

      markersRef.current.push(marker)
      bounds.extend([markerData.lng, markerData.lat])
    })

    if (fitBounds && markers.length > 0 && !bounds.isEmpty()) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
      })
    }
  }

  return (
    <>
      <div ref={mapContainer} className="w-full h-full" />
      <style jsx global>{`
        .custom-popup .mapboxgl-popup-content {
          background-color: #1f2937; /* gray-800 */
          color: white;
          border-radius: 0.5rem;
          padding: 0.75rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .custom-popup .mapboxgl-popup-tip {
          border-top-color: #1f2937; /* Flecha del popup */
          border-bottom-color: #1f2937;
        }
        .custom-popup .mapboxgl-popup-close-button {
          color: white;
          font-size: 16px;
          padding: 0 6px;
        }
      `}</style>
    </>
  )
}

export default MultiMarkersMap