// src/components/HeroSection.jsx
import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import heroBg from '../assets/hero-bg.svg';

const HeroSection = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        py: { xs: 5, md: 10 }, 
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          p: { xs: 2, md: 4 }, 
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ color: 'primary.main', fontSize: { xs: '2rem', md: '3rem' } }} // Responsive font size
        >
          Welcome to Chama DApp
        </Typography>
        <Typography
          variant="h6"
          component="p"
          gutterBottom
          sx={{ color: 'text.secondary', fontSize: { xs: '1rem', md: '1.25rem' } }}
        >
          Empowering decentralized savings groups with blockchain technology.
        </Typography>
      </Container>
    </Box>
  );
};

export default HeroSection;
