import {combineReducers} from 'redux';

import * as actionTypes from './actionTypes';

const initialState = {
    user: null, 
    userList: []
};

const user = (state = initialState.user, action) => {

    switch (action.type) {

        case actionTypes.SIGN_UP_COMPLETED:
            return action.authenticatedUser.user;

        case actionTypes.LOGIN_COMPLETED:
            return action.authenticatedUser.user;

        case actionTypes.LOGOUT:
            return initialState.user;

        case actionTypes.UPDATE_COMPLETED:
            return action.user;

        default:
            return state;

    }

}

const userList = (state = initialState.userList, action) => {
    switch (action.type) {

        case actionTypes.GET_USERS_LIST_COMPLETED:
            return action.users;

        default:
            return state;

    }

}

const reducer = combineReducers({
    user,
    userList
});

export default reducer;