// src/VideoList.js
import React from 'react';
import './VideoList.css';
import { Link } from 'react-router-dom';
import LazyImage from '../../components/common/LazyImage';

const VideoList = ({ videos }) => {
    return (
        <div className='List-video'>
            <h2>Danh sách Video</h2>
            <ul id='videoListComponents'>
                {videos.map((video) => (
                    <li key={video.id} className='li-video-box'>
                        <Link to={`/listVideo/${video.id}`}>
                            <div className="image-box">
                                <LazyImage 
                                    src='https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_57.jpg'
                                    alt={video.title}
                                    effect="blur"
                                    className='video-thumbnail'
                                />
                            </div>
                            <p className="video-title">{video.title}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VideoList;
