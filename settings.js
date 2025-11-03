// Settings Component for Dashboard
// 设置页面组件

// Settings Component
function Settings() {
  const { useState, useEffect } = React;
  const { 
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Switch,
    FormControlLabel,
    TextField,
    Divider,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Slider,
    Accordion,
    AccordionSummary,
    AccordionDetails
  } = window.MaterialUI;

  // Settings state
  const [settings, setSettings] = useState({
    // General Settings
    siteName: '企业仪表板',
    siteDescription: '企业级数据分析和可视化平台',
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    weeklyReports: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    
    // Appearance Settings
    theme: 'light',
    primaryColor: '#1976d2',
    fontSize: 'medium',
    
    // System Settings
    autoBackup: true,
    logLevel: 'info',
    maxFileSize: 10,
    cacheTimeout: 60
  });

  // Settings categories
  const settingsCategories = [
    { 
      id: 'general', 
      name: '常规设置', 
      icon: 'settings', 
      description: '基本系统配置'
    },
    { 
      id: 'notifications', 
      name: '通知设置', 
      icon: 'notifications', 
      description: '管理通知偏好'
    },
    { 
      id: 'security', 
      name: '安全设置', 
      icon: 'security', 
      description: '安全和隐私配置'
    },
    { 
      id: 'appearance', 
      name: '外观设置', 
      icon: 'palette', 
      description: '自定义界面外观'
    },
    { 
      id: 'system', 
      name: '系统设置', 
      icon: 'developer_board', 
      description: '高级系统配置'
    }
  ];

  // Handle setting change
  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // General Settings Component
  function GeneralSettings() {
    return React.createElement(Box, { sx: { '& > *': { mb: 3 } } },
      React.createElement(TextField, {
        fullWidth: true,
        label: "网站名称",
        value: settings.siteName,
        onChange: (e) => handleSettingChange('siteName', e.target.value)
      }),
      React.createElement(TextField, {
        fullWidth: true,
        label: "网站描述",
        multiline: true,
        rows: 3,
        value: settings.siteDescription,
        onChange: (e) => handleSettingChange('siteDescription', e.target.value)
      }),
      React.createElement(Grid, { container: true, spacing: 2 },
        React.createElement(Grid, { item: true, xs: 12, md: 6 },
          React.createElement(FormControl, { fullWidth: true },
            React.createElement(InputLabel, null, "语言"),
            React.createElement(Select, {
              value: settings.language,
              onChange: (e) => handleSettingChange('language', e.target.value)
            },
              React.createElement(MenuItem, { value: 'zh-CN' }, '简体中文'),
              React.createElement(MenuItem, { value: 'en-US' }, 'English'),
              React.createElement(MenuItem, { value: 'ja-JP' }, '日本語')
            )
          )
        ),
        React.createElement(Grid, { item: true, xs: 12, md: 6 },
          React.createElement(FormControl, { fullWidth: true },
            React.createElement(InputLabel, null, "时区"),
            React.createElement(Select, {
              value: settings.timezone,
              onChange: (e) => handleSettingChange('timezone', e.target.value)
            },
              React.createElement(MenuItem, { value: 'Asia/Shanghai' }, 'Asia/Shanghai'),
              React.createElement(MenuItem, { value: 'UTC' }, 'UTC'),
              React.createElement(MenuItem, { value: 'America/New_York' }, 'America/New_York')
            )
          )
        )
      )
    );
  }

  // Notification Settings Component
  function NotificationSettings() {
    return React.createElement(Box, { sx: { '& > *': { mb: 2 } } },
      React.createElement(FormControlLabel, {
        control: React.createElement(Switch, {
          checked: settings.emailNotifications,
          onChange: (e) => handleSettingChange('emailNotifications', e.target.checked)
        }),
        label: "邮件通知"
      }),
      React.createElement(FormControlLabel, {
        control: React.createElement(Switch, {
          checked: settings.pushNotifications,
          onChange: (e) => handleSettingChange('pushNotifications', e.target.checked)
        }),
        label: "推送通知"
      }),
      React.createElement(FormControlLabel, {
        control: React.createElement(Switch, {
          checked: settings.smsNotifications,
          onChange: (e) => handleSettingChange('smsNotifications', e.target.checked)
        }),
        label: "短信通知"
      }),
      React.createElement(FormControlLabel, {
        control: React.createElement(Switch, {
          checked: settings.weeklyReports,
          onChange: (e) => handleSettingChange('weeklyReports', e.target.checked)
        }),
        label: "周报提醒"
      })
    );
  }

  // Security Settings Component
  function SecuritySettings() {
    return React.createElement(Box, { sx: { '& > *': { mb: 3 } } },
      React.createElement(FormControlLabel, {
        control: React.createElement(Switch, {
          checked: settings.twoFactorAuth,
          onChange: (e) => handleSettingChange('twoFactorAuth', e.target.checked)
        }),
        label: "双因素认证"
      }),
      React.createElement(Box, null,
        React.createElement(Typography, { variant: "body2", gutterBottom: true }, 
          `会话超时时间: ${settings.sessionTimeout} 分钟`
        ),
        React.createElement(Slider, {
          value: settings.sessionTimeout,
          onChange: (e, value) => handleSettingChange('sessionTimeout', value),
          min: 5,
          max: 120,
          step: 5,
          marks: [
            { value: 5, label: '5分钟' },
            { value: 30, label: '30分钟' },
            { value: 60, label: '1小时' },
            { value: 120, label: '2小时' }
          ]
        })
      ),
      React.createElement(Box, null,
        React.createElement(Typography, { variant: "body2", gutterBottom: true }, 
          `密码过期时间: ${settings.passwordExpiry} 天`
        ),
        React.createElement(Slider, {
          value: settings.passwordExpiry,
          onChange: (e, value) => handleSettingChange('passwordExpiry', value),
          min: 30,
          max: 365,
          step: 15,
          marks: [
            { value: 30, label: '30天' },
            { value: 90, label: '90天' },
            { value: 180, label: '180天' },
            { value: 365, label: '1年' }
          ]
        })
      )
    );
  }

  // Appearance Settings Component
  function AppearanceSettings() {
    return React.createElement(Box, { sx: { '& > *': { mb: 3 } } },
      React.createElement(FormControl, { fullWidth: true },
        React.createElement(InputLabel, null, "主题"),
        React.createElement(Select, {
          value: settings.theme,
          onChange: (e) => handleSettingChange('theme', e.target.value)
        },
          React.createElement(MenuItem, { value: 'light' }, '浅色主题'),
          React.createElement(MenuItem, { value: 'dark' }, '深色主题'),
          React.createElement(MenuItem, { value: 'auto' }, '跟随系统')
        )
      ),
      React.createElement(TextField, {
        fullWidth: true,
        label: "主题色",
        type: "color",
        value: settings.primaryColor,
        onChange: (e) => handleSettingChange('primaryColor', e.target.value)
      }),
      React.createElement(FormControl, { fullWidth: true },
        React.createElement(InputLabel, null, "字体大小"),
        React.createElement(Select, {
          value: settings.fontSize,
          onChange: (e) => handleSettingChange('fontSize', e.target.value)
        },
          React.createElement(MenuItem, { value: 'small' }, '小'),
          React.createElement(MenuItem, { value: 'medium' }, '中'),
          React.createElement(MenuItem, { value: 'large' }, '大')
        )
      )
    );
  }

  // System Settings Component
  function SystemSettings() {
    return React.createElement(Box, { sx: { '& > *': { mb: 3 } } },
      React.createElement(FormControlLabel, {
        control: React.createElement(Switch, {
          checked: settings.autoBackup,
          onChange: (e) => handleSettingChange('autoBackup', e.target.checked)
        }),
        label: "自动备份"
      }),
      React.createElement(FormControl, { fullWidth: true },
        React.createElement(InputLabel, null, "日志级别"),
        React.createElement(Select, {
          value: settings.logLevel,
          onChange: (e) => handleSettingChange('logLevel', e.target.value)
        },
          React.createElement(MenuItem, { value: 'debug' }, 'Debug'),
          React.createElement(MenuItem, { value: 'info' }, 'Info'),
          React.createElement(MenuItem, { value: 'warning' }, 'Warning'),
          React.createElement(MenuItem, { value: 'error' }, 'Error')
        )
      ),
      React.createElement(Box, null,
        React.createElement(Typography, { variant: "body2", gutterBottom: true }, 
          `最大文件大小: ${settings.maxFileSize} MB`
        ),
        React.createElement(Slider, {
          value: settings.maxFileSize,
          onChange: (e, value) => handleSettingChange('maxFileSize', value),
          min: 1,
          max: 100,
          step: 1,
          marks: [
            { value: 1, label: '1MB' },
            { value: 10, label: '10MB' },
            { value: 50, label: '50MB' },
            { value: 100, label: '100MB' }
          ]
        })
      )
    );
  }

  // Render settings content based on category
  const renderSettingsContent = (categoryId) => {
    switch (categoryId) {
      case 'general':
        return React.createElement(GeneralSettings);
      case 'notifications':
        return React.createElement(NotificationSettings);
      case 'security':
        return React.createElement(SecuritySettings);
      case 'appearance':
        return React.createElement(AppearanceSettings);
      case 'system':
        return React.createElement(SystemSettings);
      default:
        return React.createElement(GeneralSettings);
    }
  };

  return React.createElement(Box, { sx: { p: 3 } },
    // Page Title
    React.createElement(Typography, { variant: "h4", gutterBottom: true }, "系统设置"),
    React.createElement(Typography, { variant: "body1", color: "text.secondary", paragraph: true }, "配置系统参数和用户偏好"),

    // Main Content Grid
    React.createElement(Grid, { container: true, spacing: 3 },
      // Settings Categories
      React.createElement(Grid, { item: true, xs: 12, md: 3 },
        React.createElement(Card, null,
          React.createElement(CardContent, null,
            React.createElement(Typography, { variant: "h6", gutterBottom: true }, "设置分类"),
            React.createElement(List, { dense: true },
              settingsCategories.map((category) =>
                React.createElement(ListItem, { 
                  button: true, 
                  key: category.id, 
                  sx: { borderRadius: 1, mb: 0.5 }
                },
                  React.createElement(ListItemIcon, null,
                    React.createElement('span', { className: "material-icons" }, category.icon)
                  ),
                  React.createElement(ListItemText, { 
                    primary: category.name,
                    secondary: category.description
                  })
                )
              )
            )
          )
        )
      ),

      // Settings Content
      React.createElement(Grid, { item: true, xs: 12, md: 9 },
        React.createElement(Card, null,
          React.createElement(CardContent, null,
            React.createElement(Typography, { variant: "h6", gutterBottom: true }, "常规设置"),
            React.createElement(Divider, { sx: { mb: 3 } }),
            renderSettingsContent('general'),
            React.createElement(Box, { mt: 4, pt: 2, borderTop: '1px solid #e0e0e0' },
              React.createElement(Box, { display: "flex", justifyContent: "space-between" },
                React.createElement(Button, { variant: "outlined" }, "重置为默认"),
                React.createElement(Button, { variant: "contained" }, "保存设置")
              )
            )
          )
        )
      )
    )
  );
}

// Export for use in dashboard
window.Settings = Settings;
