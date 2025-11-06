// Enterprise Dashboard with Material Design
// Using React 17 and Material-UI v5 (loaded via CDN)
// 重构后的主仪表板文件 - 只包含核心基础设施和路由

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

  // 组件加载器 - 实现按需加载
  const componentLoader = {
    loadedComponents: new Set(),
    loadingComponents: new Set(),
    
    async loadComponent(componentName) {
      if (this.loadedComponents.has(componentName)) {
        return window[componentName];
      }
      
      if (this.loadingComponents.has(componentName)) {
        // 如果正在加载，等待加载完成
        return this.waitForComponent(componentName);
      }
      
      this.loadingComponents.add(componentName);
      
      try {
        console.log(`Loading component: ${componentName}`);
        
        // 根据组件名找到对应的文件名
        const fileName = this.getFileNameByComponent(componentName);
        
        // 动态导入组件文件
        const module = await import(`./pages/${fileName}.js`);
        
        // 等待一小段时间确保组件注册到window
        await new Promise(resolve => setTimeout(resolve, 100));
        
        this.loadingComponents.delete(componentName);
        this.loadedComponents.add(componentName);
        
        if (window[componentName]) {
          console.log(`Component loaded successfully: ${componentName}`);
          return window[componentName];
        } else {
          console.error(`Component not found after loading: ${componentName}`);
          return null;
        }
      } catch (error) {
        this.loadingComponents.delete(componentName);
        console.error(`Failed to load component ${componentName}:`, error);
        return null;
      }
    },
    
    // 等待组件加载完成
    waitForComponent(componentName, timeout = 10000) {
      return new Promise((resolve, reject) => {
        const startTime = Date.now();
        
        const checkComponent = () => {
          if (this.loadedComponents.has(componentName)) {
            resolve(window[componentName]);
            return;
          }
          
          if (Date.now() - startTime > timeout) {
            reject(new Error(`Component ${componentName} loading timeout`));
            return;
          }
          
          setTimeout(checkComponent, 100);
        };
        
        checkComponent();
      });
    },
    
    // 预加载组件
    async preloadComponent(componentName) {
      console.log(`Preloading component: ${componentName}`);
      return this.loadComponent(componentName);
    },
    
    // 预加载关键组件
    async preloadEssentialComponents() {
      console.log('Preloading essential components...');
      try {
        await this.preloadComponent('DashboardContent');
        console.log('Essential components preloaded successfully');
      } catch (error) {
        console.error('Failed to preload essential components:', error);
      }
    },
    
    // 根据URL参数智能预加载组件
    async preloadComponentFromUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      const pageFromUrl = urlParams.get('page');
      
      if (pageFromUrl && pageFromUrl !== 'dashboard') {
        const componentName = this.getComponentName(pageFromUrl);
        console.log(`Preloading component from URL: ${componentName}`);
        try {
          await this.preloadComponent(componentName);
          console.log(`URL component preloaded: ${componentName}`);
        } catch (error) {
          console.error(`Failed to preload URL component: ${componentName}`, error);
        }
      }
    },
    
    // 页面到组件名的映射（保持驼峰命名）
    pageToComponent: {
      'dashboard': 'DashboardContent',
      'analysis': 'StockAnalysis',
      'reports': 'Reports',
      'users': 'Users',
      'settings': 'Settings'
    },
    
    // 页面到文件名的映射（使用实际文件名）
    pageToFile: {
      'dashboard': 'dashboard-content',
      'analysis': 'stock-analysis',
      'reports': 'reports',
      'users': 'users',
      'settings': 'settings'
    },
    
    getComponentName(page) {
      return this.pageToComponent[page] || 'DashboardContent';
    },
    
    getFileNameByComponent(componentName) {
      // 根据组件名找到对应的页面，然后获取文件名
      for (const [page, comp] of Object.entries(this.pageToComponent)) {
        if (comp === componentName) {
          return this.pageToFile[page];
        }
      }
      return 'dashboard-content'; // 默认返回
    },
    
    // 检查组件是否正在加载
    isComponentLoading(componentName) {
      return this.loadingComponents.has(componentName);
    }
  };

  // 数据桥接 - 连接ClojureScript数据层
  const dataBridge = {
    // 获取模块数据
    getModuleData: (moduleKey) => {
      if (window.clojureBridge && window.clojureBridge.getModuleData) {
        return window.clojureBridge.getModuleData(moduleKey);
      }
      return {};
    },
    
    // 订阅数据变化
    subscribeToData: (callback) => {
      if (window.clojureBridge && window.clojureBridge.subscribeToData) {
        window.clojureBridge.subscribeToData(callback);
      }
    },
    
    // 更新模块数据
    updateModuleData: (moduleKey, data) => {
      if (window.clojureBridge && window.clojureBridge.updateModuleData) {
        window.clojureBridge.updateModuleData(moduleKey, data);
      }
    }
  };

  // Main Dashboard Component
  function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [loading, setLoading] = useState(false);
    const [moduleData, setModuleData] = useState({});
    const [componentLoading, setComponentLoading] = useState(true);
    const [urlPageLoading, setUrlPageLoading] = useState(false);
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

    // 订阅ClojureScript数据变化
    useEffect(() => {
      const unsubscribe = dataBridge.subscribeToData((moduleKey, data) => {
        setModuleData(prev => ({
          ...prev,
          [moduleKey]: data
        }));
      });
      
      return unsubscribe;
    }, []);

    // 初始化数据
    useEffect(() => {
      // 初始化各模块数据
      const initialData = {
        dashboard: dataBridge.getModuleData('dashboard'),
        reports: dataBridge.getModuleData('reports'),
        users: dataBridge.getModuleData('users'),
        settings: dataBridge.getModuleData('settings'),
        analysis: dataBridge.getModuleData('analysis')
      };
      setModuleData(initialData);
    }, []);

    // 预加载关键组件和URL指定的组件
    useEffect(() => {
      const preloadComponents = async () => {
        setComponentLoading(true);
        try {
          // 预加载基础组件
          await componentLoader.preloadEssentialComponents();
          
          // 智能预加载URL指定的组件
          await componentLoader.preloadComponentFromUrl();
          
          console.log('All components preloaded successfully');
        } catch (error) {
          console.error('Failed to preload components:', error);
        } finally {
          setComponentLoading(false);
        }
      };
      
      preloadComponents();
    }, []);

    // 改进的URL参数处理 - 确保组件加载完成后再设置页面
    useEffect(() => {
      const handleUrlPageChange = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const pageFromUrl = urlParams.get('page') || 'dashboard';
        
        if (pageFromUrl !== currentPage) {
          const componentName = componentLoader.getComponentName(pageFromUrl);
          
          // 如果组件还未加载，先加载组件
          if (!componentLoader.loadedComponents.has(componentName)) {
            setUrlPageLoading(true);
            try {
              await componentLoader.loadComponent(componentName);
              console.log(`URL page component loaded: ${componentName}`);
            } catch (error) {
              console.error(`Failed to load URL page component: ${componentName}`, error);
            } finally {
              setUrlPageLoading(false);
            }
          }
          
          // 现在可以安全地设置当前页面
          setCurrentPage(pageFromUrl);
        }
      };

      handleUrlPageChange();
    }, []); // 只在组件挂载时执行一次

    const handleSidebarToggle = () => {
      setSidebarOpen(!sidebarOpen);
    };

    const handleProfileMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
      setAnchorEl(null);
    };

    // 页面切换处理 - 实现懒加载
    const handleNavigationClick = async (page) => {
      if (page === currentPage) return;
      
      setLoading(true);
      
      try {
        const componentName = componentLoader.getComponentName(page);
        await componentLoader.loadComponent(componentName);
        
        // 组件加载完成后再设置页面和更新URL
        setCurrentPage(page);
        
        // 更新URL但不刷新页面
        const url = new URL(window.location);
        url.searchParams.set('page', page);
        window.history.pushState({}, '', url.toString());
      } catch (error) {
        console.error('Failed to load page:', error);
      } finally {
        setLoading(false);
      }
    };

    // 可复用的加载组件
    function LoadingSpinner({ message }) {
      return React.createElement(Box, { 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "200px",
        flexDirection: "column",
        gap: 2
      }, 
        React.createElement('div', { 
          style: { 
            width: '40px', 
            height: '40px', 
            border: '4px solid #e3f2fd', 
            borderTop: '4px solid #1976d2', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite' 
          } 
        }),
        React.createElement(Typography, { variant: "h6", color: "text.secondary" }, message)
      );
    }

    // 渲染当前页面内容
    const renderPageContent = () => {
      const componentName = componentLoader.getComponentName(currentPage);
      const Component = window[componentName];
      
      // 统一的加载状态处理
      if (urlPageLoading) {
        return React.createElement(LoadingSpinner, { message: `页面 ${currentPage} 加载中...` });
      }
      
      if (componentLoading && currentPage === 'dashboard') {
        return React.createElement(LoadingSpinner, { message: "仪表板初始化中..." });
      }
      
      if (componentLoader.isComponentLoading(componentName)) {
        return React.createElement(LoadingSpinner, { message: `组件 ${componentName} 加载中...` });
      }
      
      // 如果组件未加载，显示错误信息
      if (!Component) {
        return React.createElement(Box, { 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center", 
          alignItems: "center", 
          height: "200px",
          gap: 2
        }, 
          React.createElement(Typography, { variant: "h6", color: "error" }, `页面 ${currentPage} 加载失败`),
          React.createElement(Typography, { variant: "body2", color: "text.secondary" }, "请刷新页面重试")
        );
      }
      
      // 根据页面类型传递相应的数据和回调
      let componentData = {};
      let componentCallbacks = {};
      
      switch (currentPage) {
        case 'dashboard':
          componentData = moduleData.dashboard || {};
          componentCallbacks = {
            onStatsUpdate: (stats) => dataBridge.updateModuleData('dashboard', { ...moduleData.dashboard, stats }),
            onActivitiesUpdate: (activities) => dataBridge.updateModuleData('dashboard', { ...moduleData.dashboard, activities })
          };
          break;
        case 'reports':
          componentData = moduleData.reports || {};
          componentCallbacks = {
            onReportUpdate: (report) => console.log('Report updated:', report)
          };
          break;
        case 'users':
          componentData = moduleData.users || {};
          componentCallbacks = {
            onUserUpdate: (user) => console.log('User updated:', user)
          };
          break;
        case 'settings':
          componentData = moduleData.settings || {};
          componentCallbacks = {
            onSettingChange: (key, value) => dataBridge.updateModuleData('settings', { ...moduleData.settings, [key]: value })
          };
          break;
        case 'analysis':
          componentData = moduleData.analysis || {};
          componentCallbacks = {
            callCljsFunc: async (funcName, args) => {
              console.log(`Calling ${funcName} with args:`, args);
              
              // 优先使用 ClojureScript bridge
              if (window.clojureBridge && window.clojureBridge.callCljsFunc) {
                try {
                  const result = await window.clojureBridge.callCljsFunc(funcName, args);
                  console.log(`ClojureScript bridge result for ${funcName}:`, result);
                  return result;
                } catch (error) {
                  console.error(`ClojureScript bridge error for ${funcName}:`, error);
                }
              }
              
              // 备用方案：直接调用 API
              try {
                const res = await fetch("http://localhost:3001/execute-cljs", {
                  method: "POST",
                  headers: {"Content-Type": "application/json"},
                  body: JSON.stringify({funcName, args})
                });
                const result = await res.json();
                console.log(`API result for ${funcName}:`, result);
                return result;
              } catch (error) {
                console.error(`API error for ${funcName}:`, error);
                return { success: false, error: error.message };
              }
            },
            addLog: (message, type) => {
              if (window.clojureBridge && window.clojureBridge.addAnalysisLog) {
                window.clojureBridge.addAnalysisLog(message, type);
              }
            },
            clearLogs: () => {
              if (window.clojureBridge && window.clojureBridge.clearAnalysisLogs) {
                window.clojureBridge.clearAnalysisLogs();
              }
            },
            // 添加缺失的数据桥接函数
            updateModuleData: (moduleKey, data) => {
              console.log('dataBridge.updateModuleData called with:', moduleKey, data);
              if (window.clojureBridge && window.clojureBridge.updateModuleData) {
                window.clojureBridge.updateModuleData(moduleKey, data);
                console.log('Data updated via clojureBridge');
              } else {
                console.error('clojureBridge.updateModuleData not available:', {
                  bridge: !!window.clojureBridge,
                  updateModuleData: !!(window.clojureBridge && window.clojureBridge.updateModuleData)
                });
              }
            },
            getModuleData: (moduleKey) => {
              console.log('dataBridge.getModuleData called with:', moduleKey);
              if (window.clojureBridge && window.clojureBridge.getModuleData) {
                const result = window.clojureBridge.getModuleData(moduleKey);
                console.log('getModuleData result:', result);
                return result;
              } else {
                console.error('clojureBridge.getModuleData not available:', {
                  bridge: !!window.clojureBridge,
                  getModuleData: !!(window.clojureBridge && window.clojureBridge.getModuleData)
                });
                return {};
              }
            }
          };
          console.log('Analysis componentCallbacks created:', componentCallbacks);
          console.log('componentCallbacks.updateModuleData type:', typeof componentCallbacks.updateModuleData);
          console.log('componentCallbacks.getModuleData type:', typeof componentCallbacks.getModuleData);
          break;
      }
      
      return React.createElement(Component, { 
        data: {
          ...componentData,
          updateModuleData: componentCallbacks.updateModuleData,
          getModuleData: componentCallbacks.getModuleData,
          callCljsFunc: componentCallbacks.callCljsFunc,
          addLog: componentCallbacks.addLog,
          clearLogs: componentCallbacks.clearLogs
        }
      });
    };

    // Get page title for header
    const getPageTitle = () => {
      const item = navigationItems.find(nav => nav.page === currentPage);
      return item ? item.text : '企业仪表板';
    };

    const drawerWidth = sidebarOpen ? 240 : 0;

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
        loading ? 
          React.createElement(Box, { 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "200px" 
          }, 
            React.createElement(Typography, { variant: "h6" }, "页面加载中...")
          ) :
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
