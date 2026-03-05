import { useSelector } from "react-redux";
import * as selectors from "../selectors";

import PostItem from "./PostItem";

const MyPostsSection = () => {

    const userPosts = useSelector(selectors.getUserPosts);

    return (

        <div className="max-h-96 mt-4 space-y-4 overflow-y-auto scroll-auto scroll no-scrollbar">
            {
                userPosts.length === 0 ? 
                    (<div className="text-gray-400 text-center py-8">No hay publicaciones en esta categoría</div>) 
                    : 
                    (userPosts.map((post) => <PostItem key={post.id} post={post} />))
            }
        </div>

    )
}

export default MyPostsSection;