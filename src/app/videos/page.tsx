'use client';

import React from 'react';

const VideoPage: React.FC = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const src = searchParams.get("src");

    return (
        <>
            <div className='contanervideo'>
                <div className='videorad'>
                    <video controls className='video' src={src ?? ''} autoPlay></video>
                </div>
            </div>
        </>
    );
}

export default VideoPage;
