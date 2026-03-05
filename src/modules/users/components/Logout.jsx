import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';

import * as actions from '../actions';
import {clearUserPosts} from '../../posts/actions'; 

const Logout = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(clearUserPosts());
        dispatch(actions.logout());
        navigate('/');
    }, [dispatch, navigate]);

    return null;

}

export default Logout;