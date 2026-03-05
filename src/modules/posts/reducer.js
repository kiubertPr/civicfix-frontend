import { combineReducers } from 'redux';

import * as actionTypes from './actionTypes';

const initialState = {
    postsFeed: [],
    postsLast: [],
    userPosts: [],
    postDetail: null,
};

const postsFeed = (state = initialState.postsFeed, action) => {
    switch (action.type) {
        case actionTypes.GET_FEED_COMPLETED:
            return action.posts;
        default:
            return state;
    }
}

const postsLast = (state = initialState.postsLast, action) => {
    switch (action.type) {
        case actionTypes.GET_LAST_COMPLETED:
            return action.posts;
        default:
            return state;
    }
}

const userPosts = (state = initialState.userPosts, action) => {
    switch (action.type) {
        case actionTypes.GET_USER_POSTS_COMPLETED:
            return action.posts;
        case actionTypes.CLEAR_USER_POSTS:
            return initialState.userPosts;s
        default:
            return state;
    }
}

const postDetail = (state = initialState.postDetail, action) => {
    switch (action.type) {
        case actionTypes.FIND_POST_BY_ID_COMPLETED:
            return action.postDetail;

        case actionTypes.CLEAR_POST:
            return initialState.postDetail;

        default:
            return state;
    }
}

const reducer = combineReducers({
    postsFeed,
    postsLast,
    userPosts,
    postDetail,
});

export default reducer;