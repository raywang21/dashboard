import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { isAuthenticated, token, checkTokenValidity, isLoading } = useAuth();
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const lastValidationRef = useRef<number>(0);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      const now = Date.now();
      
      // 防抖：如果距离上次验证不到5秒，跳过
      if (now - lastValidationRef.current < 5000) {
        setIsValidating(false);
        return;
      }

      // 只有在需要认证且有token的情况下才验证
      if (requireAuth && token && !isAuthenticated) {
        try {
          console.log('AuthGuard: 验证token...');
          lastValidationRef.current = now;
          await checkTokenValidity();
        } catch (error) {
          console.error('Token validation failed:', error);
        }
      }
      setIsValidating(false);
    };

    // 清除之前的超时
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    // 延迟验证，避免频繁调用
    validationTimeoutRef.current = setTimeout(validateToken, 100);

    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, [requireAuth, token, isAuthenticated, checkTokenValidity]);

  // 显示加载状态
  if (isLoading || isValidating) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // 不需要认证的页面（如登录页）
  if (!requireAuth) {
    // 如果已经登录，重定向到仪表板
    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
  }

  // 需要认证但未登录，重定向到登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 已认证，显示子组件
  return <>{children}</>;
};
