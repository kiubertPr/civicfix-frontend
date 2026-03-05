import {config, appFetch, setServiceToken, getServiceToken, removeServiceToken, setReauthenticationCallback} from './appFetch';

export const login = (username, password, onSuccess, onErrors, reauthenticationCallback) =>
    appFetch('/civicfix/users/login', config('POST', {username, password}),
        authenticatedUser => {
            setServiceToken(authenticatedUser.serviceToken);
            setReauthenticationCallback(reauthenticationCallback);
            onSuccess(authenticatedUser);
        }, 
        onErrors);

// Nueva función para el login de Google
export const googleLogin = (token, onSuccess, onErrors, reauthenticationCallback) =>
appFetch(
    "/civicfix/users/googleLogin", // Asegúrate de que este endpoint coincida con tu backend (google-login o googleLogin)
    config("POST", { token }),
    (authenticatedUser) => {
    setServiceToken(authenticatedUser.serviceToken)
    setReauthenticationCallback(reauthenticationCallback)
    onSuccess(authenticatedUser)
    },
    onErrors,
)

export const tryLoginFromServiceToken = (onSuccess, reauthenticationCallback) => {

    const serviceToken = getServiceToken();

    if (!serviceToken) {
        onSuccess();
        return;
    }

    setReauthenticationCallback(reauthenticationCallback);

    appFetch('/civicfix/users/loginFromServiceToken', config('POST'),
        authenticatedUser => onSuccess(authenticatedUser),
        () => removeServiceToken()
    );

}

export const signUp = (user, onSuccess, onErrors, reauthenticationCallback) => {

    appFetch('/civicfix/users/signup', config('POST', user), 
        authenticatedUser => {
            setServiceToken(authenticatedUser.serviceToken);
            setReauthenticationCallback(reauthenticationCallback);
            onSuccess(authenticatedUser);
        }, 
        onErrors);

}

export const logout = () => removeServiceToken();

export const update = (data, onSuccess, onErrors) =>
    appFetch(`/civicfix/users/update`, config('PUT', data), onSuccess, onErrors);

export const getUsersList = (page, size, searchTerm, roleFilter, onSuccess) =>{
    const params = new URLSearchParams({page, size, searchTerm, roleFilter});
    appFetch(`/civicfix/users/list?${params}`, config('GET'), onSuccess);
}

export const getUserPointsHistory = (page, size, onSuccess) => {
    const params = new URLSearchParams({page, size});
    appFetch(`/civicfix/pointSystem/history?${params}`, config('GET'), onSuccess);
}

export const redeemPrice = (data, onSuccess, onErrors) =>
    appFetch(`/civicfix/pointSystem/redeem`, config('POST', data), onSuccess, onErrors);

export const deleteUser = (userId, onSuccess, onErrors) =>
    appFetch(`/civicfix/users/deleteUser/${userId}`, config('DELETE'), onSuccess, onErrors);

export const disableUser = (userId, onSuccess, onErrors) =>
    appFetch(`/civicfix/users/disableUser/${userId}`, config('DELETE'), onSuccess, onErrors);