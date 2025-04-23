import React, { useState } from 'react';
import PropTypes from 'prop-types';

ButtonFillterVideo.propTypes = {

};

function ButtonFillterVideo(props) {
    const [video, setVideo] = useState(null)

    const videoContentPost = {
        Autho: '',
        title: '',
        fillter: '',
        videoDescriptions: '',

    }

    return (
        <div className='create-video-content-box'>
            <div className="content-detail-box">
                <input type="text" name="" id="video-content-title" />
                <p className="requireFillter">
                    <input type="checkbox" name="" id="" />
                </p>
                <textarea></textarea>
                <input type="file" name="" id="" />
                <input type="submit" value="" />
            </div>

        </div>
    );
}

export default ButtonFillterVideo;