import React from 'react';
import pet2 from '../../../../assets/images/pet3.jpg';
import styles from './Inspiration.module.css';

const Inspiration = () => {
    return (
        <div className={styles.inspirationSection}>
            <div className={styles.inspirationContentRow}>
                <div className={styles.inspirationText}>
                    <p className={styles.inspirationTitle}>Tìm Tri Kỷ Của Bạn: Nhận Nuôi, Không Mua Bán</p>
                    <p>Chào mừng bạn đến với tình yêu thương vô điều kiện!</p>
                    <p>PetRescueHub tin rằng việc nhận nuôi thú cưng sẽ mang lại những điều kỳ diệu. Rất nhiều bạn nhỏ đang mong tìm được mái ấm trọn đời, hãy cùng chúng tôi viết nên câu chuyện hạnh phúc này.</p>
                </div>
                <div className={styles.inspirationImgWrapper}>
                    <img src={pet2} alt="" className={styles.inspirationImg} />
                </div>
            </div>
            <p className={styles.inspirationWhyTitle}>Vì Sao Chúng Ta Nên Đón Một Người Bạn Về Nhà?</p>
            <div className={styles.inspirationWhyGrid}>
                <div className={styles.inspirationWhyBox}>
                    <span>Thay đổi một cuộc đời, cứu một số phận:</span>
                    <p>Mỗi lần nhận nuôi là một trải nghiệm thay đổi cuộc đời. Bằng cách chọn nhận nuôi, bạn không chỉ mang đến một mái ấm yêu thương cho một thú cưng đang cần, mà còn giúp chúng thoát khỏi những bấp bênh của cuộc sống trong trại cứu hộ.</p>
                </div>
                <div className={styles.inspirationWhyBox}>
                    <span>Tình yêu vô điều kiện:</span>
                    <p>Không gì sánh bằng tình yêu và sự bầu bạn mà một người bạn bốn chân mang lại. Những thú cưng được nhận nuôi thường xây dựng mối liên kết bền chặt khó tả với gia đình mới của chúng, thể hiện lòng trung thành và biết ơn vượt trên mọi lời nói.</p>
                </div>
                <div className={styles.inspirationWhyBox}>
                    <span>Vô vàn lựa chọn:</span>
                    <p>Dù bạn đang tìm kiếm một chú chó con hiếu động, một người bạn lớn tuổi điềm tĩnh, hay một chú mèo đầy quyến rũ, sự đa dạng của các bé thú cưng đang chờ được nhận nuôi của chúng tôi đảm bảo rằng sẽ có một người bạn đồng hành hoàn hảo dành cho bạn.</p>
                </div>
            </div>
        </div>
    );
};

export default Inspiration;