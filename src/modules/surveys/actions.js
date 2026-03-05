import * as actionTypes from './actionTypes';
import backend from '../../backend';

const getSurveyDetailCompleted = surveyDetail => ({
    type: actionTypes.GET_SURVEY_DETAIL_COMPLETED,
    surveyDetail
});

export const createSurvey = (survey, onSuccess, onErrors) => dispatch => {
    backend.surveyService.createSurvey(survey, 
        surveyDetail => {
            dispatch(getSurveyDetailCompleted(surveyDetail));
            onSuccess();
        }, 
        onErrors);
}

const getSurveysCompleted = surveys => ({
    type: actionTypes.GET_SURVEYS_COMPLETED,
    surveys
});

export const getSurveys = (page, size, sortBy, sortDirection) => dispatch => 
    backend.surveyService.getSurveys(page, size, sortBy, sortDirection,
        surveys =>(dispatch(getSurveysCompleted(surveys)))
    );

const answerSurveyCompleted = surveyDetail => ({
    type: actionTypes.GET_SURVEY_DETAIL_COMPLETED,
    surveyDetail
});

export const answerSurvey = (surveyId, answers, onSuccess, onErrors) => dispatch => {
    backend.surveyService.answerSurvey(surveyId, answers,
        surveyDetail => {
            dispatch(answerSurveyCompleted(surveyDetail));
            onSuccess();
        }, 
        onErrors);
}