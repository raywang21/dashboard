import React from 'react';
import { ThemeProvider, CssBaseline, useTheme } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Notification } from './components/common';
import { TokenRefreshTimer } from './components/guards/TokenRefreshTimer';
import { router } from './routes';

// 主应用组件
function App() {
  const theme = useTheme();

  return (
    <AuthProvider>
      <NotificationProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <style>
            {`
              @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
              }
            `}
          </style>
          
          <TokenRefreshTimer />
          <RouterProvider router={router} />
          
          {/* 全局通知组件 - 放在这里确保所有页面都能看到 */}
          <Notification />
        </ThemeProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
