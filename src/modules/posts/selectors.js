const getModuleState = state => state.posts;

export const getPostsFeed = state => getModuleState(state).postsFeed;

export const getPostsLast = state => getModuleState(state).postsLast;

export const getPostDetail = state => getModuleState(state).postDetail;

export const getUserPosts = state => getModuleState(state).userPosts;