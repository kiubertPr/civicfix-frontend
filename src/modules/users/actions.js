import * as actionTypes from './actionTypes';
import backend from '../../backend';

const signUpCompleted = authenticatedUser => ({
    type: actionTypes.SIGN_UP_COMPLETED,
    authenticatedUser
});

export const signUp = (user, onSuccess, onErrors, reauthenticationCallback) => dispatch =>
    backend.userService.signUp(user,
        authenticatedUser => {
            dispatch(signUpCompleted(authenticatedUser));
            onSuccess();
        },
        onErrors,
        reauthenticationCallback);

const loginCompleted = authenticatedUser => ({
    type: actionTypes.LOGIN_COMPLETED,
    authenticatedUser
});

export const login = (username, password, onSuccess, onErrors, reauthenticationCallback) => dispatch =>
    backend.userService.login(username, password,
        authenticatedUser => {
            dispatch(loginCompleted(authenticatedUser));
            onSuccess();
        },
        onErrors,
        reauthenticationCallback
    );

// Nueva acción para el login de Google
export const googleLogin = (token, onSuccess, onErrors, reauthenticationCallback) => (dispatch) =>
  backend.userService.googleLogin(
    token,
    (authenticatedUser) => {
      dispatch(loginCompleted(authenticatedUser)) // Reutilizamos loginCompleted
      onSuccess()
    },
    onErrors,
    reauthenticationCallback,
  )

export const tryLoginFromServiceToken = reauthenticationCallback => dispatch =>
    backend.userService.tryLoginFromServiceToken(
        authenticatedUser => {
            if (authenticatedUser) {
                dispatch(loginCompleted(authenticatedUser));
            }
        },
        reauthenticationCallback
    );
    

export const logout = () => {

    backend.userService.logout();

    return {type: actionTypes.LOGOUT};

};

export const updateCompleted = user => ({
    type: actionTypes.UPDATE_COMPLETED,
    user
})

export const update = (data, onSuccess, onErrors) => dispatch =>
    backend.userService.update(data, 
        response => {
            dispatch(updateCompleted(response));
            onSuccess();
        },
        onErrors);


const getUsersListCompleted = users => ({
    type: actionTypes.GET_USERS_LIST_COMPLETED,
    users
});

export const getUsersList = (page, size, searchTerm, roleFilter) => dispatch =>
    backend.userService.getUsersList(page, size, searchTerm, roleFilter,
        result => dispatch(getUsersListCompleted(result))
    );

export const deleteUser = (userId, onSuccess, onErrors) => dispatch =>
    backend.userService.deleteUser(userId,
        response => {
            dispatch(getUsersList(0, 10, '', ''));
            onSuccess();
        },
        onErrors
    );

export const disableUser = (userId, onSuccess, onErrors) => dispatch =>
    backend.userService.disableUser(userId,
        response => {
            dispatch(getUsersList(0, 10, '', ''));
            onSuccess();
        },
        onErrors
    );

export const redeemPrice = (data, onSuccess, onErrors) => dispatch =>
    backend.userService.redeemPrice(data, 
        response => {
            dispatch(tryLoginFromServiceToken());
            onSuccess();
        },
        onErrors
    );