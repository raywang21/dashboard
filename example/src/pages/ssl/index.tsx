import React from 'react';
import { Box, Typography } from '@mui/material';

export const SSL: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        SSL证书管理
      </Typography>
      <Typography variant="body1" paragraph>
        管理SSL证书，包括证书上传、更新、过期提醒等功能。
      </Typography>
      <Typography variant="body2" color="textSecondary">
        SSL证书管理功能正在开发中...
      </Typography>
    </Box>
  );
};
