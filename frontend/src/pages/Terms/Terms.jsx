import React, { useEffect } from 'react';
import { Container, Typography, Box, Divider, Paper } from '@mui/material';
import './Terms.css';

const Terms = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Container maxWidth="lg" className="terms-container">
      <Paper elevation={3} className="terms-paper">
        <Typography variant="h4" component="h1" className="terms-title">
          Điều khoản sử dụng & Chính sách riêng tư
        </Typography>
        <Typography variant="subtitle1" className="terms-updated">
          Cập nhật lần cuối: 06/05/2025
        </Typography>
        <Divider className="terms-divider" />

        <Box className="terms-section">
          <Typography variant="h5" component="h2" className="section-title">
            1. Giới thiệu
          </Typography>
          <Typography variant="body1" className="section-content">
            PetRescueHub là nền tảng tiên phong trong việc kết nối cộng đồng những người yêu thú cưng tại Việt Nam. Chúng tôi cam kết tạo ra một môi trường an toàn và đáng tin cậy, nơi mỗi thú cưng đều có cơ hội tìm được mái ấm mới và nhận được sự chăm sóc tốt nhất.
          </Typography>
        </Box>

        <Box className="terms-section">
          <Typography variant="h5" component="h2" className="section-title">
            2. Sử dụng dịch vụ
          </Typography>
          <Typography variant="body1" className="section-content">
            Bạn phải tuân thủ mọi chính sách có sẵn cho bạn trong Dịch vụ. Không được sử dụng Dịch vụ của chúng tôi sai mục đích. Ví dụ: không được can thiệp vào Dịch vụ của chúng tôi hoặc cố gắng truy cập chúng bằng phương pháp nào khác ngoài giao diện và hướng dẫn mà chúng tôi cung cấp.
          </Typography>
          <Typography variant="body1" className="section-content">
            Chúng tôi có thể đình chỉ hoặc ngừng cung cấp Dịch vụ cho bạn nếu bạn không tuân thủ các điều khoản hoặc chính sách của chúng tôi hoặc nếu chúng tôi đang điều tra hành vi bị nghi ngờ là sai phạm.
          </Typography>
        </Box>

        <Box className="terms-section">
          <Typography variant="h5" component="h2" className="section-title">
            3. Quyền riêng tư và bảo vệ bản quyền
          </Typography>
          <Typography variant="body1" className="section-content">
            Chính sách quyền riêng tư của PetRescueHub giải thích cách chúng tôi xử lý dữ liệu cá nhân của bạn và bảo vệ quyền riêng tư của bạn khi bạn sử dụng Dịch vụ của chúng tôi. Bằng cách sử dụng Dịch vụ của chúng tôi, bạn đồng ý rằng PetRescueHub có thể sử dụng dữ liệu đó theo chính sách quyền riêng tư của chúng tôi.
          </Typography>
        </Box>

        <Box className="terms-section">
          <Typography variant="h5" component="h2" className="section-title">
            4. Nội dung của bạn trong Dịch vụ của chúng tôi
          </Typography>
          <Typography variant="body1" className="section-content">
            Dịch vụ của chúng tôi cho phép bạn tải lên, gửi, lưu trữ hoặc nhận nội dung. Bạn vẫn giữ quyền sở hữu trí tuệ đối với nội dung đó. Tóm lại, những gì thuộc về bạn vẫn là của bạn.
          </Typography>
          <Typography variant="body1" className="section-content">
            Khi bạn tải lên, gửi, lưu trữ, gửi hoặc nhận nội dung đến hoặc thông qua Dịch vụ của chúng tôi, bạn cấp cho PetRescueHub (và những đối tác mà chúng tôi hợp tác) giấy phép toàn cầu để sử dụng, lưu trữ, sao chép, sửa đổi, tạo các tác phẩm phái sinh, truyền tải, xuất bản, hiển thị và phân phối công khai nội dung đó. Giấy phép bạn cấp cho PetRescueHub là nhằm mục đích vận hành, quảng bá và cải thiện Dịch vụ của chúng tôi, cũng như phát triển các dịch vụ mới.
          </Typography>
        </Box>

        <Box className="terms-section">
          <Typography variant="h5" component="h2" className="section-title">
            5. Bảo vệ thông tin cá nhân
          </Typography>
          <Typography variant="body1" className="section-content">
            Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Chúng tôi sẽ chỉ thu thập và sử dụng thông tin cá nhân của bạn theo cách được mô tả trong Chính sách Quyền riêng tư của chúng tôi và chỉ khi cần thiết để cung cấp dịch vụ hoặc thực hiện các nghĩa vụ pháp lý của chúng tôi.
          </Typography>
          <Typography variant="body1" className="section-content">
            Chúng tôi sẽ không chia sẻ thông tin cá nhân của bạn với bên thứ ba mà không có sự đồng ý của bạn, trừ khi được yêu cầu bởi pháp luật hoặc để bảo vệ quyền, tài sản hoặc sự an toàn cá nhân của chúng tôi hoặc người khác.
          </Typography>
        </Box>

        <Box className="terms-section">
          <Typography variant="h5" component="h2" className="section-title">
            6. Thay đổi và cập nhật
          </Typography>
          <Typography variant="body1" className="section-content">
            Chúng tôi có thể sửa đổi các Điều khoản này theo thời gian. Chúng tôi sẽ đăng bất kỳ sửa đổi nào lên trang web của chúng tôi và, nếu những thay đổi đó là đáng kể, chúng tôi sẽ cung cấp thông báo nổi bật hơn (bao gồm, đối với một số dịch vụ, thông báo qua email về các thay đổi đối với Điều khoản).
          </Typography>
          <Typography variant="body1" className="section-content">
            Nếu bạn không đồng ý với các Điều khoản đã sửa đổi, bạn nên ngừng sử dụng Dịch vụ của chúng tôi. Việc bạn tiếp tục sử dụng Dịch vụ sau khi các thay đổi có hiệu lực sẽ cấu thành sự chấp nhận của bạn đối với các Điều khoản đã sửa đổi.
          </Typography>
        </Box>

        <Box className="terms-section">
          <Typography variant="h5" component="h2" className="section-title">
            7. Liên hệ và Hỗ trợ
          </Typography>
          <Typography variant="body1" className="section-content">
            Đội ngũ hỗ trợ của PetRescueHub luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn. Liên hệ với chúng tôi qua:
            <ul>
              <li>Email: support@petrescuehub.com</li>
              <li>Hotline: 0984268233</li>
              <li>Văn phòng: 254 Nguyen Van Linh, TP.Da Nang</li>
            </ul>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Terms;