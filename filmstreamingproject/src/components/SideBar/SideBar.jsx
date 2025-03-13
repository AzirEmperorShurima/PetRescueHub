import React, { useState } from 'react';

import {
    BiChevronRight,
    BiSearch,
    BiHomeAlt,
    BiBarChartAlt2,
    BiBell,
    BiPieChartAlt,
    BiHeart,
    BiWallet,
    BiLogOut
} from "react-icons/bi";
import './Slide.css';
import logo from '../../Pictures/Logo/image.png';
import DARKLIGHTSWITCH from '../toogleSwitch/Dark_Light_Switch';

SIDEBAR.propTypes = {};

function SIDEBAR({ handleToggle, mode }) {
    const [isSlidebarClosed, setIsSlidebarClosed] = useState(true);

    const handleToggleClick = () => {
        setIsSlidebarClosed(!isSlidebarClosed);
    };

    const handleSearchClick = () => {
        setIsSlidebarClosed(false);

    };
    const handleHoverSideBar = () => {
        isSlidebarClosed ? setIsSlidebarClosed(!isSlidebarClosed) : setIsSlidebarClosed(isSlidebarClosed)

    }
    const handleMouseOutSideBar = () => {
        !isSlidebarClosed ? setIsSlidebarClosed(!isSlidebarClosed) : setIsSlidebarClosed(!isSlidebarClosed)

    }
    return (
        // <Sidebar>
        //     <Menu>
        //         <SubMenu label="Charts">
        //             <MenuItem> Pie charts </MenuItem>
        //             <MenuItem> Line charts </MenuItem>
        //         </SubMenu>
        //         <MenuItem> Documentation </MenuItem>
        //         <MenuItem> Calendar </MenuItem>
        //     </Menu>
        // </Sidebar>
        <div>
            <nav className={`slidebar ${isSlidebarClosed ? 'close' : ''}`}   // Khi hover vào phần tử
            // 
            >
                <header>
                    <div className="image-text">
                        <span className="image">
                            <img src={logo} alt="logo" />
                        </span>
                        <div className="text header-text">
                            <span className="name">Coder Lỏ</span>
                            <span className="profession">Web Developer</span>
                        </div>
                    </div>
                    <BiChevronRight className='bx bx-chevron-right toggle' onClick={handleToggleClick} />
                </header>

                <div className="menu-bar"
                // onMouseLeave={handleMouseOutSideBar}
                >
                    <div className="menu" onMouseEnter={handleHoverSideBar}>
                        <li className="search-box" onClick={handleSearchClick}>
                            <BiSearch className='bx bx-search icon' />
                            <input type="search" placeholder="Search..." />
                        </li>
                        <ul className="menu-links">
                            <li className="nav-link">
                                <a href="mailto:tranvantri352@gmail.com">
                                    <BiHomeAlt className='bx bx-home-alt icon' />
                                    <span className="text nav-text">Dashboard</span>
                                </a>
                            </li>
                            <li className="nav-link">
                                <a href="###">
                                    <BiBarChartAlt2 className='bx bx-bar-chart-alt-2 icon' />
                                    <span className="text nav-text">Revenue</span>
                                </a>
                            </li>
                            <li className="nav-link">
                                <a href="##">
                                    <BiBell className='bx bx-bell icon' />
                                    <span className="text nav-text">Notifications</span>
                                </a>
                            </li>
                            <li className="nav-link">
                                <a href="##">
                                    <BiPieChartAlt className='bx bx-pie-chart-alt icon' />
                                    <span className="text nav-text">Analytics</span>
                                </a>
                            </li>
                            <li className="nav-link">
                                <a href="##">
                                    <BiHeart className='bx bx-heart icon' />
                                    <span className="text nav-text">Likes</span>
                                </a>
                            </li>
                            <li className="nav-link">
                                <a href="##">
                                    <BiWallet className='bx bx-wallet icon' />
                                    <span className="text nav-text">Wallets</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="bottom-content">
                        <li className="nav-link">
                            <a href="##">
                                <BiLogOut className='bx bx-log-out icon' />
                                <span className="text nav-text">Logout</span>
                            </a>
                        </li>
                        {/* <li className="mode">
                            <div className="moon-sun">
                                <i className='bx bx-moon icon moon'></i>
                                <i className='bx bx-sun icon sun'></i>
                            </div>
                            <span className="mode-text text">Dark Mode</span>
                            <div className="toggle-switch">
                                <span className="switch"></span>
                            </div>
                        </li> */}
                        <DARKLIGHTSWITCH onToogleDarkLight={handleToggle} mode={mode} isSlidebarClosed={isSlidebarClosed}></DARKLIGHTSWITCH>

                    </div>
                </div>
            </nav>
        </div>
    );
}

export default SIDEBAR;
