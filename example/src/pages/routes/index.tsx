import React from 'react';
import { Box, Typography } from '@mui/material';

export const Routes: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        路由管理
      </Typography>
      <Typography variant="body1" paragraph>
        在这里可以管理所有的API路由配置，包括路由规则、上游服务绑定、插件配置等。
      </Typography>
      <Typography variant="body2" color="textSecondary">
        路由管理功能正在开发中...
      </Typography>
    </Box>
  );
};
