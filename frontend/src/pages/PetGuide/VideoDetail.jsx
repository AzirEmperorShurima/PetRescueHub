// src/components/Media/VideoDetail.js
import React from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from './Video';
import './videoDetail.css'
const VideoDetail = ({ videos }) => {
    const { id } = useParams();
    const video = videos.find((v) => v.id === id);
    console.table(videos)
    if (!video) {
        return <div>Video không tồn tại</div>;
    }
    return (
        <div className='VideoDetail'>
            <h2>{video.title}</h2>
            <VideoPlayer src={video.src} videoID={id} />
        </div>
    );
};

export default VideoDetail;
