import { BsFillBarChartFill } from 'react-icons/bs';
import { BiAtom } from 'react-icons/bi';
import { BsFillBriefcaseFill } from 'react-icons/bs';
import contact from '../../../../assets/images/pets.jpg';
import aboutus from '../../../../assets/images/aboutus.jpg';
import styles from './AboutUs.module.css';
import { useState, useEffect } from 'react';
import { images } from '../../../../config/LinkImage.config';

const AboutUs = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);
    return (
        <section className={styles.aboutUsSection}>
            <img src={contact} alt="hình nền" className={styles.aboutUsBg} />
            <div className={styles.aboutUsOverlay}></div>
            <div className={styles.aboutUsContentWrapper}>
                <div className={styles.aboutUsTextCol}>
                    <div className={styles.aboutUsTitle}>Tìm hiểu về chúng tôi</div>
                    <div className={styles.aboutUsHeading}>Về chúng tôi</div>
                    <div className={styles.aboutUsBlock}>
                        <BsFillBarChartFill className={styles.aboutUsIcon} style={{ color: "#FFD600" }} />
                        <div>
                            <div className={styles.aboutUsBlockTitle}>Tầm nhìn của chúng tôi</div>
                            <div className={styles.aboutUsBlockDesc}>
                                Tại PetRescueHub, chúng tôi mơ ước về một thế giới nơi những tiếng sủa vui vẻ và tiếng gừ gừ mãn nguyện tràn ngập mỗi ngôi nhà. Tầm nhìn của chúng tôi là trở thành trái tim của việc nhận nuôi thú cưng, nuôi dưỡng những kết nối mang lại niềm vui, sự bầu bạn và một mái nhà vĩnh cửu cho mọi sinh vật bốn chân.
                            </div>
                        </div>
                    </div>
                    <div className={styles.aboutUsBlock}>
                        <BiAtom className={styles.aboutUsIcon} style={{ color: "#00E676" }} />
                        <div>
                            <div className={styles.aboutUsBlockTitle}>Sứ mệnh của chúng tôi</div>
                            <div className={styles.aboutUsBlockDesc}>
                                PetRescueHub mang trên mình một sứ mệnh chân thành là viết lại những câu chuyện của vô số người bạn lông xù, dẫn lối chúng đến một chương tươi sáng hơn tràn đầy tình yêu và sự thuộc về. Chúng tôi cam kết không chỉ tạo điều kiện cho các cuộc nhận nuôi mà còn nuôi dưỡng một cộng đồng nơi hành trình bầu bạn với thú cưng được tôn vinh và hỗ trợ từng bước.mọi người có thể cùng nhau giúp đỡ, cứu hộ và chăm sóc những thú cưng gặp khó khăn.
                            </div>
                        </div>
                    </div>
                    <div className={styles.aboutUsBlock}>
                        <BsFillBriefcaseFill className={styles.aboutUsIcon} style={{ color: "#d42a5c" }} />
                        <div>
                            <div className={styles.aboutUsBlockTitle}>Giá trị cốt lõi của chúng tôi</div>
                            <div className={styles.aboutUsBlockDesc}>
                                PetRescueHub trân trọng sự đa dạng trong mỗi cái vẫy đuôi, tiếng meo và tiếng hót, nhận ra vẻ quyến rũ độc đáo mà mỗi thú cưng mang lại. Các giá trị cốt lõi của chúng tôi xoay quanh tính toàn diện, lòng trắc ẩn và niềm tin rằng mọi thú cưng, bất kể quá khứ của chúng, đều xứng đáng có một vòng tay ấm áp, yêu thương. Chúng tôi tận tâm duy trì các nguyên tắc về quyền sở hữu thú cưng có trách nhiệm, đảm bảo rằng cộng đồng PetRescueHub là một nơi trú ẩn của tình yêu vô điều kiện và những kết nối trọn đời...
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.aboutUsImgCol}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: 380 }}>
                        {images.map((image, index) => (
                            <img
                                key={index}
                                src={image.url}
                                alt={image.alt}
                                style={{
                                    display: index === currentImageIndex ? 'block' : 'none',
                                    width: '100%',
                                    borderRadius: '18px',
                                    boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
                                    objectFit: 'cover',
                                    transition: 'opacity 0.5s ease-in-out',
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;