// Enterprise Dashboard using React.createElement and Material UI v5

// Direct access to Material UI v5 from CDN (bound at runtime)
let mui;
let icons;

// Navigation menu items
const menuItems = [
  { text: '仪表板', icon: 'Dashboard', path: '/' },
  { text: '分析', icon: 'Analytics', path: '/analytics' },
  { text: '报告', icon: 'Assessment', path: '/reports' },
  { text: '用户', icon: 'People', path: '/users' },
  { text: '设置', icon: 'Settings', path: '/settings' }
];

// Sidebar Component
function Sidebar({ open, onClose }) {
  return React.createElement(mui.Drawer, {
    variant: 'temporary',
    open: open,
    onClose: onClose,
    PaperProps: {
      style: {
        width: 240,
        boxSizing: 'border-box',
      }
    }
  },
    React.createElement('div', { style: { width: 240 } },
      // Logo/Title
      React.createElement(mui.Box, {
        sx: {
          p: 2,
          bgcolor: 'primary.main',
          color: 'primary.contrastText'
        }
      },
        React.createElement(mui.Typography, { variant: 'h6', component: 'div' },
          '企业控制台'
        )
      ),
      
      // Navigation Menu
      React.createElement(mui.List, { sx: { pt: 0 } },
        menuItems.map((item, index) => 
          React.createElement(mui.ListItem, {
            key: item.text,
            button: true,
            onClick: () => console.log('Navigate to:', item.path)
          },
            React.createElement(mui.ListItemIcon, {},
              React.createElement(icons[item.icon], {})
            ),
            React.createElement(mui.ListItemText, {
              primary: item.text
            })
          )
        )
      )
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
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  return React.createElement(mui.Box, { sx: { display: 'flex' } },
    React.createElement(mui.CssBaseline),
    React.createElement(AppBar, { onMenuClick: handleDrawerToggle }),
    React.createElement(mui.Box, {
      component: 'nav',
      sx: { width: { sm: 240 }, flexShrink: { sm: 0 } }
    }),
    React.createElement(Sidebar, {
      open: mobileOpen,
      onClose: handleDrawerToggle
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
