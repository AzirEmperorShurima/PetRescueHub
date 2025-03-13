import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';


CreateVideoContent.propTypes = {

};

function CreateVideoContent({ Auth }) {
    useEffect(() => {
        if (!Auth) {
            setTimeout(() => {
               Navigate('/login')
            },5000)
        }
    },[Auth])
    return (
        <div>

        </div>
    );
}

export default CreateVideoContent;