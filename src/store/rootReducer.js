import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import localForage from "localforage";

import app from '../modules/app';
import users from '../modules/users';
import posts from '../modules/posts';
import surveys from '../modules/surveys';


const persistConfig = {
    key:"root",
    storage: localForage,
    whitelist: ["users", "posts", "surveys"],
};

const rootReducer = combineReducers({
    app: app.reducer,
    users: users.reducer,
    posts: posts.reducer,
    surveys: surveys.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
