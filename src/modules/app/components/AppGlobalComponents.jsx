import {useSelector, useDispatch} from 'react-redux';

import {ErrorDialog} from '../../common';
import * as actions from '../actions';
import * as selectors from '../selectors';
import { NetworkError } from '../../../backend';

const ConnectedErrorDialog = () => {

    const error = useSelector(selectors.getError);
    const dispatch = useDispatch();

    return <ErrorDialog error={error} 
                onClose={() => dispatch(actions.error(null))}/>

};

const AppGlobalComponents = () => (<ConnectedErrorDialog/>);

export default AppGlobalComponents;
