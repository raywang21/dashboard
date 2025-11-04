// Dashboard Content Component
// 仪表板页面内容组件 - 纯函数版本

// Dashboard Content Component - 纯函数，无内部状态
function DashboardContent({ data = {} }) {
  const { 
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    LinearProgress
  } = window.MaterialUI;

  // 从props获取数据，如果没有则使用默认数据
  const mockStats = data.stats || [
    { title: '总用户数', value: '12,543', change: '+12%', trend: 'up' },
    { title: '活跃会话', value: '3,421', change: '+5%', trend: 'up' },
    { title: '转化率', value: '68.2%', change: '-2%', trend: 'down' },
    { title: '收入', value: '¥89,432', change: '+18%', trend: 'up' },
  ];

  const mockRecentActivity = data.activities || [
    { id: 1, user: '张三', action: '登录系统', time: '2分钟前', status: 'success' },
    { id: 2, user: '李四', action: '更新配置', time: '5分钟前', status: 'info' },
    { id: 3, user: '王五', action: '删除数据', time: '10分钟前', status: 'warning' },
    { id: 4, user: '赵六', action: '导出报告', time: '15分钟前', status: 'success' },
  ];

  const mockTableData = data.projects || [
    { id: 1, name: '项目 Alpha', status: '进行中', progress: 75, owner: '张三', deadline: '2024-01-15' },
    { id: 2, name: '项目 Beta', status: '已完成', progress: 100, owner: '李四', deadline: '2024-01-10' },
    { id: 3, name: '项目 Gamma', status: '待开始', progress: 0, owner: '王五', deadline: '2024-01-20' },
    { id: 4, name: '项目 Delta', status: '进行中', progress: 45, owner: '赵六', deadline: '2024-01-25' },
  ];

  // Stat Card Component - 纯函数
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

  // Activity List Component - 纯函数
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

  // Projects Table Component - 纯函数
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

// Export for use in dashboard
window.DashboardContent = DashboardContent;
