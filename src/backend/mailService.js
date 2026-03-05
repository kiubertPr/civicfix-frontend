import {config, appFetch} from './appFetch';

export const contact = (data, onSuccess, onErrors) => {
    appFetch(`/civicfix/mail/contact`, config('POST', data), onSuccess, onErrors);
}