import React from 'react';
import { Box, Typography } from '@mui/material';

export const SystemConfig: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        系统配置
      </Typography>
      <Typography variant="body1" paragraph>
        管理系统级别的配置，包括日志级别、性能参数、安全设置等。
      </Typography>
      <Typography variant="body2" color="textSecondary">
        系统配置功能正在开发中...
      </Typography>
    </Box>
  );
};
