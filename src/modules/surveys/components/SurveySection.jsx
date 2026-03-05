import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {ErrorDisplay, FilterComponent, Pager} from '../../common';

import * as actions from '../actions';
import * as selectors from '../selectors';
import SurveyItem from './SurveyItem';
import users from '../../users';


const SurveySection = () => {
    const user = useSelector(users.selectors.getUser);
    const surveys = useSelector(selectors.getSurveys);
    const dispatch = useDispatch();
    const scrollRef = useRef(null);

    const [backendErrors, setBackendErrors] = useState(null);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortDirection, setSortDirection] = useState("desc");
    const surveyFilters = [
                    {"label": "Fecha", "value": "createdAt"}, 
                    {"label":"Respondidas", "value": "answered"},
                ]

    useEffect(() => {
        if(user){
            dispatch(actions.getSurveys(page, size, sortBy, sortDirection));
            setBackendErrors(null);
        }
    }, [page, size, sortBy, sortDirection, user]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [page, size, sortBy, sortDirection]);

    const handleAnswerSurvey = () => {
        dispatch(actions.getSurveys(page, size, sortBy, sortDirection));
    }

    const handleSurveyError = (error) => {
        setBackendErrors(error);
    }

    const handlePageSizeChange = (newSize) => {
        setSize(newSize)
        setPage(0) 
    }

    return (
        <div className='lg:w-5/8 w-full flex flex-col overflow-y-auto scroll-auto scroll no-scrollbar'>
            <FilterComponent 
                filters={surveyFilters} 
    
                handleFilterChange={(field, direction) => {
                    setSortBy(field);
                    setSortDirection(direction);
                    setPage(0);
                }} 

                onClear={
                    () => {
                        setSortBy("createdAt");
                        setSortDirection("desc");
                        setPage(0);
                    }
                }
            />
            <div ref={scrollRef} className="lg:mt-2 p-4 lg:p-0 ">
            {backendErrors && (
                <ErrorDisplay backendErrors={backendErrors} handleCancelClick={() => setBackendErrors(null)} />
            )}
            { surveys.content.length === 0 ? 
                (
                    <div className="text-gray-400 text-center py-8">No hay encuestas disponibles</div>
                ) : (
                    surveys.content.map((survey) => <SurveyItem key={survey.id} survey={survey} callBack={handleAnswerSurvey} onErrors={handleSurveyError} />)
                )
            }
            
            <Pager
                page={page}
                totalPages={surveys.totalPages}
                size={size}
                onPageChange={setPage}
                onSizeChange={handlePageSizeChange}
            />
            </div>
        </div>
    );
};

export default SurveySection;