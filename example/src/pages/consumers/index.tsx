import React from 'react';
import { Box, Typography } from '@mui/material';

export const Consumers: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        消费者管理
      </Typography>
      <Typography variant="body1" paragraph>
        管理API消费者，包括认证信息、权限配置、使用统计等。
      </Typography>
      <Typography variant="body2" color="textSecondary">
        消费者管理功能正在开发中...
      </Typography>
    </Box>
  );
};
