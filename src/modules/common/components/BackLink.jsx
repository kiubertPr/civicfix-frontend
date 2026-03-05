import {useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';

import {ChevronLeft} from 'lucide-react';


const BackLink = ({size}) => {

    const navigate = useNavigate();
    
    return (

        <div className='flex flex-col justify-center align-baseline' onClick={() => navigate(-1)}>
            <ChevronLeft size={size}/>
        </div>

    );

};

BackLink.propTypes = {
    size: PropTypes.number,
};

export default BackLink;