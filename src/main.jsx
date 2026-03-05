
import React from 'react';
import ReactDOM from 'react-dom/client';

import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { PersistGate } from 'redux-persist/integration/react';

import {GoogleAuthProviderWrapper} from './modules/app';

import backend, { NetworkError } from './backend';
import { initReactIntl } from './i18n';
import './index.css';
import app, { App } from './modules/app';
import redux from './store';

backend.init(() => redux.store.dispatch(app.actions.error(new NetworkError())));

/* Configure i18n. */
const {locale, messages} = initReactIntl();

/* Render application. */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={redux.store}>
            <PersistGate loading={null} persistor={redux.persistor}>
                <IntlProvider locale={locale} messages={messages}>
                    <GoogleAuthProviderWrapper>
                        <BrowserRouter>
                            <App/>
                        </BrowserRouter>
                    </GoogleAuthProviderWrapper>
                </IntlProvider>
            </PersistGate>
        </Provider>
    </React.StrictMode>
);