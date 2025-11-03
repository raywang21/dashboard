import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  VisibilityOutlined,
  VisibilityOffOutlined
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import './Login.css';
import { Footer } from '../../components/footer';

interface LoginFormData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const { showError, showSuccess } = useNotification();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: keyof LoginFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // 表单验证
    if (!formData.username.trim()) {
      console.log('显示错误通知：请输入用户名');
      showError('请输入用户名');
      return;
    }
    
    if (!formData.password.trim()) {
      console.log('显示错误通知：请输入密码');
      showError('请输入密码');
      return;
    }

    try {
      // 调用认证上下文的登录方法
      await login(formData.username, formData.password);
      // 显示登录成功通知
      showSuccess('登录成功!');
      // 登录成功后跳转到仪表板
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err: any) {
      console.log('登录错误：', err);
      // 处理不同类型的错误
      if (err.message) {
        console.log('显示错误通知：', err.message);
        showError(err.message);
      } else if (err.status === 401) {
        console.log('显示错误通知：用户名或密码错误');
        showError('用户名或密码错误');
      } else if (err.status === 500) {
        console.log('显示错误通知：服务器错误，请稍后重试');
        showError('服务器错误，请稍后重试');
      } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
        console.log('显示错误通知：网络连接失败，请检查网络设置');
        showError('网络连接失败，请检查网络设置');
      } else {
        console.log('显示错误通知：登录失败，请重试');
        showError('登录失败，请重试');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 添加登录页面样式到body
  React.useEffect(() => {
    document.body.classList.add('login-page');
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  return (
    <Box className="login-page-wrapper">
      <Container component="main" maxWidth="xs" className="login-container">
        <Box className="login-box">
          <Paper elevation={3} className="login-paper">
            {/* 登录图标 */}
            <Box className="login-header">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="login-logo"
              />
              <Typography component="h1" variant="h6" className="login-title">
                Shiny AI Gate Dashboard
              </Typography>
            </Box>

            {/* 登录表单 */}
            <Box component="form" onSubmit={handleSubmit} className="login-form">
              {/* 用户名输入框 */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="用户名"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleInputChange('username')}
                className="login-input"
                disabled={isLoading}
              />

              {/* 密码输入框 */}
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="密码"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange('password')}
                className="login-input"
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                        disabled={isLoading}
                      >
                        {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* 登录按钮 */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? '登录中...' : '登录'}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
      
      <Footer />
    </Box>
  );
};

export default Login;
