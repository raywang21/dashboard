// Enterprise Dashboard using React.createElement and Material UI v5

// Direct access to Material UI v5 from CDN (bound at runtime)
let mui;
let icons;

// Enhanced menu configuration matching example project
const menuItems = [
  { id: 'dashboard', text: '仪表板', icon: 'DashboardOutlined', path: '/dashboard' },
  { id: 'routes', text: '路由管理', icon: 'RouteOutlined', path: '/routes' },
  { id: 'upstreams', text: '上游服务', icon: 'TrendingUpOutlined', path: '/upstreams' },
  { id: 'consumers', text: '消费者管理', icon: 'PeopleOutlined', path: '/consumers' },
  { id: 'plugins', text: '插件配置', icon: 'ExtensionOutlined', path: '/plugins' },
  { id: 'ssl', text: 'SSL证书', icon: 'SecurityOutlined', path: '/ssl' },
  { id: 'system-config', text: '系统配置', icon: 'SettingsOutlined', path: '/system-config' }
];

// Icon mapping for Material-UI icons
const iconMap = {
  'DashboardOutlined': 'Dashboard',
  'RouteOutlined': 'Route', 
  'TrendingUpOutlined': 'TrendingUp',
  'PeopleOutlined': 'People',
  'ExtensionOutlined': 'Extension',
  'SecurityOutlined': 'Security',
  'SettingsOutlined': 'Settings',
  'Notifications': 'Notifications',
  'Person': 'Person',
  'ChevronLeft': 'ChevronLeft',
  'Menu': 'Menu',
  'AccountCircle': 'AccountCircle',
  'Refresh': 'Refresh',
  'Add': 'Add',
  'FileDownload': 'FileDownload',
  'MoreVert': 'MoreVert',
  'Logout': 'Logout',
  'Description': 'Description',
  'AdminPanelSettings': 'AdminPanelSettings',
  'Lock': 'Lock',
  'ShoppingCart': 'ShoppingCart',
  'Percent': 'Percent'
};

// Sidebar Header Component
function SidebarHeader({ collapsed }) {
  return React.createElement(mui.Box, {
    className: 'sidebar-header',
    sx: {
      padding: '16px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.18)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '64px',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    }
  },
    !collapsed ? (
      React.createElement(mui.Box, {
        className: 'sidebar-logo-container',
        sx: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
      },
        React.createElement('img', {
          src: '/logo.png',
          alt: 'Shiny AI Gate Logo',
          className: 'sidebar-logo',
          style: { height: '28px', width: 'auto', objectFit: 'contain' }
        })
      )
    ) : (
      React.createElement(mui.Box, {
        className: 'sidebar-title-icon',
        sx: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }
      },
        React.createElement(mui.Box, {
          className: 'sidebar-logo-small',
          sx: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
        },
          React.createElement('img', {
            src: '/logo.svg',
            alt: 'Logo',
            className: 'sidebar-logo-collapsed',
            style: { height: '32px', width: 'auto', objectFit: 'contain' }
          })
        )
      )
    )
  );
}

// Sidebar Menu Component
function SidebarMenu({ selectedItem, onMenuItemClick, collapsed }) {
  const handleItemClick = (item) => {
    if (onMenuItemClick) {
      onMenuItemClick(item);
    }
  };

  const getIcon = (iconName) => {
    const iconComponent = icons[iconMap[iconName] || icons.Dashboard];
    return iconComponent;
  };

  return React.createElement(mui.Box, {
    className: `sidebar-menu-container ${collapsed ? 'collapsed' : ''}`,
    sx: {
      flex: 1,
      overflow: 'hidden',
      display: 'flex',
      alignItems: collapsed ? 'center' : 'flex-start',
      padding: '16px 0'
    }
  },
    React.createElement(mui.List, {
      className: 'menu-list',
      sx: { padding: 0 }
    },
      menuItems.map((item) => 
        React.createElement(mui.ListItem, {
          key: item.id,
          disablePadding: true,
          className: `menu-item ${collapsed ? 'collapsed' : ''}`,
          sx: { margin: collapsed ? '0' : '0 8px', borderRadius: '4px', minHeight: '48px' }
        },
          React.createElement(mui.Tooltip, {
            title: collapsed ? item.text : '',
            placement: 'right',
            arrow: true,
            disableHoverListener: !collapsed,
            componentsProps: {
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
            }
          },
            React.createElement(mui.ListItemButton, {
              className: `menu-item-button ${selectedItem === item.id ? 'selected' : ''} ${collapsed ? 'collapsed' : ''}`,
              onClick: () => handleItemClick(item),
              sx: {
                padding: collapsed ? '12px 0' : '12px 16px 12px 8px',
                minHeight: '30px',
                borderRadius: '4px',
                margin: collapsed ? '0' : '0 8px 4px 8px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                transition: 'all 0.3s ease'
              }
            },
              React.createElement(mui.ListItemIcon, {
                className: `menu-icon ${collapsed ? 'collapsed' : ''}`,
        sx: { 
          minWidth: collapsed ? 'auto' : '36px',
          color: 'inherit',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start'
        }
              },
                getIcon(item.icon)
              ),
              
              !collapsed && React.createElement(mui.ListItemText, {
                primary: React.createElement(mui.Typography, {
                  className: 'menu-text',
                  sx: { fontWeight: '400', fontSize: '0.875rem', color: 'black' }
                }, item.text)
              })
            )
          )
        )
      )
    )
  );
}

// Sidebar Footer Component
function SidebarFooter({ collapsed, user, onLogout }) {
  const [userMenuAnchor, setUserMenuAnchor] = React.useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogoutClick = () => {
    setUserMenuAnchor(null);
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const footerItems = [
    {
      id: 'notifications',
      text: '通知',
      icon: 'Notifications',
      badge: '3'
    },
    {
      id: 'user-info',
      text: user?.username || 'Admin User',
      subText: user?.role || '管理员',
      icon: 'Person',
      avatar: user?.username?.charAt(0).toUpperCase() || 'A'
    }
  ];

  const getFooterIcon = (iconName, avatar) => {
    if (iconName === 'Notifications') {
      return React.createElement(icons[iconMap[iconName]]);
    } else if (iconName === 'Person' && avatar) {
      return React.createElement(mui.Box, {
        className: 'sidebar-user-avatar',
        sx: {
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: '#1976d2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold'
        }
      }, avatar);
    }
    return React.createElement(icons[iconMap[iconName]] || icons.Person);
  };

  const renderFooterItem = (item) => {
    if (item.id === 'user-info') {
      return React.createElement(mui.ListItem, {
        key: item.id,
        disablePadding: true,
        className: 'menu-item',
        sx: { margin: collapsed ? '0' : '0 8px' }
      },
        React.createElement(mui.ListItemButton, {
          className: `menu-item-button footer-item`,
          onClick: handleUserMenuOpen,
          sx: {
            minHeight: '40px',
            borderRadius: '0',
            justifyContent: collapsed ? 'center' : 'flex-start'
          }
        },
          React.createElement(mui.ListItemIcon, {
            className: 'menu-icon',
            sx: { 
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start'
            }
          },
            getFooterIcon(item.icon, item.avatar)
          ),
         
          !collapsed && React.createElement(mui.ListItemText, {
            primary: React.createElement(mui.Typography, {
              className: 'menu-text'
            }, item.text),
            secondary: item.subText && React.createElement(mui.Typography, {
              variant: 'caption',
              className: 'sidebar-user-role',
              sx: { color: 'black', fontSize: '12px' }
            }, item.subText)
          })
        )
      );
    }

    return React.createElement(mui.ListItem, {
      key: item.id,
      disablePadding: true,
      className: 'menu-item',
      sx: { margin: collapsed ? '0' : '0 8px' }
    },
      React.createElement(mui.Tooltip, {
        title: collapsed ? item.text : '',
        placement: 'right',
        arrow: true,
        disableHoverListener: !collapsed
      },
        React.createElement(mui.ListItemButton, {
          className: `menu-item-button footer-item`,
          onClick: () => item.id === 'notifications' && console.log('点击了通知'),
          sx: {
            minHeight: '40px',
            borderRadius: '0',
            justifyContent: collapsed ? 'center' : 'flex-start'
          }
        },
          React.createElement(mui.ListItemIcon, {
            className: 'menu-icon',
            sx: { 
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start'
            }
          },
            item.id === 'notifications' ? (
              React.createElement(mui.Badge, {
                badgeContent: item.badge,
                color: 'error',
                invisible: !item.badge,
                sx: {
                  '& .MuiBadge-badge': {
                    fontSize: '10px',
                    height: '16px',
                    minWidth: '16px',
                    padding: '0 4px'
                  }
                }
              },
                getFooterIcon(item.icon, item.avatar)
              )
            ) : (
              getFooterIcon(item.icon, item.avatar)
            )
          ),
         
          !collapsed && React.createElement(mui.ListItemText, {
            primary: React.createElement(mui.Typography, {
              className: 'menu-text'
            }, item.text)
          })
        )
      )
    );
  };

  return React.createElement(mui.Box, {
    className: `sidebar-footer ${collapsed ? 'collapsed' : ''}`,
    sx: {
      borderTop: '1px solid rgba(255, 255, 255, 0.18)',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.1) 100%)',
      padding: collapsed ? '8px 0' : '8px 16px'
    }
  },
    footerItems.map(item => renderFooterItem(item)),

    // User Menu
    React.createElement(mui.Menu, {
      anchorEl: userMenuAnchor,
      open: Boolean(userMenuAnchor),
      onClose: handleUserMenuClose,
      anchorOrigin: { vertical: 'top', horizontal: 'right' },
      transformOrigin: { vertical: 'top', horizontal: 'left' },
      PaperProps: {
        sx: {
          mt: 1,
          minWidth: 140,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 1
        }
      }
    },
      React.createElement(mui.MenuItem, { onClick: () => { handleUserMenuClose(); console.log('系统信息'); }, sx: { py: 0.5 } },
        React.createElement(mui.ListItemIcon, { sx: { minWidth: 28 } },
          React.createElement(icons.Settings, { fontSize: 'small' })
        ),
        React.createElement(mui.ListItemText, { primary: '系统信息', primaryTypographyProps: { fontSize: '0.8rem' } })
      ),
      React.createElement(mui.Divider),
      React.createElement(mui.MenuItem, { onClick: () => { handleUserMenuClose(); console.log('文档'); }, sx: { py: 0.5 } },
        React.createElement(mui.ListItemIcon, { sx: { minWidth: 28 } },
          React.createElement(icons.Description, { fontSize: 'small' })
        ),
        React.createElement(mui.ListItemText, { primary: '文档', primaryTypographyProps: { fontSize: '0.8rem' } })
      ),
      React.createElement(mui.MenuItem, { onClick: () => { handleUserMenuClose(); console.log('系统设置'); }, sx: { py: 0.5 } },
        React.createElement(mui.ListItemIcon, { sx: { minWidth: 28 } },
          React.createElement(icons.AdminPanelSettings, { fontSize: 'small' })
        ),
        React.createElement(mui.ListItemText, { primary: '系统设置', primaryTypographyProps: { fontSize: '0.8rem' } })
      ),
      React.createElement(mui.MenuItem, { onClick: () => { handleUserMenuClose(); console.log('修改密码'); }, sx: { py: 0.5 } },
        React.createElement(mui.ListItemIcon, { sx: { minWidth: 28 } },
          React.createElement(icons.Lock, { fontSize: 'small' })
        ),
        React.createElement(mui.ListItemText, { primary: '修改密码', primaryTypographyProps: { fontSize: '0.8rem' } })
      ),
      React.createElement(mui.Divider),
      React.createElement(mui.MenuItem, { onClick: handleLogoutClick, sx: { py: 0.5 } },
        React.createElement(mui.ListItemIcon, { sx: { minWidth: 28 } },
          React.createElement(icons.Logout, { fontSize: 'small', sx: { color: 'error.main' } })
        ),
        React.createElement(mui.ListItemText, { 
          primary: '退出登录', 
          primaryTypographyProps: { fontSize: '0.8rem', color: 'error.main' } 
        })
      )
    ),

    // Logout Confirmation Dialog
    React.createElement(mui.Dialog, {
      open: logoutDialogOpen,
      onClose: handleLogoutCancel,
      'aria-labelledby': 'logout-dialog-title',
      'aria-describedby': 'logout-dialog-description',
      PaperProps: {
        sx: { borderRadius: 2, minWidth: 400 }
      }
    },
      React.createElement(mui.DialogTitle, { id: 'logout-dialog-title', sx: { pb: 1 } },
        '确认退出登录'
      ),
      React.createElement(mui.DialogContent, { sx: { pb: 2 } },
        React.createElement(mui.DialogContentText, { id: 'logout-dialog-description' },
          '您确定要退出登录吗？退出后需要重新登录才能访问系统。'
        )
      ),
      React.createElement(mui.DialogActions, { sx: { px: 3, pb: 2 } },
        React.createElement(mui.Button, {
          onClick: handleLogoutCancel,
          variant: 'outlined',
          sx: { minWidth: 80 }
        }, '取消'),
        React.createElement(mui.Button, {
          onClick: handleLogoutConfirm,
          variant: 'contained',
          color: 'error',
          sx: { minWidth: 80 }
        }, '确认退出')
      )
    )
  );
}

// Collapse Control Component
function SidebarCollapseControl({ collapsed, onToggle }) {
  return React.createElement(mui.Box, {
    className: 'sidebar-collapse-control',
    sx: {
      padding: '8px 0',
      borderTop: '1px solid rgba(255, 255, 255, 0.18)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)'
    }
  },
    React.createElement(mui.IconButton, {
      onClick: onToggle,
      className: 'sidebar-collapse-control-btn',
      size: 'small',
      title: collapsed ? "展开侧边栏" : "收缩侧边栏",
      sx: {
        color: 'rgba(0, 0, 0, 0.7)',
        transition: 'all 0.3s ease',
        width: '32px',
        height: '32px',
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: collapsed ? '50%' : '8px'
      }
    },
      React.createElement(icons.ChevronLeft, {
        sx: {
          transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease'
        }
      })
    )
  );
}

// Enhanced Sidebar Component
function Sidebar({ open, onClose, selectedMenuItem, onMenuItemClick, drawerWidth = 240, onToggleCollapse, collapsed = false, onLogout, user }) {
  const theme = mui.useTheme();
  const isMobile = mui.useMediaQuery(theme.breakpoints.down('md'));

  const drawer = React.createElement(mui.Box, {
    className: 'sidebar-drawer-content',
    sx: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  },
    // Header
    React.createElement(SidebarHeader, { collapsed }),
    
    // Menu
    React.createElement(SidebarMenu, {
      selectedItem: selectedMenuItem,
      onMenuItemClick: onMenuItemClick,
      collapsed: collapsed
    }),

    // Footer
    React.createElement(SidebarFooter, {
      collapsed: collapsed,
      user: user,
      onLogout: onLogout
    }),

    // Collapse Control
    React.createElement(SidebarCollapseControl, {
      collapsed: collapsed,
      onToggle: onToggleCollapse
    })
  );

  return React.createElement(mui.Box, {
    component: 'nav',
    className: 'sidebar-container',
    sx: { width: { sm: drawerWidth }, flexShrink: { sm: 0 } }
  },
    React.createElement(mui.Drawer, {
      variant: isMobile ? "temporary" : "permanent",
      open: open,
      onClose: onClose,
      ModalProps: { keepMounted: true },
      className: 'sidebar-drawer',
      sx: {
        '& .MuiDrawer-paper': { 
          boxSizing: 'border-box', 
          width: drawerWidth,
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          color: 'rgba(0, 0, 0, 0.87)'
        }
      }
    },
      drawer
    )
  );
}

// Main Content Component
function MainContent() {
  return React.createElement(mui.Box, {
    sx: {
      flexGrow: 1,
      p: 3,
      bgcolor: 'background.default',
      minHeight: '100vh',
      paddingTop: '80px' // Space for fixed AppBar
    }
  },
    // Header
    React.createElement(mui.Box, {
      sx: {
        mb: 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    },
      React.createElement(mui.Typography, { variant: 'h4' },
        '仪表板概览'
      ),
      React.createElement(mui.Button, {
        variant: 'contained',
        startIcon: React.createElement(icons.Refresh, {})
      }, '刷新数据')
    ),
    
    // Stats Cards
    React.createElement(mui.Grid, { container: true, spacing: 3 },
      // Card 1
      React.createElement(mui.Grid, { item: true, xs: 12, sm: 6, md: 3 },
        React.createElement(mui.Card, {},
          React.createElement(mui.CardContent, {},
            React.createElement(mui.Box, {
              sx: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }
            },
              React.createElement(mui.Box, {},
                React.createElement(mui.Typography, { color: 'textSecondary', gutterBottom: true },
                  '总用户数'
                ),
                React.createElement(mui.Typography, { variant: 'h4' }, '1,234')
              ),
              React.createElement(mui.Avatar, {
                sx: { bgcolor: 'primary.main', width: 56, height: 56 }
              },
                React.createElement(icons.People, {})
              )
            )
          )
        )
      ),
      
      // Card 2
      React.createElement(mui.Grid, { item: true, xs: 12, sm: 6, md: 3 },
        React.createElement(mui.Card, {},
          React.createElement(mui.CardContent, {},
            React.createElement(mui.Box, {
              sx: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }
            },
              React.createElement(mui.Box, {},
                React.createElement(mui.Typography, { color: 'textSecondary', gutterBottom: true },
                  '今日收入'
                ),
                React.createElement(mui.Typography, { variant: 'h4' }, '¥12,345')
              ),
              React.createElement(mui.Avatar, {
                sx: { bgcolor: 'success.main', width: 56, height: 56 }
              },
                React.createElement(icons.TrendingUp, {})
              )
            )
          )
        )
      ),
      
      // Card 3
      React.createElement(mui.Grid, { item: true, xs: 12, sm: 6, md: 3 },
        React.createElement(mui.Card, {},
          React.createElement(mui.CardContent, {},
            React.createElement(mui.Box, {
              sx: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }
            },
              React.createElement(mui.Box, {},
                React.createElement(mui.Typography, { color: 'textSecondary', gutterBottom: true },
                  '订单数量'
                ),
                React.createElement(mui.Typography, { variant: 'h4' }, '567')
              ),
              React.createElement(mui.Avatar, {
                sx: { bgcolor: 'info.main', width: 56, height: 56 }
              },
                React.createElement(icons.ShoppingCart, {})
              )
            )
          )
        )
      ),
      
      // Card 4
      React.createElement(mui.Grid, { item: true, xs: 12, sm: 6, md: 3 },
        React.createElement(mui.Card, {},
          React.createElement(mui.CardContent, {},
            React.createElement(mui.Box, {
              sx: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }
            },
              React.createElement(mui.Box, {},
                React.createElement(mui.Typography, { color: 'textSecondary', gutterBottom: true },
                  '转化率'
                ),
                React.createElement(mui.Typography, { variant: 'h4' }, '3.2%')
              ),
              React.createElement(mui.Avatar, {
                sx: { bgcolor: 'warning.main', width: 56, height: 56 }
              },
                React.createElement(icons.Percent, {})
              )
            )
          )
        )
      )
    ),
    
    // Recent Activity
    React.createElement(mui.Grid, { container: true, spacing: 3, sx: { mt: 2 } },
      React.createElement(mui.Grid, { item: true, xs: 12, md: 8 },
        React.createElement(mui.Card, {},
          React.createElement(mui.CardHeader, {
            title: '最近活动',
            action: React.createElement(mui.IconButton, {},
              React.createElement(icons.MoreVert, {})
            )
          }),
          React.createElement(mui.CardContent, {},
            React.createElement(mui.Typography, { color: 'textSecondary' },
              '暂无数据显示'
            )
          )
        )
      ),
      
      React.createElement(mui.Grid, { item: true, xs: 12, md: 4 },
        React.createElement(mui.Card, {},
          React.createElement(mui.CardHeader, {
            title: '快速操作'
          }),
          React.createElement(mui.CardContent, {},
            React.createElement(mui.Box, { sx: { display: 'flex', flexDirection: 'column', gap: 1 } },
              React.createElement(mui.Button, {
                variant: 'outlined',
                fullWidth: true,
                startIcon: React.createElement(icons.Add, {})
              }, '新建用户'),
              React.createElement(mui.Button, {
                variant: 'outlined',
                fullWidth: true,
                startIcon: React.createElement(icons.FileDownload, {})
              }, '导出报告'),
              React.createElement(mui.Button, {
                variant: 'outlined',
                fullWidth: true,
                startIcon: React.createElement(icons.Settings, {})
              }, '系统设置')
            )
          )
        )
      )
    )
  );
}

// App Bar Component
function AppBar({ onMenuClick }) {
  return React.createElement(mui.AppBar, {
    position: 'fixed',
    sx: { zIndex: (theme) => theme.zIndex.drawer + 1 }
  },
    React.createElement(mui.Toolbar, {},
      React.createElement(mui.IconButton, {
        color: 'inherit',
        'aria-label': 'open drawer',
        edge: 'start',
        onClick: onMenuClick,
        sx: { mr: 2 }
      },
        React.createElement(icons.Menu, {})
      ),
      React.createElement(mui.Typography, {
        variant: 'h6',
        noWrap: true,
        component: 'div',
        sx: { flexGrow: 1 }
      }, '企业控制台'),
      React.createElement(mui.IconButton, { color: 'inherit' },
        React.createElement(icons.AccountCircle, {})
      )
    )
  );
}

// Main Dashboard Component
function Dashboard() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = React.useState('dashboard');
  const [user, setUser] = React.useState({ username: 'Admin User', role: '管理员' });
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuItemClick = (item) => {
    setSelectedMenuItem(item.id);
    console.log('Navigate to:', item.path);
    // Here you could implement actual navigation logic
  };

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    console.log('User logged out');
    // Here you could implement actual logout logic
    setUser(null);
  };
  
  return React.createElement(mui.Box, { sx: { display: 'flex' } },
    React.createElement(mui.CssBaseline),
    React.createElement(AppBar, { onMenuClick: handleDrawerToggle }),
    React.createElement(mui.Box, {
      component: 'nav',
      sx: { width: { sm: collapsed ? 80 : 240 }, flexShrink: { sm: 0 } }
    }),
    React.createElement(Sidebar, {
      open: mobileOpen,
      onClose: handleDrawerToggle,
      selectedMenuItem: selectedMenuItem,
      onMenuItemClick: handleMenuItemClick,
      drawerWidth: collapsed ? 80 : 240,
      onToggleCollapse: handleToggleCollapse,
      collapsed: collapsed,
      onLogout: handleLogout,
      user: user
    }),
    React.createElement(MainContent)
  );
}

// Initialize the dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Bind UMD globals (try a few common names) and log exactly which globals are present
  const muiCandidates = ['MaterialUI', '@mui/material', 'materialUI', 'Mui', 'mui'];
  const foundMui = [];
  for (let name of muiCandidates) {
    if (window[name]) foundMui.push(name);
  }

  if (foundMui.length === 0) {
    console.error('Material UI not found on window. Checked globals:', muiCandidates);
    return;
  }

  // Pick the first detected global to use
  mui = window[foundMui[0]];
  console.log('Detected Material UI globals on window:', foundMui, '-> using', foundMui[0]);

  // MUI Icons v5 does not provide a UMD bundle. Use a lightweight fallback proxy to
  // avoid runtime errors and keep the UI working without the icons package.
  console.warn('Material UI Icons v5 UMD is not available. Using lightweight fallback icons (simple spans).');
  icons = new Proxy({}, {
    get: function(target, prop) {
      // Return a simple functional component for any requested icon name.
      return function(props) {
        // Provide minimal visual hint and accept style props.
        const style = Object.assign({ display: 'inline-block', width: 20, height: 20, lineHeight: '20px', textAlign: 'center' }, (props && props.style) || {});
        return React.createElement('span', Object.assign({}, props, { style: style }), props && props.children ? props.children : '');
      };
    }
  });

  // Create theme now that mui is available
  const theme = mui.createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
    },
  });

  // App component that uses ThemeProvider from the bound mui
  function App() {
    return React.createElement(mui.ThemeProvider, { theme: theme },
      React.createElement(Dashboard)
    );
  }

  const appContainer = document.getElementById('app');
  if (appContainer) {
    ReactDOM.render(React.createElement(App), appContainer);
  }
});
