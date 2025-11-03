import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Home as HomeIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh', // 改为100vh，占满整个视口高度
          textAlign: 'center',
          backgroundColor: 'background.default', // 添加背景色
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 2,
            backgroundColor: 'background.paper',
            maxWidth: 500,
          }}
        >
          {/* 404 图标 */}
          <Box
            sx={{
              fontSize: '6rem',
              fontWeight: 'bold',
              color: 'text.secondary',
              mb: 2,
              lineHeight: 1,
            }}
          >
            404
          </Box>

          {/* 标题 */}
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ color: 'text.primary', mb: 2 }}
          >
            页面未找到
          </Typography>

          {/* 描述 */}
          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{ mb: 4, fontSize: '1.1rem' }}
          >
            抱歉，您访问的页面不存在或已被移动。
            <br />
            请检查URL是否正确，或使用下面的按钮返回。
          </Typography>

          {/* 操作按钮 */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
              size="large"
              sx={{ minWidth: 140 }}
            >
              返回首页
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              size="large"
              sx={{ minWidth: 140 }}
            >
              返回上页
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
