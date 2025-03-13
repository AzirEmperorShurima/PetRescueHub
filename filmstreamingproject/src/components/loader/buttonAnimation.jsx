import React from 'react';
import './SpaceAnimation.css'
const ButtonSpaceAnimation = () => {
    return (
        <div className="container noselect">
            <label htmlFor="checkbox" id="clickHandler" />
            <input type="checkbox" id="checkbox" />

            <button id="button">
                <p id="to-launch">let's launch!</p>
                <p id="tag">by kennyotsu &lt;3</p>
                <div id="platform"></div>
                <div className="caution">
                    <div id="caution-left">LAUNCH ZONE</div>
                    <div id="caution-right">LAUNCH ZONE</div>
                </div>
            </button>

            <p id="to-hover">hover me</p>
            <div id="shuttle-wrapper">
                <div id="shadow"></div>
                <svg viewBox="0 0 230.24 542.46" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="b">
                    <defs>
                        {/* Omitted for brevity - gradient definitions */}
                    </defs>
                    {/* Omitted for brevity - SVG elements */}
                </svg>
            </div>
        </div>
    );
};

export default ButtonSpaceAnimation;
