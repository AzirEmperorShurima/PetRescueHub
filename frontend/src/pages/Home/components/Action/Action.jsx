import React from 'react';
import { Link } from 'react-router-dom';
import action from '../../../../assets/images/adoptme.png'
import { BiSolidDonateHeart } from "react-icons/bi";
import styles from './Action.module.css';

const Action = () => {
    return (
        <Link to="/donate" style={{ textDecoration: 'none' }}>
            <section className={styles.actionSection} style={{ cursor: 'pointer' }}>
                <div className={styles.actionImgWrapper}>
                    <img src={action} className={styles.actionImg} alt="Please Adopt Me" />
                </div>
                <div className={styles.actionContent}>
                    <hr className={styles.actionLine} />
                    <p className={styles.actionTitle}>Save A Pet</p>
                    <div className={styles.actionDonateRow}>
                        <p className={styles.actionDonate}>DONATE NOW</p>
                        <BiSolidDonateHeart className={styles.actionIcon} />
                    </div>
                    <hr className={styles.actionLine} />
                </div>
            </section>
        </Link>
    );
};

export default Action;