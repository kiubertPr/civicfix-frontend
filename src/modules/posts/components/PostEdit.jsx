import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import PostForm from "./PostForm"
import * as actions from "../actions"
import * as selectors from "../selectors"

const PostEdit = () => {
  const { postId } = useParams()
  const dispatch = useDispatch()
  const post = useSelector(selectors.getPostDetail)

  const relatedPostIds = post?.relatedPosts?.map((relatedPost) => relatedPost.id) || []

  useEffect(() => {
    if (postId) {
      dispatch(actions.getPost(postId, () => {}))
    }
  }, [postId, dispatch])

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Cargando...</div>
      </div>
    )
  }

  return (
    <PostForm
      mode="edit"
      initialData={{
        id: post.id,
        title: post.title,
        content: post.content,
        location: post.location,
        latitude: post.latitude,
        longitude: post.longitude,
        images: post.images || [],
        files: post.files || [],
        relatedPostsIds: relatedPostIds || [],
        oldRelatedPosts: post.relatedPosts|| [],
      }}
    />
  )
}

export default PostEdit
