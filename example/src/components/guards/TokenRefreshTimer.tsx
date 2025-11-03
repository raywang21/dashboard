import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const TokenRefreshTimer: React.FC = () => {
  const { token, checkTokenValidity, refreshTokenIfNeeded } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (token) {
      // 每5分钟检查一次token有效性
      intervalRef.current = setInterval(async () => {
        try {
          const isValid = await checkTokenValidity();
          if (!isValid) {
            // token无效，尝试刷新
            const refreshSuccess = await refreshTokenIfNeeded();
            if (!refreshSuccess) {
              // 刷新失败，清除定时器
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
            }
          }
        } catch (error) {
          console.error('Token refresh timer error:', error);
        }
      }, 5 * 60 * 1000); // 5分钟
    } else {
      // 没有token，清除定时器
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [token, checkTokenValidity, refreshTokenIfNeeded]);

  // 这个组件不渲染任何内容
  return null;
};
