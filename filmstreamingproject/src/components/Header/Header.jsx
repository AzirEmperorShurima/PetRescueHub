import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Header.css';
import { Link, NavLink } from "react-router-dom";
import { FaSortAmountDown } from "react-icons/fa";
import { BsCaretUpSquare } from "react-icons/bs";

HEADER.propTypes = {
    user: PropTypes.object,
    Authentication: PropTypes.bool,
    Authorization: PropTypes.object // Đổi kiểu dữ liệu thành object cho Authorization
};

function HEADER({ Authorization, user, Authentication }) {
    const [barOpen, setBarOpen] = useState(false);

    const handleBarFeatureOpen = () => {
        setBarOpen(!barOpen);
        console.log("Feature bar open:", !barOpen);
    };

    const getRole = () => {
        return Authorization ? Authorization.role : null;
    };

    return (
        <header className='app-header'>
            <ul className="menu" id='menu-bar'>
                <li className="menu-tab"><NavLink to='/' className="menu-link">Home</NavLink></li>
                <li className="menu-tab"><NavLink to='#' className="menu-link">TV Shows</NavLink></li>
                <li className="menu-tab"><NavLink to='#' className="menu-link">Movies</NavLink></li>
                <li className="menu-tab"><NavLink to='/listVideo' className="menu-link">List Video</NavLink></li>
                <li className="menu-tab"><NavLink to='#' className="menu-link">More Type</NavLink></li>
                {Authentication && Authorization ? (
                    getRole() === 'admin' ? (
                        <div className="user-portfolio">
                            <div className="user-box">

                                <Link to={'/'} className='user-image'></Link>
                                <p className="username">{user?.Name}</p>
                                <ul className={`feature ${barOpen ? 'open' : ''}`}>
                                    <li className="features-link">Profile</li>
                                    <li className="features-link">Settings</li>
                                    <li className="features-link">Logout</li>
                                </ul>
                            </div>
                            {barOpen ? (
                                <FaSortAmountDown className='displayFeatureBar' onClick={handleBarFeatureOpen} />
                            ) : (
                                <BsCaretUpSquare className='displayFeatureBar' onClick={handleBarFeatureOpen} />
                            )}
                        </div>
                    ) : (
                        <div className="user-portfolio">
                            <Link to={'/'} className='user-image'></Link>
                            <p className="username">{user?.Name}</p>
                            <ul className={`feature ${barOpen ? 'open' : ''}`}>
                                <li className="features-link">Profile</li>
                                <li className="features-link">Settings</li>
                                <li className="features-link">Logout</li>
                            </ul>
                            {barOpen ? (
                                <FaSortAmountDown className='displayFeatureBar' onClick={handleBarFeatureOpen} />
                            ) : (
                                <BsCaretUpSquare className='displayFeatureBar' onClick={handleBarFeatureOpen} />
                            )}
                        </div>
                    )
                ) : (
                    <div className="auth-links">
                        <Link to="/Auth/login" className="auth-link-item">Login</Link>
                        <Link to={"/Auth/Register"} className='auth-link-item' >Register</Link>


                    </div>
                )}
            </ul>

        </header>
    );
}

export default HEADER;
