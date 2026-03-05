import * as actions from './actions';
import * as actionTypes from './actionTypes';
import reducer from './reducer';
import * as selectors from './selectors';

export {default as Login} from './components/Login';
export {default as SignUp} from './components/SignUp';
export {default as Logout} from './components/Logout';
export {default as Profile} from './components/Profile';
export {default as UpdateProfile} from './components/UpdateProfile';
export {default as UserSection} from './components/UserSection';
export {default as UserPointsHistory} from './components/UserPointsHistory';
export {default as RedeemPoints} from './components/RedeemPoints';

export default {actions, actionTypes, reducer, selectors};