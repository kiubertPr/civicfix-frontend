import SideHeader from './SideHeader';
import RightSidebar from './RightSidebar';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import post from '../../posts';
import user from '../../users';
import survey from '../../surveys';

const Home = ({children}) => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(post.actions.getLast());
        dispatch(survey.actions.getSurveys(0, 5, "createdAt", "desc"));
        dispatch(user.actions.tryLoginFromServiceToken());        
    }, []);

    return(
        <div className="flex justify-center w-full gap-4 bg-gray-900">
            <SideHeader/>
            {children}
            <RightSidebar/>
        </div>
    );
}

export default Home;
