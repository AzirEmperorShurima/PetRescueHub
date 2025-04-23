import React, { useState, useEffect, useRef } from 'react';

const VideoPlayer = ({ src, width = '950', height = '530', id }) => {
    const isYouTube = src.includes('youtube.com');
    const isPhimmoi = src.includes('phimmoiday.net');
    const isBlobUrl = src.startsWith('blob:');
    const [blobUrl, setBlobUrl] = useState('');
    const playerRef = useRef(null);
    const [player, setPlayer] = useState(null);
    const [videoId, setVideoId] = useState('');

    const onPlayerReady = (event) => {
        setPlayer(event.target);
        console.log('Player is ready');
    };

    useEffect(() => {
        if (isYouTube) {
            const url = new URL(src);
            setVideoId(url.searchParams.get('v'));

            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = () => {
                setPlayer(new window.YT.Player(playerRef.current, {
                    height: '390',
                    width: '640',
                    videoId: url.searchParams.get('v'),
                    events: {
                        'onReady': onPlayerReady,
                    },
                }));
            };
        }
    }, [src, isYouTube]);

    const getYouTubeEmbedUrl = (url) => {
        const videoId = new URL(url).searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
    };

    const getPhimmoiEmbedUrl = (url) => {
        return url;
    };

    const handleFastForward = () => {
        console.log('player' + player)
        if (player) {
            const currentTime = player.getCurrentTime();
            player.seekTo(currentTime + 10);
        }
    };

    const handleRewind = () => {
        console.log('player' + playerRef)
        if (player) {
            const currentTime = player.getCurrentTime();
            player.seekTo(Math.max(currentTime - 10, 0));
        }
    };

    return (
        <div className='VideoPlayer'>
            {isYouTube && (
                <iframe

                    ref={playerRef}
                    width={width}
                    height={height}
                    src={getYouTubeEmbedUrl(src)}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture ;"
                    allowFullScreen
                    title="Embedded YouTube"
                    className='ytbVideo'

                ></iframe>
            )}
            {isPhimmoi && (
                <iframe
                    ref={playerRef}
                    width={width}
                    height={height}
                    src={getPhimmoiEmbedUrl(src)}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Embedded Phimmoi"
                ></iframe>
            )}
            {isBlobUrl && blobUrl && (
                <video width={width} height={height} controls>
                    <source src={blobUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}
            {!isYouTube && !isPhimmoi && !isBlobUrl && (
                <iframe
                    ref={playerRef}
                    width={width}
                    height={height}
                    src={src}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Embedded Video"
                ></iframe>
            )}
            <p className="detail-video-title" style={{ textAlign: "start" }}>Cọaodshdakjkd</p>
            <div>
                <button onClick={handleRewind}>Tua lại 10s</button>
                <button onClick={handleFastForward}>Tua tới 10s</button>
            </div>
        </div>
    );
};

export default VideoPlayer;
