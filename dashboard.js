// Enterprise Dashboard with Material Design
// Using React 17 and Material-UI v5 (loaded via CDN)

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
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Avatar,
    Menu,
    MenuItem,
    useTheme,
    useMediaQuery,
    Divider,
    Chip,
    LinearProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
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

  // Mock data for dashboard
  const mockStats = [
    { title: '总用户数', value: '12,543', change: '+12%', trend: 'up' },
    { title: '活跃会话', value: '3,421', change: '+5%', trend: 'up' },
    { title: '转化率', value: '68.2%', change: '-2%', trend: 'down' },
    { title: '收入', value: '¥89,432', change: '+18%', trend: 'up' },
  ];

  const mockRecentActivity = [
    { id: 1, user: '张三', action: '登录系统', time: '2分钟前', status: 'success' },
    { id: 2, user: '李四', action: '更新配置', time: '5分钟前', status: 'info' },
    { id: 3, user: '王五', action: '删除数据', time: '10分钟前', status: 'warning' },
    { id: 4, user: '赵六', action: '导出报告', time: '15分钟前', status: 'success' },
  ];

  const mockTableData = [
    { id: 1, name: '项目 Alpha', status: '进行中', progress: 75, owner: '张三', deadline: '2024-01-15' },
    { id: 2, name: '项目 Beta', status: '已完成', progress: 100, owner: '李四', deadline: '2024-01-10' },
    { id: 3, name: '项目 Gamma', status: '待开始', progress: 0, owner: '王五', deadline: '2024-01-20' },
    { id: 4, name: '项目 Delta', status: '进行中', progress: 45, owner: '赵六', deadline: '2024-01-25' },
  ];

  // Stat Card Component
  function StatCard({ stat }) {
    const getTrendColor = (trend) => {
      return trend === 'up' ? '#4caf50' : '#f44336';
    };

    const getTrendIcon = (trend) => {
      return trend === 'up' ? 'trending_up' : 'trending_down';
    };

    return React.createElement(Card, { sx: { height: '100%' } },
      React.createElement(CardContent, null,
        React.createElement(Typography, { variant: "h3", component: "div", gutterBottom: true }, stat.value),
        React.createElement(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true }, stat.title),
        React.createElement(Box, { display: "flex", alignItems: "center", mt: 2 },
          React.createElement('span', { 
            className: "material-icons",
            style: { 
              fontSize: 16, 
              color: getTrendColor(stat.trend),
              marginRight: 8 
            }
          }, getTrendIcon(stat.trend)),
          React.createElement(Typography, { 
            variant: "body2",
            style: { color: getTrendColor(stat.trend) }
          }, stat.change)
        )
      )
    );
  }

  // Activity List Component
  function ActivityList() {
    const getStatusColor = (status) => {
      switch (status) {
        case 'success': return '#4caf50';
        case 'warning': return '#ff9800';
        case 'info': return '#2196f3';
        default: return '#757575';
      }
    };

    return React.createElement(Card, null,
      React.createElement(CardContent, null,
        React.createElement(Typography, { variant: "h6", gutterBottom: true }, "最近活动"),
        React.createElement(List, { dense: true },
          mockRecentActivity.map((activity) =>
            React.createElement(ListItem, { key: activity.id, sx: { px: 0 } },
              React.createElement(Box, { display: "flex", alignItems: "center", width: "100%" },
                React.createElement(Avatar, { sx: { width: 32, height: 32, mr: 2, bgcolor: 'primary.main' } }, activity.user[0]),
                React.createElement(Box, { flex: 1 },
                  React.createElement(Typography, { variant: "body2" },
                    React.createElement('strong', null, activity.user), " " + activity.action
                  ),
                  React.createElement(Typography, { variant: "caption", color: "text.secondary" }, activity.time)
                ),
                React.createElement('div', {
                  style: {
                    backgroundColor: getStatusColor(activity.status),
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                  }
                })
              )
            )
          )
        )
      )
    );
  }

  // Projects Table Component
  function ProjectsTable() {
    const getStatusColor = (status) => {
      switch (status) {
        case '进行中': return 'warning';
        case '已完成': return 'success';
        case '待开始': return 'default';
        default: return 'default';
      }
    };

    return React.createElement(Card, null,
      React.createElement(CardContent, null,
        React.createElement(Typography, { variant: "h6", gutterBottom: true }, "项目概览"),
        React.createElement(TableContainer, null,
          React.createElement(Table, { size: "small" },
            React.createElement(TableHead, null,
              React.createElement(TableRow, null,
                React.createElement(TableCell, null, "项目名称"),
                React.createElement(TableCell, null, "状态"),
                React.createElement(TableCell, null, "进度"),
                React.createElement(TableCell, null, "负责人"),
                React.createElement(TableCell, null, "截止日期")
              )
            ),
            React.createElement(TableBody, null,
              mockTableData.map((row) =>
                React.createElement(TableRow, { key: row.id },
                  React.createElement(TableCell, null, row.name),
                  React.createElement(TableCell, null,
                    React.createElement(Chip, {
                      label: row.status,
                      color: getStatusColor(row.status),
                      size: "small"
                    })
                  ),
                  React.createElement(TableCell, null,
                    React.createElement(Box, { display: "flex", alignItems: "center" },
                      React.createElement(Box, { width: "100%", mr: 1 },
                        React.createElement(LinearProgress, {
                          variant: "determinate",
                          value: row.progress,
                          sx: { height: 6, borderRadius: 3 }
                        })
                      ),
                      React.createElement(Box, { minWidth: 35 },
                        React.createElement(Typography, { variant: "body2" }, `${row.progress}%`)
                      )
                    )
                  ),
                  React.createElement(TableCell, null, row.owner),
                  React.createElement(TableCell, null, row.deadline)
                )
              )
            )
          )
        )
      )
    );
  }

  // Dashboard Content Component
  function DashboardContent() {
    return React.createElement(Box, null,
      // Page Title
      React.createElement(Typography, { variant: "h4", gutterBottom: true }, "欢迎回来"),
      React.createElement(Typography, { variant: "body1", color: "text.secondary", paragraph: true }, "这是您的企业仪表板概览"),

      // Stats Grid
      React.createElement(Grid, { container: true, spacing: 3, sx: { mb: 4 } },
        mockStats.map((stat, index) =>
          React.createElement(Grid, { item: true, xs: 12, sm: 6, md: 3, key: index },
            React.createElement(StatCard, { stat: stat })
          )
        )
      ),

      // Content Grid
      React.createElement(Grid, { container: true, spacing: 3 },
        React.createElement(Grid, { item: true, xs: 12, md: 8 },
          React.createElement(ProjectsTable, null)
        ),
        React.createElement(Grid, { item: true, xs: 12, md: 4 },
          React.createElement(ActivityList, null)
        )
      )
    );
  }

  // Placeholder components for other pages
  function PlaceholderContent({ title }) {
    return React.createElement(Box, { sx: { p: 3 } },
      React.createElement(Typography, { variant: "h4", gutterBottom: true }, title),
      React.createElement(Typography, { variant: "body1", color: "text.secondary" }, "此页面正在开发中...")
    );
  }

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
          return React.createElement(DashboardContent);
        case 'analysis':
          return window.StockAnalysis ? React.createElement(window.StockAnalysis) : 
                 React.createElement(PlaceholderContent, { title: "股票分析" });
        case 'reports':
          return React.createElement(PlaceholderContent, { title: "报告" });
        case 'users':
          return React.createElement(PlaceholderContent, { title: "用户管理" });
        case 'settings':
          return React.createElement(PlaceholderContent, { title: "设置" });
        default:
          return React.createElement(DashboardContent);
      }
    };

    // Get page title for header
    const getPageTitle = () => {
      const item = navigationItems.find(nav => nav.page === currentPage);
      return item ? item.text : '企业仪表板';
    };

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
