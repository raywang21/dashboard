import React from 'react';
import { Box, Typography, Paper, Tabs, Tab } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ExampleForm from './example';
import PluginList from '../../components/plugin/PluginList';

export const Plugins: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = React.useState(0);

  // 根据当前路径设置活动标签页
  React.useEffect(() => {
    if (location.pathname === '/plugins' || location.pathname === '/plugins/list') {
      setActiveTab(1);
    }
  }, [location.pathname]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    if (newValue === 0) {
      navigate('/plugins');
    } else if (newValue === 1) {
      navigate('/plugins/list');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        插件配置
      </Typography>
      <Typography variant="body1" paragraph>
        配置和管理各种插件，包括认证、限流、日志、监控等功能的插件。
      </Typography>
      
      <Paper sx={{ mt: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="插件配置标签页">
          <Tab label="动态表单示例" />
          <Tab label="插件列表" />
          <Tab label="配置模板" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <ExampleForm />
          )}
          
          {activeTab === 1 && (
            <PluginList 
              onPluginSelect={(plugin) => navigate(`/plugins/${plugin.id}`)}
              onPluginConfigure={(plugin) => navigate(`/plugins/${plugin.id}`)}
            />
          )}
          
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                配置模板
              </Typography>
              <Typography variant="body2" color="textSecondary">
                配置模板功能正在开发中...
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
