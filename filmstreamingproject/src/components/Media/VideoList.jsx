// src/VideoList.js
import React from 'react';
// import VideoPlayer from './Video';

import './VideoList.css';
import { Link } from 'react-router-dom';
const VideoList = ({ videos }) => {
    // const [selectedVideo, setSelectedVideo] = useState(null);

    return (
        <div className='List-video'>
            <h2>Danh sách Video</h2>
            <ul id='videoListComponents'>
                {videos.map((video) => (
                    <li key={video.id} className='li-video-box'>
                        <Link to={`/listVideo/${video.id}`}>
                            <div className="image-box">
                                <img src='https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_57.jpg'
                                    className='video-thumbnail' alt='k'></img>

                            </div>
                            <p className="video-title">{video.title}</p>
                        </Link>

                    </li>
                ))}
            </ul>
            {/* {selectedVideo && <VideoPlayer src={selectedVideo.src} />} */}
        </div>
    );
};

export default VideoList;
