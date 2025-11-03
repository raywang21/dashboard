import React, { useState } from 'react';
import {
  Box,
  Typography,
  Drawer,
  useTheme,
  useMediaQuery,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu as UserMenu,
  MenuItem,
  Divider,
  Tooltip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { 
  EmailOutlined as EmailIcon,
  PersonOutlined as PersonIcon,
  ChevronLeft as ChevronLeftIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Description as DescriptionIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { Menu as MenuComponent } from '../menu';
import './Sidebar.css';

import { UserInfo } from '../../services/api';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  selectedMenuItem: string;
  onMenuItemClick: (item: any) => void;
  drawerWidth: number;
  onToggleCollapse?: () => void;
  collapsed?: boolean;
  onLogout?: () => void;
  user?: UserInfo | null;
}

// 底部用户信息配置数据
const getFooterItems = (user: UserInfo | null | undefined, notificationCount: number = 0) => [
  {
    id: 'notifications',
    text: '通知',
    icon: 'Notifications',
    badge: notificationCount > 0 ? notificationCount.toString() : undefined
  },
  {
    id: 'user-info',
    text: user?.username || 'Admin User',
    subText: user?.role || '管理员',
    icon: 'Person',
    avatar: user?.username?.charAt(0).toUpperCase() || 'A'
  }
];

const Sidebar: React.FC<SidebarProps> = ({
  open,
  onClose,
  selectedMenuItem,
  onMenuItemClick,
  drawerWidth,
  onToggleCollapse,
  collapsed = false,
  onLogout,
  user
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // 处理用户菜单打开
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  // 处理用户菜单关闭
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  // 处理退出登录确认对话框打开
  const handleLogoutClick = () => {
    setUserMenuAnchor(null);
    setLogoutDialogOpen(true);
  };

  // 处理退出登录确认
  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  // 处理退出登录取消
  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  // 处理菜单项点击
  const handleMenuAction = (action: string) => {
    setUserMenuAnchor(null);
    if (action === 'logout' && onLogout) {
      onLogout();
    } else if (action === 'system-info') {
      // 这里可以添加系统信息的处理逻辑
      console.log('系统信息');
    } else if (action === 'documentation') {
      // 这里可以添加文档的处理逻辑
      console.log('文档');
    } else if (action === 'system-settings') {
      // 这里可以添加系统设置的处理逻辑
      console.log('系统设置');
    } else if (action === 'change-password') {
      // 这里可以添加修改密码的处理逻辑
      console.log('修改密码');
    }
  };

  // 图标映射函数
  const getFooterIcon = (iconName: string, avatar?: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      Notifications: <EmailIcon />,
      Person: (
        <Box className="sidebar-user-avatar">
          {avatar}
        </Box>
      )
    };
    return iconMap[iconName] || <PersonIcon />;
  };

  const renderFooterItem = (item: any) => {
    if (item.id === 'user-info') {
      return (
                 <ListItem key={item.id} disablePadding className="menu-item">
           <ListItemButton 
             className="menu-item-button footer-item"
             onClick={handleUserMenuOpen}
           >
             <ListItemIcon className="menu-icon">
               {getFooterIcon(item.icon, item.avatar)}
             </ListItemIcon>
             
             {!collapsed && (
               <ListItemText
                 primary={
                   <Typography className="menu-text">
                     {item.text}
                   </Typography>
                 }
                 secondary={item.subText && (
                   <Typography variant="caption" className="sidebar-user-role">
                     {item.subText}
                   </Typography>
                 )}
               />
             )}
           </ListItemButton>
         </ListItem>
      );
    }

         return (
       <ListItem key={item.id} disablePadding className="menu-item">
         <Tooltip
           title={collapsed ? item.text : ''}
           placement="right"
           arrow
           disableHoverListener={!collapsed}
           componentsProps={{
             tooltip: {
               sx: {
                 backgroundColor: 'white',
                 color: 'black',
                 fontSize: '14px',
                 padding: '8px 12px',
                 boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                 border: '1px solid #e0e0e0',
                 '& .MuiTooltip-arrow': {
                   color: 'white',
                   borderColor: '#e0e0e0'
                 }
               }
             }
           }}
         >
           <ListItemButton 
             className="menu-item-button footer-item"
             onClick={() => item.id === 'notifications' && console.log('点击了通知')}
           >
             <ListItemIcon className="menu-icon">
               {item.id === 'notifications' ? (
                 <Badge 
                   badgeContent={item.badge} 
                   color="error"
                   invisible={!item.badge}
                   sx={{
                     '& .MuiBadge-badge': {
                       fontSize: '10px',
                       height: '16px',
                       minWidth: '16px',
                       padding: '0 4px'
                     }
                   }}
                 >
                   {getFooterIcon(item.icon, item.avatar)}
                 </Badge>
               ) : (
                 getFooterIcon(item.icon, item.avatar)
               )}
             </ListItemIcon>
             
             {!collapsed && (
               <ListItemText
                 primary={
                   <Typography className="menu-text">
                     {item.text}
                   </Typography>
                 }
                 secondary={item.subText && (
                   <Typography variant="caption" className="sidebar-user-role">
                     {item.subText}
                   </Typography>
                 )}
               />
             )}
           </ListItemButton>
         </Tooltip>
       </ListItem>
     );
  };

  const drawer = (
    <Box className="sidebar-drawer-content">
      {/* 顶部标题区域 */}
      <Box className="sidebar-header">
        {!collapsed ? (
          <Box className="sidebar-logo-container">
            <img 
              src="/logo.png" 
              alt="Shiny AI Gate Logo" 
              className="sidebar-logo"
            />
          </Box>
        ) : (
          <Box className="sidebar-title-icon">
            <Box className="sidebar-logo-small">
              <img 
                src="/logo.svg" 
                alt="Logo" 
                className="sidebar-logo-collapsed"
              />
            </Box>
          </Box>
        )}
      </Box>

              {/* 中间菜单区域 */}
        <Box className={`sidebar-menu-container ${collapsed ? 'collapsed' : ''}`}>
          <MenuComponent
            selectedItem={selectedMenuItem}
            onMenuItemClick={onMenuItemClick}
            collapsed={collapsed}
          />
        </Box>

                      {/* 底部用户信息区域 */}
        <Box className={`sidebar-footer ${collapsed ? 'collapsed' : ''}`}>
          {getFooterItems(user, 3).map(item => renderFooterItem(item))}
        </Box>

        {/* 用户下拉菜单 */}
        <UserMenu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleUserMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 140,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: 1,
            }
          }}
        >
          <MenuItem onClick={() => handleMenuAction('system-info')} sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="系统信息" primaryTypographyProps={{ fontSize: '0.8rem' }} />
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleMenuAction('documentation')} sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <DescriptionIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="文档" primaryTypographyProps={{ fontSize: '0.8rem' }} />
          </MenuItem>
          <MenuItem onClick={() => handleMenuAction('system-settings')} sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <AdminPanelSettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="系统设置" primaryTypographyProps={{ fontSize: '0.8rem' }} />
          </MenuItem>
          <MenuItem onClick={() => handleMenuAction('change-password')} sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <LockIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="修改密码" primaryTypographyProps={{ fontSize: '0.8rem' }} />
          </MenuItem>
          <Divider />
                     <MenuItem onClick={handleLogoutClick} sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <LogoutIcon fontSize="small" sx={{ color: 'error.main' }} />
            </ListItemIcon>
            <ListItemText 
              primary="退出登录" 
              primaryTypographyProps={{ 
                fontSize: '0.8rem',
                color: 'error.main'
              }} 
            />
          </MenuItem>
                 </UserMenu>

         {/* 退出登录确认对话框 */}
         <Dialog
           open={logoutDialogOpen}
           onClose={handleLogoutCancel}
           aria-labelledby="logout-dialog-title"
           aria-describedby="logout-dialog-description"
           PaperProps={{
             sx: {
               borderRadius: 2,
               minWidth: 400
             }
           }}
         >
           <DialogTitle id="logout-dialog-title" sx={{ pb: 1 }}>
             确认退出登录
           </DialogTitle>
           <DialogContent sx={{ pb: 2 }}>
             <DialogContentText id="logout-dialog-description">
               您确定要退出登录吗？退出后需要重新登录才能访问系统。
             </DialogContentText>
           </DialogContent>
           <DialogActions sx={{ px: 3, pb: 2 }}>
             <Button 
               onClick={handleLogoutCancel} 
               variant="outlined"
               sx={{ minWidth: 80 }}
             >
               取消
             </Button>
             <Button 
               onClick={handleLogoutConfirm} 
               variant="contained" 
               color="error"
               sx={{ minWidth: 80 }}
             >
               确认退出
             </Button>
           </DialogActions>
         </Dialog>

         {/* 展开收缩控制区域 */}
      <Box className="sidebar-collapse-control">
        <IconButton
          onClick={onToggleCollapse}
          className="sidebar-collapse-control-btn"
          size="small"
          title={collapsed ? "展开侧边栏" : "收缩侧边栏"}
        >
          <ChevronLeftIcon 
            sx={{ 
              transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }} 
          />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      className="sidebar-container"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        className="sidebar-drawer"
        sx={{
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth 
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
