import React from "react";
import { 
  Container, 
  Grid, 
  GridItem, 
  Heading, 
  Text, 
  Box, 
  Card, 
  CardBody, 
  Avatar, 
  Flex, 
  Stack,
  Icon
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import styles from "./TestimonialsSection.module.css";

// Component Rating tự tạo để thay thế Rating của MUI
const Rating = ({ value, max = 5 }) => {
  return (
    <Flex>
      {[...Array(max)].map((_, index) => (
        <Icon 
          key={index} 
          as={FaStar} 
          color={index < value ? "yellow.400" : "gray.300"} 
          mr={1}
        />
      ))}
    </Flex>
  );
};

const TestimonialsSection = ({ testimonials = [] }) => {
  return (
    <Box as="section" py={10} bg="gray.50" className={styles.testimonials}>
      <Container maxW="container.xl">
        <Box textAlign="center" mb={10}>
          <Heading as="h2" size="xl" mb={3} className={styles.testimonials__title}>
            Đánh Giá Từ Cộng Đồng
          </Heading>
          <Text fontSize="lg" color="gray.600" className={styles.testimonials__subtitle}>
            Những chia sẻ từ người dùng đã tham gia vào cộng đồng Pet Rescue Hub
          </Text>
        </Box>

        <Grid 
          templateColumns={{ 
            base: "1fr", 
            md: "repeat(2, 1fr)", 
            lg: "repeat(3, 1fr)" 
          }} 
          gap={6}
        >
          {testimonials.map((testimonial) => (
            <GridItem key={testimonial.id}>
              <Card 
                h="100%" 
                boxShadow="md" 
                borderRadius="lg" 
                overflow="hidden"
                className={styles.testimonials__card}
              >
                <CardBody>
                  <Rating value={testimonial.rating} />
                  <Text 
                    mt={4} 
                    fontSize="md" 
                    className={styles.testimonials__content}
                  >
                    "{testimonial.content}"
                  </Text>
                  <Flex mt={4} align="center">
                    <Avatar 
                      src={testimonial.avatar} 
                      name={testimonial.name} 
                      size="md" 
                      mr={3}
                      className={styles.testimonials__avatar}
                    />
                    <Stack spacing={0}>
                      <Text 
                        fontWeight="bold" 
                        fontSize="md"
                        className={styles.testimonials__name}
                      >
                        {testimonial.name}
                      </Text>
                      <Text 
                        fontSize="sm" 
                        color="gray.600"
                        className={styles.testimonials__role}
                      >
                        {testimonial.role}
                      </Text>
                    </Stack>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;