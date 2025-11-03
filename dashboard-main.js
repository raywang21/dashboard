// Enterprise Dashboard with Material Design
// Using React 17 and Material-UI v5 (loaded via CDN)
// 重构后的主仪表板文件 - 只包含核心基础设施

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Check if MaterialUI is available
  if (!window.MaterialUI) {
    console.error('MaterialUI not found on window');
    return;
  }

  console.log('MaterialUI found:', window.MaterialUI);

  const { useState, useEffect } = React;
  const { 
    ThemeProvider, 
    createTheme,
    CssBaseline,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
    Avatar,
    Menu,
    MenuItem,
    useTheme,
    useMediaQuery,
    Divider
  } = window.MaterialUI;

  // Material Design 3 Theme
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#dc004e',
        light: '#ff5983',
        dark: '#9a0036',
        contrastText: '#ffffff',
      },
      background: {
        default: '#fafafa',
        paper: '#ffffff',
      },
      surface: {
        main: '#ffffff',
        variant: '#f5f5f5',
      },
      text: {
        primary: '#212121',
        secondary: '#757575',
      },
    },
    typography: {
      fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
      h1: {
        fontSize: '2.125rem',
        fontWeight: 300,
        lineHeight: 1.167,
      },
      h2: {
        fontSize: '1.5rem',
        fontWeight: 400,
        lineHeight: 1.2,
      },
      h3: {
        fontSize: '1.25rem',
        fontWeight: 500,
        lineHeight: 1.167,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.43,
      },
    },
    spacing: 8,
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: 12,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
    },
  });

  // Navigation items
  const navigationItems = [
    { text: '仪表板', icon: 'dashboard', page: 'dashboard' },
    { text: '分析', icon: 'analytics', page: 'analysis' },
    { text: '报告', icon: 'description', page: 'reports' },
    { text: '用户', icon: 'people', page: 'users' },
    { text: '设置', icon: 'settings', page: 'settings' },
  ];

  // Main Dashboard Component
  function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Auto-collapse sidebar on mobile
    useEffect(() => {
      if (isMobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    }, [isMobile]);

    const handleSidebarToggle = () => {
      setSidebarOpen(!sidebarOpen);
    };

    const handleProfileMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
      setAnchorEl(null);
    };

    const handleNavigationClick = (page) => {
      setCurrentPage(page);
    };

    const drawerWidth = sidebarOpen ? 240 : 0;

    // Render current page content
    const renderPageContent = () => {
      switch (currentPage) {
        case 'dashboard':
          return window.DashboardContent ? React.createElement(window.DashboardContent) : 
                 React.createElement(PlaceholderContent, { title: "仪表板" });
        case 'analysis':
          return window.StockAnalysis ? React.createElement(window.StockAnalysis) : 
                 React.createElement(PlaceholderContent, { title: "股票分析" });
        case 'reports':
          return window.Reports ? React.createElement(window.Reports) : 
                 React.createElement(PlaceholderContent, { title: "报告" });
        case 'users':
          return window.Users ? React.createElement(window.Users) : 
                 React.createElement(PlaceholderContent, { title: "用户管理" });
        case 'settings':
          return window.Settings ? React.createElement(window.Settings) : 
                 React.createElement(PlaceholderContent, { title: "设置" });
        default:
          return window.DashboardContent ? React.createElement(window.DashboardContent) : 
                 React.createElement(PlaceholderContent, { title: "仪表板" });
      }
    };

    // Get page title for header
    const getPageTitle = () => {
      const item = navigationItems.find(nav => nav.page === currentPage);
      return item ? item.text : '企业仪表板';
    };

    // Placeholder Content Component
    function PlaceholderContent({ title }) {
      const { Card, CardContent, Typography } = window.MaterialUI;
      
      return React.createElement(Box, { sx: { p: 3 } },
        React.createElement(Typography, { variant: "h4", gutterBottom: true }, title),
        React.createElement(Typography, { variant: "body1", color: "text.secondary" }, "此页面正在开发中...")
      );
    }

    return React.createElement(Box, { sx: { display: 'flex' } },
      // App Bar
      React.createElement(AppBar, {
        position: "fixed",
        sx: {
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(sidebarOpen && !isMobile && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }
      },
        React.createElement(Toolbar, null,
          React.createElement(IconButton, {
            color: "inherit",
            "aria-label": "open drawer",
            onClick: handleSidebarToggle,
            edge: "start",
            sx: {
              marginRight: 2,
              ...(sidebarOpen && !isMobile && { display: 'none' }),
            }
          },
            React.createElement('span', { className: "material-icons" }, "menu")
          ),
          React.createElement(Typography, { variant: "h6", noWrap: true, component: "div", sx: { flexGrow: 1 } }, getPageTitle()),
          React.createElement(IconButton, { color: "inherit", onClick: handleProfileMenuOpen },
            React.createElement(Avatar, { sx: { width: 32, height: 32, bgcolor: 'secondary.main' } }, "A")
          ),
          React.createElement(Menu, {
            anchorEl: anchorEl,
            open: Boolean(anchorEl),
            onClose: handleProfileMenuClose
          },
            React.createElement(MenuItem, { onClick: handleProfileMenuClose }, "个人资料"),
            React.createElement(MenuItem, { onClick: handleProfileMenuClose }, "设置"),
            React.createElement(Divider, null),
            React.createElement(MenuItem, { onClick: handleProfileMenuClose }, "退出登录")
          )
        )
      ),

      // Sidebar
      React.createElement(Drawer, {
        variant: isMobile ? 'temporary' : 'persistent',
        open: sidebarOpen,
        onClose: handleSidebarToggle,
        sx: {
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          },
        }
      },
        React.createElement(Toolbar, null),
        React.createElement(Box, { sx: { overflow: 'auto' } },
          React.createElement(List, null,
            navigationItems.map((item) =>
              React.createElement(ListItem, {
                button: true,
                key: item.text,
                selected: currentPage === item.page,
                onClick: () => handleNavigationClick(item.page),
                sx: {
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }
              },
                React.createElement(ListItemIcon, null,
                  React.createElement('span', { className: "material-icons" }, item.icon)
                ),
                React.createElement(ListItemText, { primary: item.text })
              )
            )
          )
        )
      ),

      // Main Content
      React.createElement(Box, {
        component: "main",
        sx: {
          flexGrow: 1,
          p: 3,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: isMobile ? 0 : `-${drawerWidth}px`,
          ...(sidebarOpen && !isMobile && {
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
          }),
        }
      },
        React.createElement(Toolbar, null),
        renderPageContent()
      )
    );
  }

  // App Component
  function App() {
    return React.createElement(
      ThemeProvider, 
      { theme: theme },
      React.createElement(CssBaseline),
      React.createElement(Dashboard)
    );
  }

  // Render app
  try {
    ReactDOM.render(
      React.createElement(App),
      document.getElementById('app')
    );
    console.log('Dashboard rendered successfully');
  } catch (error) {
    console.error('Error rendering dashboard:', error);
  }
});
