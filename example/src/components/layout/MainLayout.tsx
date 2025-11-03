import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { Sidebar } from '../sidebar';
import { Footer } from '../footer';
import { useAuth } from '../../contexts/AuthContext';


// 侧边栏宽度
const drawerWidth = 200;

export const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [open, setOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(true);

  // 根据当前路径获取选中的菜单项
  const getSelectedMenuItem = () => {
    const currentPath = location.pathname;
    
    // 路径到菜单ID的映射
    const pathToMenuId: Record<string, string> = {
      '/dashboard': 'dashboard',
      '/routes': 'routes',
      '/upstreams': 'upstreams',
      '/consumers': 'consumers',
      '/plugins': 'plugins',
      '/ssl': 'ssl',
      '/system-config': 'system-config',
    };
    
    return pathToMenuId[currentPath] || 'dashboard';
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuItemClick = (item: any) => {
    navigate(item.path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sidebar
        open={open}
        onClose={handleDrawerToggle}
        selectedMenuItem={getSelectedMenuItem()}
        onMenuItemClick={handleMenuItemClick}
        drawerWidth={collapsed ? 64 : drawerWidth}
        onToggleCollapse={handleToggleCollapse}
        collapsed={collapsed}
        onLogout={handleLogout}
        user={user}
      />

      {/* 主内容区域 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: { sm: `calc(100% - ${collapsed ? 64 : drawerWidth}px)` },
        }}
      >
        {/* 页面内容 */}
        <Box sx={{ flex: 1, p: 3 }}>
          <Outlet />
        </Box>
        
        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  );
};
