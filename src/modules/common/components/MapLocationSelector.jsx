import { useState, useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder"
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

const MapLocation = ({ onLocationSelected, initialLocation = null, defaultLat = 43.35247, defaultLng = -8.406482 }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const marker = useRef(null)
  const geocoder = useRef(null)

  const initialLat = initialLocation?.lat || defaultLat
  const initialLng = initialLocation?.lng || defaultLng

  const [lng, setLng] = useState(initialLng)
  const [lat, setLat] = useState(initialLat)
  const [zoom, setZoom] = useState(12)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (!mapContainer.current) return

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [initialLng, initialLat],
      zoom: zoom,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

    geocoder.current = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
      placeholder: "Buscar ubicación...",
      language: "es",
    })

    map.current.addControl(geocoder.current, "top-left")

    map.current.on("load", () => {
      setMapLoaded(true)

      marker.current = new mapboxgl.Marker({ color: "#f59e0b" }).setLngLat([initialLng, initialLat]).addTo(map.current)

      if (initialLocation?.address) {
        geocoder.current.setInput(initialLocation.address)
      }
    })

    adjustControlsForMobile()

    geocoder.current.on("result", (e) => {
      const coordinates = e.result.center
      const newLng = coordinates[0]
      const newLat = coordinates[1]

      setLng(newLng)
      setLat(newLat)

      if (marker.current) {
        marker.current.setLngLat(coordinates)
      }

      const address = e.result.place_name

      onLocationSelected({
        lng: newLng,
        lat: newLat,
        address: address,
      })
    })

    map.current.on("click", async (e) => {
      const { lng: clickLng, lat: clickLat } = e.lngLat
      setLng(clickLng)
      setLat(clickLat)

      if (marker.current) {
        marker.current.setLngLat([clickLng, clickLat])
      }

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${clickLng},${clickLat}.json?access_token=${mapboxgl.accessToken}&language=es`,
        )
        const data = await response.json()

        if (data.features && data.features.length > 0) {
          const address = data.features[0].place_name

          if (geocoder.current) {
            geocoder.current.setInput(address)
          }

          onLocationSelected({
            lng: clickLng,
            lat: clickLat,
            address,
          })
        }
      } catch (error) {
        console.error("Error al obtener la dirección:", error)
      }
    })

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  const adjustControlsForMobile = () => {
    const isMobile = window.innerWidth < 1024 

    if (isMobile) {
      const geocoderElement = document.querySelector(".mapboxgl-ctrl-geocoder")
      if (geocoderElement) {
        geocoderElement.style.marginTop = "10px"
        geocoderElement.style.marginLeft = "8px"
        geocoderElement.style.width = "200px"
        geocoderElement.style.maxWidth = "calc(100vw - 80px)"
        geocoderElement.style.padding = "0 15px"
      }

      const geocoderIcon = document.querySelector(".mapboxgl-ctrl-geocoder--icon-search")
      if (geocoderIcon) {
        geocoderIcon.style.width = "16px"
        geocoderIcon.style.height = "16px"
        geocoderIcon.style.top = "8px"
        geocoderIcon.style.left = "4px"
      }

      const navControls = document.querySelector(".mapboxgl-ctrl-top-right")
      if (navControls) {
        navControls.style.marginTop = "30px"
        navControls.style.marginRight = "4px"
        navControls.style.transform = "scale(0.8)" 
      }

      const geocoderInput = document.querySelector(".mapboxgl-ctrl-geocoder input")
      if (geocoderInput) {
        geocoderInput.style.fontSize = "12px"
        geocoderInput.style.padding = "6px 8px"
        geocoderInput.style.height = "32px"
      }
    }
  }
  useEffect(() => {
    if (mapLoaded && map.current && marker.current && initialLocation) {
      const newLng = initialLocation.lng
      const newLat = initialLocation.lat

      setLng(newLng)
      setLat(newLat)

      marker.current.setLngLat([newLng, newLat])

      map.current.flyTo({
        center: [newLng, newLat],
        zoom: 14,
        duration: 1000,
      })

      if (initialLocation.address && geocoder.current) {
        geocoder.current.setInput(initialLocation.address)
      }
    }
  }, [initialLocation, mapLoaded])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="text-white text-sm">Cargando mapa...</div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 1024px) {
          :global(.mapboxgl-ctrl-geocoder) {
            margin-top: 10px !important;
            margin-left: 8px !important;
            width: 200px !important;
            max-width: calc(100vw - 80px) !important;
            transform: scale(0.9) !important;
            transform-origin: top left !important;
          }
          
          :global(.mapboxgl-ctrl-geocoder--icon-search) {
            width: 16px !important;
            height: 16px !important;
            top: 8px !important;
            left: 8px !important;
          }
          
          :global(.mapboxgl-ctrl-top-right) {
            margin-top: 20px !important;
            margin-right: 8px !important;
            transform: scale(0.8) !important;
            transform-origin: top right !important;
          }
          
          :global(.mapboxgl-ctrl-geocoder input) {
            font-size: 12px !important;
            padding: 6px 8px !important;
            height: 32px !important;
          }
          
          :global(.mapboxgl-ctrl-geocoder .mapboxgl-ctrl-geocoder--icon) {
            width: 24px !important;
            height: 24px !important;
          }
          
          :global(.mapboxgl-ctrl button) {
            width: 24px !important;
            height: 24px !important;
          }
          
          :global(.mapboxgl-ctrl-group) {
            border-radius: 4px !important;
          }
          
          /* Hacer el dropdown de resultados más pequeño también */
          :global(.mapboxgl-ctrl-geocoder .suggestions) {
            font-size: 12px !important;
            max-height: 150px !important;
          }
        }
      `}</style>
    </div>
  )
}

export default MapLocation
