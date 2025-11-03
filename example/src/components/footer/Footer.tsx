import React from 'react';
import { Box, Typography } from '@mui/material';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      className={className}
      sx={{
        backgroundColor: 'transparent',
        py: 2,
        textAlign: 'center'
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          fontSize: '0.875rem',
          opacity: 0.8
        }}
      >
        Copyright © {currentYear} 圣一信息
      </Typography>
    </Box>
  );
};
