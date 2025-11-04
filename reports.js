// Reports Component for Dashboard
// 报告页面组件 - 纯函数版本

// Reports Component - 纯函数，无内部状态
function Reports({ data = {} }) {
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
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
  } = window.MaterialUI;

  // 从props获取数据，如果没有则使用默认数据
  const mockReports = data.reports || [
    { 
      id: 1, 
      name: '月度销售报告', 
      type: '销售', 
      date: '2024-01-15', 
      status: '已完成',
      author: '张三'
    },
    { 
      id: 2, 
      name: '用户活跃度分析', 
      type: '分析', 
      date: '2024-01-14', 
      status: '生成中',
      author: '李四'
    },
    { 
      id: 3, 
      name: '财务季度报表', 
      type: '财务', 
      date: '2024-01-10', 
      status: '已完成',
      author: '王五'
    },
    { 
      id: 4, 
      name: '产品性能报告', 
      type: '技术', 
      date: '2024-01-08', 
      status: '待审核',
      author: '赵六'
    }
  ];

  const reportCategories = data.categories || [
    { name: '销售报告', count: 15, icon: 'trending_up' },
    { name: '用户分析', count: 8, icon: 'people' },
    { name: '财务报表', count: 12, icon: 'account_balance' },
    { name: '技术报告', count: 6, icon: 'code' }
  ];

  // Report Category Card Component - 纯函数
  function ReportCategoryCard({ category }) {
    return React.createElement(Card, { sx: { height: '100%', cursor: 'pointer' } },
      React.createElement(CardContent, null,
        React.createElement(Box, { display: "flex", alignItems: "center", mb: 2 },
          React.createElement('span', { 
            className: "material-icons",
            style: { 
              fontSize: 32, 
              color: '#1976d2',
              marginRight: 16 
            }
          }, category.icon),
          React.createElement(Box, null,
            React.createElement(Typography, { variant: "h6" }, category.name),
            React.createElement(Typography, { variant: "body2", color: "text.secondary" }, `${category.count} 个报告`)
          )
        ),
        React.createElement(Button, { variant: "outlined", fullWidth: true }, "查看全部")
      )
    );
  }

  // Reports List Component - 纯函数
  function ReportsList() {
    const getStatusColor = (status) => {
      switch (status) {
        case '已完成': return 'success';
        case '生成中': return 'warning';
        case '待审核': return 'info';
        default: return 'default';
      }
    };

    const getTypeIcon = (type) => {
      switch (type) {
        case '销售': return 'shopping_cart';
        case '分析': return 'analytics';
        case '财务': return 'account_balance';
        case '技术': return 'code';
        default: return 'description';
      }
    };

    return React.createElement(Card, null,
      React.createElement(CardContent, null,
        React.createElement(Typography, { variant: "h6", gutterBottom: true }, "最近报告"),
        React.createElement(List, null,
          mockReports.map((report) =>
            React.createElement(ListItem, { key: report.id, sx: { px: 0, mb: 1 } },
              React.createElement(Paper, { variant: "outlined", sx: { width: '100%', p: 2 } },
                React.createElement(Box, { display: "flex", alignItems: "center", justifyContent: "space-between" },
                  React.createElement(Box, { display: "flex", alignItems: "center", flex: 1 },
                    React.createElement(ListItemIcon, null,
                      React.createElement('span', { className: "material-icons" }, getTypeIcon(report.type))
                    ),
                    React.createElement(Box, { flex: 1 },
                      React.createElement(Typography, { variant: "subtitle1" }, report.name),
                      React.createElement(Box, { display: "flex", alignItems: "center", mt: 1 },
                        React.createElement(Typography, { variant: "body2", color: "text.secondary", sx: { mr: 2 } }, 
                          `作者: ${report.author}`
                        ),
                        React.createElement(Typography, { variant: "body2", color: "text.secondary" }, 
                          `日期: ${report.date}`
                        )
                      )
                    )
                  ),
                  React.createElement(Box, { display: "flex", alignItems: "center", ml: 2 },
                    React.createElement(Chip, {
                      label: report.status,
                      color: getStatusColor(report.status),
                      size: "small",
                      sx: { mr: 1 }
                    }),
                    React.createElement(Button, { size: "small", variant: "text" }, "下载")
                  )
                )
              )
            )
          )
        )
      )
    );
  }

  // Quick Actions Component - 纯函数
  function QuickActions() {
    return React.createElement(Card, null,
      React.createElement(CardContent, null,
        React.createElement(Typography, { variant: "h6", gutterBottom: true }, "快速操作"),
        React.createElement(Box, { sx: { '& > *': { mb: 1 } } },
          React.createElement(Button, { 
            variant: "contained", 
            fullWidth: true,
            startIcon: React.createElement('span', { className: "material-icons" }, "add")
          }, "创建新报告"),
          React.createElement(Button, { 
            variant: "outlined", 
            fullWidth: true,
            startIcon: React.createElement('span', { className: "material-icons" }, "upload")
          }, "导入数据"),
          React.createElement(Button, { 
            variant: "outlined", 
            fullWidth: true,
            startIcon: React.createElement('span', { className: "material-icons" }, "schedule")
          }, "定时报告")
        )
      )
    );
  }

  return React.createElement(Box, { sx: { p: 3 } },
    // Page Title
    React.createElement(Typography, { variant: "h4", gutterBottom: true }, "报告中心"),
    React.createElement(Typography, { variant: "body1", color: "text.secondary", paragraph: true }, "管理和查看各类业务报告"),

    // Main Content Grid
    React.createElement(Grid, { container: true, spacing: 3 },
      // Report Categories
      React.createElement(Grid, { item: true, xs: 12, md: 8 },
        React.createElement(Box, { mb: 3 },
          React.createElement(Typography, { variant: "h6", gutterBottom: true }, "报告分类"),
          React.createElement(Grid, { container: true, spacing: 2 },
            reportCategories.map((category, index) =>
              React.createElement(Grid, { item: true, xs: 12, sm: 6, key: index },
                React.createElement(ReportCategoryCard, { category: category })
              )
            )
          )
        ),
        // Recent Reports
        React.createElement(ReportsList, null)
      ),

      // Sidebar
      React.createElement(Grid, { item: true, xs: 12, md: 4 },
        React.createElement(QuickActions, null)
      )
    )
  );
}

// Export for use in dashboard
window.Reports = Reports;
