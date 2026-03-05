import {configureStore} from '@reduxjs/toolkit';
import {persistStore} from 'redux-persist';

import persistedReducer from './rootReducer';

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            // To avoid an error shown in the browser console when the action "project/app/error"
            // is dispatched (the "error" field in the action is not serializable).
            serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export default {store, persistor};