import React, { useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';

const TestPluginAPI: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [pluginList, setPluginList] = useState<any[]>([]);
  const [pluginDetail, setPluginDetail] = useState<any>(null);
  const [pluginName, setPluginName] = useState<string>('');

  // 测试获取插件列表
  const testGetPluginList = async () => {
    setLoading(true);
    setError('');
    setPluginList([]);
    
    try {
      console.log('开始测试 get-plugin-list...');
      console.log('window.get-plugin-list:', (window as any)['get-plugin-list']);
      
      const getPluginList = (window as any)['get-plugin-list'];
      if (!getPluginList) {
        throw new Error('get-plugin-list 函数未找到，请确保 demo.cljs 已正确加载');
      }
      
      const response = await getPluginList();
      console.log('插件列表响应:', response);
      
      setPluginList(response.plugins || []);
    } catch (err) {
      console.error('测试失败:', err);
      setError(err instanceof Error ? err.message : '获取插件列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 测试获取插件详情
  const testGetPluginByName = async () => {
    if (!pluginName.trim()) {
      setError('请输入插件名称');
      return;
    }
    
    setLoading(true);
    setError('');
    setPluginDetail(null);
    
    try {
      console.log('开始测试 get-plugin-by-name:', pluginName);
      console.log('window.get-plugin-by-name:', (window as any)['get-plugin-by-name']);
      
      const getPluginByName = (window as any)['get-plugin-by-name'];
      if (!getPluginByName) {
        throw new Error('get-plugin-by-name 函数未找到，请确保 demo.cljs 已正确加载');
      }
      
      const result = await getPluginByName(pluginName);
      console.log('插件详情响应:', result);
      
      setPluginDetail(result);
    } catch (err) {
      console.error('测试失败:', err);
      setError(err instanceof Error ? err.message : '获取插件详情失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        ClojureScript 插件 API 测试
      </Typography>
      
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        此页面用于测试 ClojureScript 实现的插件 API 功能
      </Typography>

      {/* 错误提示 */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* 测试按钮组 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            API 测试
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Button
              variant="contained"
              onClick={testGetPluginList}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : undefined}
            >
              测试获取插件列表
            </Button>
          </Box>

          {/* 插件详情测试 */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              label="插件名称"
              value={pluginName}
              onChange={(e) => setPluginName(e.target.value)}
              placeholder="输入插件名称"
              size="small"
              sx={{ minWidth: 200 }}
            />
            <Button
              variant="outlined"
              onClick={testGetPluginByName}
              disabled={loading || !pluginName.trim()}
              startIcon={loading ? <CircularProgress size={20} /> : undefined}
            >
              获取插件详情
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 插件列表结果 */}
      {pluginList.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6">插件列表</Typography>
                <Chip label={pluginList.length} color="primary" size="small" />
              </Box>
            }
          />
          <CardContent>
            <TextField
              fullWidth
              multiline
              rows={10}
              value={JSON.stringify(pluginList, null, 2)}
              variant="outlined"
              sx={{
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f5f5f5'
                }
              }}
              InputProps={{
                readOnly: true
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* 插件详情结果 */}
      {pluginDetail && (
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">
                  插件详情: {pluginDetail.name || pluginDetail.id}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(pluginDetail, null, 2));
                    // 可以添加复制成功的提示，这里为了简洁暂时不加
                  }}
                  sx={{ fontSize: '0.75rem' }}
                >
                  复制 JSON
                </Button>
              </Box>
            }
          />
          <CardContent>
            <TextField
              fullWidth
              multiline
              rows={15}
              value={JSON.stringify(pluginDetail, null, 2)}
              variant="outlined"
              sx={{
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f5f5f5'
                },
                '& .MuiInputBase-input': {
                  userSelect: 'text' // 确保文本可以选择
                }
              }}
              InputProps={{
                readOnly: true
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* 调试信息 */}
      <Card>
        <CardHeader title="调试信息" />
        <CardContent>
          <Typography variant="body2" component="div">
            <pre>
              {JSON.stringify({
                hasPluginService: !!(window as any).pluginService,
                hasGetPluginList: !!(window as any)['get-plugin-list'],
                hasGetPluginByName: !!(window as any)['get-plugin-by-name'],
                pluginServiceType: typeof (window as any).pluginService,
                pluginListLength: pluginList.length,
                pluginDetailName: pluginDetail?.name || null
              }, null, 2)}
            </pre>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TestPluginAPI;
