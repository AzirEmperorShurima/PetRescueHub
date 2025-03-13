// src/NotFound.js
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './err.css';

function NotFound({ Auth }) {
    const location = useLocation()
    console.log(location)
    const navigate = useNavigate()
    useEffect(() => {
        const timming = setTimeout(() => {
            if (!Auth)
                navigate('/Auth/login')
            navigate('/')
        }, 5000)
        return () => clearTimeout(timming)
    }, [Auth, navigate])


    return (
        <div className="agileits-main">
            <div className="agileinfo-row">
                <div className="w3layouts-errortext">
                    <h2>4<span className='Spain'>0</span>4</h2>
                    <h1>Sorry! The page you were looking for could not be found </h1>
                    <p className="w3lstext">
                        You have been tricked into clicking on a link that cannot be found. Please check the
                        URL or go to <Link to="/">main page</Link> and see if you can locate what
                        you are looking for.
                    </p>
                    <div className="agile-search">
                        <form action="#" method="post">
                            <input type="text" name="Search" placeholder="Enter your search term..." id="search" required="" />
                            <input type="submit" value="Search" />
                        </form>
                    </div>
                    <div className="w3top-nav-right">
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/blog">Blog</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="copyright w3-agile">
                <p>© 2023 Coder_Lord Error Page. All rights reserved | Design by <a href="https://coder_lord.com" target="_blank" rel="noopener noreferrer">Coder_Lord</a></p>
            </div>
        </div>
    );
}

export default NotFound;
