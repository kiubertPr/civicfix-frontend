const getModuleState = state => state.users;

export const getUser = state => 
    getModuleState(state).user;

export const getUserList = state => 
    getModuleState(state).userList;

export const isLoggedIn = state =>
    getUser(state) !== null

export const getUsername = state => 
    isLoggedIn(state) ? getUser(state).username : null;

export const getRole = state =>
    isLoggedIn(state) ? getUser(state).role : null;