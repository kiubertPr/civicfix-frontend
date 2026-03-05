import {combineReducers} from 'redux';

import * as actionTypes from './actionTypes';

const initialState = {
    surveys: [],
    surveyDetail: null,
    surveyResults: null,
};

const surveys = (state = initialState.surveys, action) => {
    switch (action.type) {
        case actionTypes.GET_SURVEYS_COMPLETED:
            return action.surveys;
        default:
            return state;
    }
};

const surveyDetail = (state = initialState.surveyDetail, action) => {
    switch (action.type) {
        case actionTypes.GET_SURVEY_DETAIL_COMPLETED:
            return action.surveyDetail;
        case actionTypes.CLEAR_SURVEY_DETAIL:
            return null;
        default:
            return state;
    }
}

const surveyResults = (state = initialState.surveyResults, action) => {
    switch (action.type) {
        case actionTypes.GET_SURVEY_RESULTS_COMPLETED:
            return action.surveyResults;
        case actionTypes.CLEAR_SURVEY_RESULTS:
            return null;
        default:
            return state;
    }
}

const reducer = combineReducers({
    surveys,
    surveyDetail,
    surveyResults
});

export default reducer;