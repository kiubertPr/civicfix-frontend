import {config, appFetch} from './appFetch';

export const createSurvey = (survey, onSuccess, onErrors) => {
    appFetch(`/civicfix/surveys/create`, config('POST', survey), onSuccess, onErrors);
}

export const getSurveys = (page, size, sortBy, sortDirection, onSuccess) => {
    const params = new URLSearchParams({page, size, sortBy, sortDirection});
    appFetch(`/civicfix/surveys/list?${params}`, config('GET'), onSuccess);
}

export const answerSurvey = (surveyId, answers, onSuccess, onErrors) => {
    appFetch(`/civicfix/surveys/answer/${surveyId}`, config('POST', answers), onSuccess, onErrors);
}