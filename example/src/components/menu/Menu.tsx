import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip
} from '@mui/material';
import {
  DashboardOutlined as DashboardIcon,
  RouteOutlined as RouteIcon,
  TrendingUpOutlined as TrendingUpIcon,
  PeopleOutlined as PeopleIcon,
  ExtensionOutlined as ExtensionIcon,
  SecurityOutlined as SecurityIcon,
  SettingsOutlined as SettingsIcon
} from '@mui/icons-material';
import './Menu.css';

// 定义MenuItem接口
interface MenuItem {
  id: string;
  text: string;
  icon: string;
  path: string;
  badge?: string | number;
  disabled?: boolean;
}

// 图标映射
const iconMap: Record<string, React.ReactNode> = {
  dashboard: <DashboardIcon />,
  routes: <RouteIcon />,
  upstreams: <TrendingUpIcon />,
  consumers: <PeopleIcon />,
  plugins: <ExtensionIcon />,
  ssl: <SecurityIcon />,
  'system-config': <SettingsIcon />,
};

// 菜单配置数据
const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    text: '仪表板',
    icon: 'dashboard',
    path: '/dashboard'
  },
  {
    id: 'routes',
    text: '路由管理',
    icon: 'routes',
    path: '/routes'
  },
  {
    id: 'upstreams',
    text: '上游服务',
    icon: 'upstreams',
    path: '/upstreams'
  },
  {
    id: 'consumers',
    text: '消费者管理',
    icon: 'consumers',
    path: '/consumers'
  },
  {
    id: 'plugins',
    text: '插件配置',
    icon: 'plugins',
    path: '/plugins'
  },
  {
    id: 'ssl',
    text: 'SSL证书',
    icon: 'ssl',
    path: '/ssl'
  },
  {
    id: 'system-config',
    text: '系统配置',
    icon: 'system-config',
    path: '/system-config'
  }
];

interface MenuProps {
  onMenuItemClick?: (item: MenuItem) => void;
  selectedItem?: string;
  collapsed?: boolean;
}

const Menu: React.FC<MenuProps> = ({ 
  onMenuItemClick, 
  selectedItem, 
  collapsed = false 
}) => {
  const handleItemClick = (item: MenuItem) => {
    if (onMenuItemClick) {
      onMenuItemClick(item);
    }
  };

  const getIcon = (iconName: string) => {
    return iconMap[iconName] || <DashboardIcon />;
  };

  return (
    <Box className="menu-container">
      <List className="menu-list">
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding className={`menu-item ${collapsed ? 'collapsed' : ''}`}>
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
                className={`menu-item-button ${selectedItem === item.id ? 'selected' : ''} ${collapsed ? 'collapsed' : ''}`}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
              >
                <ListItemIcon className="menu-icon">
                  {getIcon(item.icon)}
                </ListItemIcon>
                
                {!collapsed && (
                  <ListItemText
                    primary={
                      <Typography className="menu-text">
                        {item.text}
                      </Typography>
                    }
                  />
                )}
                
                {item.badge && !collapsed && (
                  <Box className="menu-badge">
                    {item.badge}
                  </Box>
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Menu;
