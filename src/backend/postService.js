import {config, appFetch} from './appFetch';

export const getFeed = (category, page, size, sortBy, sortDirection, onSuccess) =>{
    const params = new URLSearchParams({category, page, size, sortBy, sortDirection,});
    appFetch(`/civicfix/posts/feed?${params}`, config('GET'), onSuccess);
}

export const getLastPosts = (onSuccess) => {
    appFetch(`/civicfix/posts/last`, config('GET'), onSuccess);
}

export const getUserPosts = (onSuccess) => {
    appFetch(`/civicfix/posts/myposts`, config('GET'), onSuccess);
}

export const addPost = (post, onSuccess, onErrors) => {
    appFetch(`/civicfix/posts/add`, config('POST', post), onSuccess, onErrors);
}

export const getPost = (postId, onSuccess) => {
    appFetch(`/civicfix/posts/${postId}`, config('GET'), onSuccess);
}

export const updatePost = (postId, data, onSuccess, onErrors) => {
    appFetch(`/civicfix/posts/update/${postId}`, config('PUT', data), onSuccess, onErrors);
}

export const deletePost = (postId, onSuccess, onErrors) => {
    appFetch(`/civicfix/posts/delete/${postId}`, config('DELETE'), onSuccess, onErrors);
}

export const getPostSelect = (onSuccess) => {
    appFetch(`/civicfix/posts/postSelect`, config('GET'), onSuccess);
}

// Sistema de votación
export const votePost = (postId, vote, onSuccess, onErrors) => {
    const params = new URLSearchParams({vote});
    appFetch(`/civicfix/posts/${postId}/vote?${params}`, config('POST'), onSuccess, onErrors);
}

export const deleteVote = (postId, onSuccess) => {
    appFetch(`/civicfix/posts/${postId}/vote`, config('DELETE'), onSuccess);
}