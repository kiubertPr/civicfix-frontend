import {useSelector} from 'react-redux';
import {Route, Routes} from 'react-router-dom';

import * as users from '../../users';

import AppGlobalComponents from './AppGlobalComponents';
import Feed from './Feed';
import {Login, SignUp, Profile, Logout, UpdateProfile, UserSection, UserPointsHistory, RedeemPoints} from '../../users';
import { PostForm, PostDetail, PostEdit } from '../../posts';
import {ContactForm} from '../../mail';
import {SurveyForm} from '../../surveys';
import { PrivateRoute, DemoWarning } from '../../common';

const Body = () => {

    const user = useSelector(users.default.selectors.getUser);

    const isAdmin = user && user.role && user.role === 'ADMIN';

   return (

        <div id='_body' className="flex justify-center w-full h-full">
            <DemoWarning/>
            <AppGlobalComponents/>
            <Routes>
                <Route path="/*" element={<Feed/>}/>
                <Route path="/home" element={<Feed/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/signup' element={<SignUp/>}/>
                <Route path='/posts/postDetail' element={<PostDetail/>}/>
                <Route path='/contact' element={<ContactForm/>}/>

                {user && <Route path='/logout' element={<Logout/>} />}
                
                <Route path='/profile' element={<PrivateRoute element={<Profile/>}/>} />
                <Route path='/points/history' element={<PrivateRoute element={<UserPointsHistory/>}/>} />
                <Route path='/points/redeem' element={<PrivateRoute element={<RedeemPoints/>}/>} />
                <Route path='/posts/create' element={<PrivateRoute element={<PostForm/>}/>} />
                <Route path='/updateprofile' element={<PrivateRoute element={<UpdateProfile/>}/>} />
                <Route path='/posts/:id/edit' element={<PrivateRoute element={<PostEdit/>}/>} />

                <Route path='/surveys/create' element={<PrivateRoute element={<SurveyForm mode="create"/>} adminRoute={true} />} />
                <Route path='/users/list' element={<PrivateRoute element={<UserSection/>} adminRoute={true} />} />

            </Routes>
        </div>

    );

};

export default Body;