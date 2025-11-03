// Users Management Component for Dashboard
// 用户管理页面组件

// Users Component
function Users() {
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
    Chip,
    Avatar,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    InputAdornment,
    IconButton
  } = window.MaterialUI;

  // Mock data for users
  const mockUsers = [
    { 
      id: 1, 
      name: '张三', 
      email: 'zhangsan@example.com', 
      role: '管理员',
      status: '活跃',
      lastLogin: '2024-01-15 14:30',
      avatar: 'Z'
    },
    { 
      id: 2, 
      name: '李四', 
      email: 'lisi@example.com', 
      role: '编辑',
      status: '活跃',
      lastLogin: '2024-01-15 10:15',
      avatar: 'L'
    },
    { 
      id: 3, 
      name: '王五', 
      email: 'wangwu@example.com', 
      role: '用户',
      status: '离线',
      lastLogin: '2024-01-14 16:45',
      avatar: 'W'
    },
    { 
      id: 4, 
      name: '赵六', 
      email: 'zhaoliu@example.com', 
      role: '编辑',
      status: '活跃',
      lastLogin: '2024-01-15 09:20',
      avatar: 'Z'
    },
    { 
      id: 5, 
      name: '钱七', 
      email: 'qianqi@example.com', 
      role: '用户',
      status: '暂停',
      lastLogin: '2024-01-12 11:30',
      avatar: 'Q'
    }
  ];

  const userStats = [
    { label: '总用户数', value: '156', change: '+12%', icon: 'people' },
    { label: '活跃用户', value: '89', change: '+5%', icon: 'person' },
    { label: '新用户', value: '23', change: '+18%', icon: 'person_add' },
    { label: '在线用户', value: '34', change: '+8%', icon: 'online_prediction' }
  ];

  // User Stats Card Component
  function UserStatsCard({ stat }) {
    return React.createElement(Card, { sx: { height: '100%' } },
      React.createElement(CardContent, null,
        React.createElement(Box, { display: "flex", alignItems: "center", mb: 2 },
          React.createElement('span', { 
            className: "material-icons",
            style: { 
              fontSize: 32, 
              color: '#1976d2',
              marginRight: 16 
            }
          }, stat.icon),
          React.createElement(Box, null,
            React.createElement(Typography, { variant: "h4" }, stat.value),
            React.createElement(Typography, { variant: "body2", color: "text.secondary" }, stat.label)
          )
        ),
        React.createElement(Box, { display: "flex", alignItems: "center" },
          React.createElement('span', { 
            className: "material-icons",
            style: { 
              fontSize: 16, 
              color: '#4caf50',
              marginRight: 8 
            }
          }, 'trending_up'),
          React.createElement(Typography, { 
            variant: "body2",
            style: { color: '#4caf50' }
          }, stat.change)
        )
      )
    );
  }

  // Users Table Component
  function UsersTable() {
    const getStatusColor = (status) => {
      switch (status) {
        case '活跃': return 'success';
        case '离线': return 'default';
        case '暂停': return 'warning';
        default: return 'default';
      }
    };

    const getRoleColor = (role) => {
      switch (role) {
        case '管理员': return 'error';
        case '编辑': return 'primary';
        case '用户': return 'secondary';
        default: return 'default';
      }
    };

    return React.createElement(Card, null,
      React.createElement(CardContent, null,
        React.createElement(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 },
          React.createElement(Typography, { variant: "h6" }, "用户列表"),
          React.createElement(Button, { 
            variant: "contained",
            startIcon: React.createElement('span', { className: "material-icons" }, "person_add")
          }, "添加用户")
        ),
        React.createElement(TableContainer, null,
          React.createElement(Table, { size: "small" },
            React.createElement(TableHead, null,
              React.createElement(TableRow, null,
                React.createElement(TableCell, null, "用户"),
                React.createElement(TableCell, null, "邮箱"),
                React.createElement(TableCell, null, "角色"),
                React.createElement(TableCell, null, "状态"),
                React.createElement(TableCell, null, "最后登录"),
                React.createElement(TableCell, null, "操作")
              )
            ),
            React.createElement(TableBody, null,
              mockUsers.map((user) =>
                React.createElement(TableRow, { key: user.id },
                  React.createElement(TableCell, null,
                    React.createElement(Box, { display: "flex", alignItems: "center" },
                      React.createElement(Avatar, { sx: { width: 32, height: 32, mr: 2, bgcolor: 'primary.main' } }, user.avatar),
                      React.createElement(Typography, { variant: "body2", fontWeight: "bold" }, user.name)
                    )
                  ),
                  React.createElement(TableCell, null, user.email),
                  React.createElement(TableCell, null,
                    React.createElement(Chip, {
                      label: user.role,
                      color: getRoleColor(user.role),
                      size: "small"
                    })
                  ),
                  React.createElement(TableCell, null,
                    React.createElement(Chip, {
                      label: user.status,
                      color: getStatusColor(user.status),
                      size: "small"
                    })
                  ),
                  React.createElement(TableCell, null, user.lastLogin),
                  React.createElement(TableCell, null,
                    React.createElement(Box, { sx: { display: 'flex', gap: 1 } },
                      React.createElement(IconButton, { size: "small" },
                        React.createElement('span', { className: "material-icons" }, "edit")
                      ),
                      React.createElement(IconButton, { size: "small", color: "error" },
                        React.createElement('span', { className: "material-icons" }, "delete")
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    );
  }

  // User Actions Component
  function UserActions() {
    return React.createElement(Card, null,
      React.createElement(CardContent, null,
        React.createElement(Typography, { variant: "h6", gutterBottom: true }, "用户操作"),
        React.createElement(Box, { sx: { '& > *': { mb: 2 } } },
          React.createElement(TextField, {
            fullWidth: true,
            size: "small",
            placeholder: "搜索用户...",
            InputProps: {
              startAdornment: React.createElement(InputAdornment, { position: "start" },
                React.createElement('span', { className: "material-icons" }, "search")
              )
            }
          }),
          React.createElement(Button, { 
            variant: "outlined", 
            fullWidth: true,
            startIcon: React.createElement('span', { className: "material-icons" }, "download")
          }, "导出用户列表"),
          React.createElement(Button, { 
            variant: "outlined", 
            fullWidth: true,
            startIcon: React.createElement('span', { className: "material-icons" }, "upload")
          }, "批量导入用户"),
          React.createElement(Button, { 
            variant: "outlined", 
            fullWidth: true,
            startIcon: React.createElement('span', { className: "material-icons" }, "mail")
          }, "发送通知")
        )
      )
    );
  }

  // Recent Activity Component
  function RecentActivity() {
    const recentActivities = [
      { user: '张三', action: '登录系统', time: '2分钟前', icon: 'login' },
      { user: '李四', action: '修改密码', time: '5分钟前', icon: 'lock' },
      { user: '王五', action: '更新资料', time: '10分钟前', icon: 'person' },
      { user: '赵六', action: '注销登录', time: '15分钟前', icon: 'logout' }
    ];

    return React.createElement(Card, null,
      React.createElement(CardContent, null,
        React.createElement(Typography, { variant: "h6", gutterBottom: true }, "最近活动"),
        React.createElement(List, { dense: true },
          recentActivities.map((activity, index) =>
            React.createElement(ListItem, { key: index, sx: { px: 0 } },
              React.createElement(Box, { display: "flex", alignItems: "center", width: "100%" },
                React.createElement(ListItemIcon, null,
                  React.createElement('span', { className: "material-icons", style: { fontSize: 20 } }, activity.icon)
                ),
                React.createElement(Box, { flex: 1 },
                  React.createElement(Typography, { variant: "body2" },
                    React.createElement('strong', null, activity.user), " " + activity.action
                  ),
                  React.createElement(Typography, { variant: "caption", color: "text.secondary" }, activity.time)
                )
              )
            )
          )
        )
      )
    );
  }

  return React.createElement(Box, { sx: { p: 3 } },
    // Page Title
    React.createElement(Typography, { variant: "h4", gutterBottom: true }, "用户管理"),
    React.createElement(Typography, { variant: "body1", color: "text.secondary", paragraph: true }, "管理系统用户和权限设置"),

    // User Stats
    React.createElement(Grid, { container: true, spacing: 3, sx: { mb: 4 } },
      userStats.map((stat, index) =>
        React.createElement(Grid, { item: true, xs: 12, sm: 6, md: 3, key: index },
          React.createElement(UserStatsCard, { stat: stat })
        )
      )
    ),

    // Main Content Grid
    React.createElement(Grid, { container: true, spacing: 3 },
      // Users Table
      React.createElement(Grid, { item: true, xs: 12, md: 8 },
        React.createElement(UsersTable, null)
      ),

      // Sidebar
      React.createElement(Grid, { item: true, xs: 12, md: 4 },
        React.createElement(UserActions, null),
        React.createElement(Box, { mt: 2 },
          React.createElement(RecentActivity, null)
        )
      )
    )
  );
}

// Export for use in dashboard
window.Users = Users;
