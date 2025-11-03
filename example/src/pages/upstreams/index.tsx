import React from 'react';
import { Box, Typography } from '@mui/material';

export const Upstreams: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        上游服务
      </Typography>
      <Typography variant="body1" paragraph>
        管理上游服务配置，包括负载均衡策略、健康检查、服务发现等。
      </Typography>
      <Typography variant="body2" color="textSecondary">
        上游服务管理功能正在开发中...
      </Typography>
    </Box>
  );
};
