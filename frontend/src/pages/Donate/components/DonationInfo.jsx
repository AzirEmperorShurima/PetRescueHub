import React from 'react';
import { 
  Typography, 
  Card, 
  CardContent, 
  Divider, 
  Stack, 
  Box,
  Grid
} from '@mui/material';
import Pets from '@mui/icons-material/Pets';
import Favorite from '@mui/icons-material/Favorite';
import VolunteerActivism from '@mui/icons-material/VolunteerActivism';
import { motion } from 'framer-motion';

const DonationInfo = ({ rescueStats }) => {
  // Mapping icon names to components
  const getIcon = (iconName) => {
    switch(iconName) {
      case 'pets': return <Pets />;
      case 'favorite': return <Favorite />;
      case 'volunteer': return <VolunteerActivism />;
      default: return null;
    }
  };

  return (
    <Card elevation={0} className="donation-info-card">
      <CardContent>
        <Typography variant="body1" paragraph className="donation-text">
          PetRescueHub là nơi đem đến hy vọng và sự sống mới cho những người bạn nhỏ vô gia cư, mọi hoạt động của chúng tôi đều phụ thuộc hoàn toàn vào tấm lòng vàng từ cộng đồng. Mỗi tháng, nhóm phải đối mặt với những chi phí không nhỏ, bao gồm tiền thuê nhà, viện phí, thức ăn, điện, nước, thuốc men, cùng các vật dụng thiết yếu như bỉm, tã và đồ dùng.
        </Typography>
        
        <Typography variant="body1" paragraph className="donation-highlight" sx={{ 
          fontWeight: 'bold', 
          fontSize: '1.2rem', 
          color: '#e91e63',
          textAlign: 'center',
          padding: '15px',
          borderLeft: '4px solid #e91e63',
          backgroundColor: 'rgba(233, 30, 99, 0.05)',
          borderRadius: '0 8px 8px 0'
        }}>
          Hãy giúp chúng tôi lan tỏa lòng yêu thương, vì một thế giới mà không ai bị bỏ rơi.
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="body1" paragraph className="donation-text">
          Chi phí sẽ được chia đều cho các bé khác còn nằm viện và gây dựng nhà chung. Ngoài ra Nhóm cũng
          tiếp nhận quyên góp bằng hiện vật như:
        </Typography>
        
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
          {['Quần áo cũ', 'Bỉm', 'Găng tay y tế', 'Thức ăn', 'Cát vệ sinh'].map((item) => (
            <Box key={item} className="donation-tag">
              {item}
            </Box>
          ))}
        </Stack>
        
        <Box className="donation-note-container">
          <Typography variant="body2" className="donation-note">
            *Lưu ý: nhóm không dùng zalo và KHÔNG BAO GIỜ yêu cầu Mạnh Thường Quân cung cấp thông tin thẻ
            hoặc mã OTP
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DonationInfo;