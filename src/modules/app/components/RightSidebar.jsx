import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import * as selectors from "../../posts/selectors"
import { useNavigate } from "react-router-dom"
import {MultiMarkersMap} from "../../common"
import * as actions from "../../posts/actions"

const RightSidebar = () => {
  const recentPosts = useSelector(selectors.getPostsLast) || []
  const [selectedMarker, setSelectedMarker] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  if (!recentPosts || recentPosts.length === 0) {
    return null
  }
  const markers = recentPosts
    .filter((post) => post.latitude && post.longitude)
    .map((post) => ({
      id: post.id,
      lat: post.latitude,
      lng: post.longitude,
      title: post.title,
      location: post.location,
      category: post.category,
      postId: post.id,
    }))
    
  const handleViewPost = async(postId) => {
    dispatch(actions.getPost(postId, () => navigate('/posts/postDetail')));
  }

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker)
    handleViewPost(marker.postId)
  }


  return (
    <div className="hidden xl:w-2/8 lg:w-2/5 lg:block p-6 border-l border-gray-700 shadow-md">
      {markers.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4 text-amber-500">Publicaciones Recientes</h2>

          <div className="h-[90vh] rounded-lg overflow-hidden border border-gray-700 mb-3 shadow-md shadow-black/35">
            <MultiMarkersMap
              markers={markers}
              markerColor="#f59e0b"
              fitBounds={true}
              onMarkerClick={handleMarkerClick}
              defaultZoom={13}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default RightSidebar