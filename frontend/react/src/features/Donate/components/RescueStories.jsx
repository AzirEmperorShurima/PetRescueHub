import React from 'react';
import { 
  Typography, 
  Grid, 
  Box, 
  Button
} from '@mui/material';
import { motion } from 'framer-motion';

const RescueStories = ({ rescueImages }) => {
  return (
    <Box className="rescue-stories-section">
      <Typography variant="h4" className="rescue-section-title">
        Câu chuyện cứu hộ
      </Typography>
      
      <Grid container spacing={3} className="rescue-stories-container">
        <Grid item xs={12} md={4}>
          <motion.div 
            className="rescue-story-card"
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Box className="rescue-story-image" style={{ backgroundImage: `url(${rescueImages[0]})` }} />
            <Box className="rescue-story-content">
              <Typography variant="h6" className="rescue-story-title">Câu chuyện của Lucky</Typography>
              <Typography variant="body2" className="rescue-story-excerpt">
                Lucky được tìm thấy trong tình trạng bị bỏ rơi bên đường. Sau 3 tháng chăm sóc, Lucky đã tìm được gia đình mới...
              </Typography>
              <Button variant="outlined" className="read-more-btn">Đọc tiếp</Button>
            </Box>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <motion.div 
            className="rescue-story-card"
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Box className="rescue-story-image" style={{ backgroundImage: `url(${rescueImages[1]})` }} />
            <Box className="rescue-story-content">
              <Typography variant="h6" className="rescue-story-title">Hành trình của Mèo Mun</Typography>
              <Typography variant="body2" className="rescue-story-excerpt">
                Mèo Mun bị bỏ rơi khi chỉ mới 2 tháng tuổi. Nhờ sự giúp đỡ của cộng đồng, Mun đã vượt qua...
              </Typography>
              <Button variant="outlined" className="read-more-btn">Đọc tiếp</Button>
            </Box>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <motion.div 
            className="rescue-story-card"
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Box className="rescue-story-image" style={{ backgroundImage: `url(${rescueImages[2]})` }} />
            <Box className="rescue-story-content">
              <Typography variant="h6" className="rescue-story-title">Phép màu cho Bông</Typography>
              <Typography variant="body2" className="rescue-story-excerpt">
                Bông được tìm thấy trong tình trạng bị thương nặng. Sau nhiều tháng điều trị, Bông đã hồi phục...
              </Typography>
              <Button variant="outlined" className="read-more-btn">Đọc tiếp</Button>
            </Box>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RescueStories;