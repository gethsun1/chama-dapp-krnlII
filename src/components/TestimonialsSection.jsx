// src/components/TestimonialsSection.jsx
import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia } from '@mui/material';

const testimonials = [
  {
    id: 1,
    image: '/assets/community1.jpg', // adjust with your asset paths
    memberIcon: '/assets/member1.jpg',
    story: 'Chama DApp transformed our savings group!',
    name: 'John Doe',
  },
  {
    id: 2,
    image: '/assets/community2.jpg',
    memberIcon: '/assets/member2.jpg',
    story: 'A revolutionary platform for community growth.',
    name: 'Jane Smith',
  },
];

const TestimonialsSection = () => {
  return (
    <Box sx={{ py: 5, backgroundColor: 'background.default' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Community Stories
      </Typography>
      <Box sx={{ display: 'flex', overflowX: 'auto', py: 2, px: 2 }}>
        {testimonials.map((item) => (
          <Card
            key={item.id}
            sx={{
              minWidth: 300,
              mx: 2,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 6,
              },
            }}
          >
            <CardMedia
              component="img"
              height="140"
              image={item.image}
              alt="Community"
            />
            <CardContent>
              <Typography variant="body1" gutterBottom>
                {item.story}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <CardMedia
                  component="img"
                  image={item.memberIcon}
                  alt={item.name}
                  sx={{ width: 40, height: 40, borderRadius: '50%', mr: 1 }}
                />
                <Typography variant="subtitle2">{item.name}</Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default TestimonialsSection;
