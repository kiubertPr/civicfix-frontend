import * as actionTypes from './actionTypes';
import backend from '../../backend';

const getFeedCompleted = posts => ({
    type: actionTypes.GET_FEED_COMPLETED,
    posts
});

export const getFeed = (category, page, size, sortBy, sortDirection) => dispatch => 
    backend.postService.getFeed(category, page, size, sortBy, sortDirection, 
        result => dispatch(getFeedCompleted(result)));


const getLastCompleted = posts => ({
    type: actionTypes.GET_LAST_COMPLETED,
    posts
});

export const getLast = () => dispatch => 
    backend.postService.getLastPosts( 
        result => dispatch(getLastCompleted(result)));

const getPostDetailCompleted = postDetail => ({
    type: actionTypes.FIND_POST_BY_ID_COMPLETED,
    postDetail
});

const getUserPostsCompleted = posts => ({
    type: actionTypes.GET_USER_POSTS_COMPLETED,
    posts
});

export const getUserPosts = () => dispatch =>
    backend.postService.getUserPosts(
        result => dispatch(getUserPostsCompleted(result)));

export const addPost = (post, onSuccess, onErrors) => dispatch =>
    backend.postService.addPost(post, 
        postDetail => {
            dispatch(getPostDetailCompleted(postDetail));
            onSuccess();
        },
        onErrors);

export const getPost = (postId, onSuccess) => dispatch => {
    dispatch(clearPostDetail());
    backend.postService.getPost(postId, 
        postDetail => {
            dispatch(getPostDetailCompleted(postDetail));
            onSuccess();
        });
}

export const updatePost = (postId, data, onSuccess, onErrors) => dispatch => {
    backend.postService.updatePost(postId, data, 
        postDetail => {
            dispatch(getPostDetailCompleted(postDetail));
            onSuccess();
        }, 
        onErrors);
}

export const deletePost = (postId, onSuccess, onErrors) => dispatch => {
    backend.postService.deletePost(postId, 
        response => {
            dispatch(clearPostDetail());
            onSuccess();
        }, 
        onErrors);
}

export const votePost = (postId, vote, onSuccess, onErrors) => dispatch =>{
    backend.postService.votePost(postId, vote, 
        postDetail => {
            dispatch(getPostDetailCompleted(postDetail));
            onSuccess();
        }, 
        onErrors);
}

export const deleteVote = (postId, onSuccess) => dispatch => {
    backend.postService.deleteVote(postId, 
        postDetail => {
            dispatch(getPostDetailCompleted(postDetail));
            onSuccess();
        });
}
 
const clearPostDetail = () => ({
    type: actionTypes.CLEAR_POST
});

export const clearUserPosts = () => {
    return { type: actionTypes.CLEAR_USER_POSTS};};