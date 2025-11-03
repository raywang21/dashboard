import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  CheckCircle as EnabledIcon,
  Cancel as DisabledIcon
} from '@mui/icons-material';

interface PluginListProps {
  onPluginSelect?: (plugin: any) => void;
  onPluginConfigure?: (plugin: any) => void;
  className?: string;
}

interface SortField {
  field: string;
  direction: 'asc' | 'desc';
}

const PluginList: React.FC<PluginListProps> = ({
  onPluginSelect,
  onPluginConfigure,
  className
}) => {
  // 状态管理
  const [plugins, setPlugins] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedScope, setSelectedScope] = useState<string>('all');
  const [enabledFilter, setEnabledFilter] = useState<string>('all');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [sortField, setSortField] = useState<SortField>({ field: 'name', direction: 'asc' });

  // 获取唯一的分类、类型和作用域
  const categories = Array.from(new Set(plugins.map(plugin => plugin.category || '').filter(Boolean)));
  const types = Array.from(new Set(plugins.map(plugin => plugin.type || '').filter(Boolean)));
  const scopes = Array.from(new Set(plugins.map(plugin => plugin.scope || '').filter(Boolean)));

  // 过滤和排序插件
  const filteredAndSortedPlugins = React.useMemo(() => {
    let result = [...plugins];

    // 搜索过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(plugin =>
        (plugin.name || '').toLowerCase().includes(term) ||
        (plugin.description || '').toLowerCase().includes(term) ||
        (plugin.category || '').toLowerCase().includes(term)
      );
    }

    // 分类过滤
    if (selectedCategory !== 'all') {
      result = result.filter(plugin => plugin.category === selectedCategory);
    }

    // 类型过滤
    if (selectedType !== 'all') {
      result = result.filter(plugin => plugin.type === selectedType);
    }

    // 作用域过滤
    if (selectedScope !== 'all') {
      result = result.filter(plugin => plugin.scope === selectedScope);
    }

    // 启用状态过滤
    if (enabledFilter !== 'all') {
      result = result.filter(plugin => 
        enabledFilter === 'enabled' ? plugin.enabled : !plugin.enabled
      );
    }

    // 排序
    result.sort((a, b) => {
      const aValue = a[sortField.field];
      const bValue = b[sortField.field];
      
      if (aValue < bValue) return sortField.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortField.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [plugins, searchTerm, selectedCategory, selectedType, selectedScope, enabledFilter, sortField]);

  // 分页数据
  const paginatedPlugins = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredAndSortedPlugins.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedPlugins, page, rowsPerPage]);

  // 加载插件列表
  const loadPlugins = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await (window as any)['get-plugin-list']();
      setPlugins(response.plugins || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载插件列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadPlugins();
  }, []);

  // 处理排序
  const handleSort = (field: string) => {
    setSortField(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // 处理分页变化
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 处理刷新
  const handleRefresh = () => {
    loadPlugins();
  };

  // 处理插件选择
  const handlePluginSelect = async (plugin: any) => {
    try {
      const detailedPlugin = await (window as any)['get-plugin-by-name'](plugin.name);
      onPluginSelect?.(detailedPlugin);
    } catch (err) {
      // 如果获取详细信息失败，使用当前插件信息
      onPluginSelect?.(plugin);
    }
  };

  // 处理插件配置
  const handlePluginConfigure = async (plugin: any) => {
    try {
      const detailedPlugin = await (window as any)['get-plugin-by-name'](plugin.name);
      onPluginConfigure?.(detailedPlugin);
    } catch (err) {
      // 如果获取详细信息失败，使用当前插件信息
      onPluginConfigure?.(plugin);
    }
  };

  // 重置过滤器
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedScope('all');
    setEnabledFilter('all');
    setPage(0);
  };

  // 获取状态颜色
  const getStatusColor = (enabled: boolean) => {
    return enabled ? 'success' : 'default';
  };

  // 获取优先级颜色
  const getPriorityColor = (priority: number) => {
    if (priority >= 80) return 'error';
    if (priority >= 50) return 'warning';
    return 'info';
  };

  return (
    <Box className={className} sx={{ p: 3 }}>
      {/* 页面标题和操作栏 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          插件管理
          <Badge 
            badgeContent={filteredAndSortedPlugins.length} 
            color="primary" 
            sx={{ ml: 2 }}
          >
            <InfoIcon />
          </Badge>
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            刷新
          </Button>
        </Box>
      </Box>

      {/* 错误提示 */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* 搜索和过滤器 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            {/* 搜索框 */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                placeholder="搜索插件名称、描述或分类..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* 分类过滤器 */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>分类</InputLabel>
                <Select
                  value={selectedCategory}
                  label="分类"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <MenuItem value="all">全部分类</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* 类型过滤器 */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>类型</InputLabel>
                <Select
                  value={selectedType}
                  label="类型"
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <MenuItem value="all">全部类型</MenuItem>
                  {types.map(type => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* 作用域过滤器 */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>作用域</InputLabel>
                <Select
                  value={selectedScope}
                  label="作用域"
                  onChange={(e) => setSelectedScope(e.target.value)}
                >
                  <MenuItem value="all">全部作用域</MenuItem>
                  {scopes.map(scope => (
                    <MenuItem key={scope} value={scope}>
                      {scope}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* 状态过滤器 */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>状态</InputLabel>
                <Select
                  value={enabledFilter}
                  label="状态"
                  onChange={(e) => setEnabledFilter(e.target.value)}
                >
                  <MenuItem value="all">全部状态</MenuItem>
                  <MenuItem value="enabled">已启用</MenuItem>
                  <MenuItem value="disabled">已禁用</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* 重置按钮 */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={resetFilters}
              >
                重置过滤
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 插件列表表格 */}
      <Card>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6">插件列表</Typography>
              {loading && <CircularProgress size={20} />}
            </Box>
          }
        />
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sortField.field === 'name'}
                      direction={sortField.direction}
                      onClick={() => handleSort('name')}
                    >
                      名称
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField.field === 'category'}
                      direction={sortField.direction}
                      onClick={() => handleSort('category')}
                    >
                      分类
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>描述</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField.field === 'type'}
                      direction={sortField.direction}
                      onClick={() => handleSort('type')}
                    >
                      类型
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField.field === 'priority'}
                      direction={sortField.direction}
                      onClick={() => handleSort('priority')}
                    >
                      优先级
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell>版本</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPlugins.map((plugin) => (
                  <TableRow 
                    key={plugin.id}
                    hover
                    onClick={() => handlePluginSelect(plugin)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {plugin.name}
                        </Typography>
                        <Tooltip title={plugin.description}>
                          <InfoIcon fontSize="small" color="action" />
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={plugin.category || '未分类'} 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          maxWidth: 200, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }}
                      >
                        {plugin.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={plugin.type || '未知'} 
                        size="small" 
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={plugin.priority || 1000}
                        size="small"
                        color={getPriorityColor(plugin.priority || 1000)}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={plugin.enabled ? <EnabledIcon /> : <DisabledIcon />}
                        label={plugin.enabled ? '已启用' : '已禁用'}
                        size="small"
                        color={getStatusColor(plugin.enabled)}
                        variant={plugin.enabled ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {plugin.version || '未知'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="查看详情">
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePluginSelect(plugin);
                            }}
                          >
                            <InfoIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="配置插件">
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePluginConfigure(plugin);
                            }}
                          >
                            <SettingsIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* 分页控件 */}
          <TablePagination
            component="div"
            count={filteredAndSortedPlugins.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="每页显示:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} 共 ${count !== -1 ? count : `超过 ${to}`} 个`
            }
          />
        </CardContent>
      </Card>

      {/* 空状态 */}
      {!loading && paginatedPlugins.length === 0 && (
        <Card sx={{ mt: 3, textAlign: 'center', py: 8 }}>
          <CardContent>
            <Typography variant="h6" color="textSecondary">
              {searchTerm || selectedCategory !== 'all' || selectedType !== 'all' || selectedScope !== 'all' || enabledFilter !== 'all'
                ? '没有找到匹配的插件'
                : '暂无插件数据'
              }
            </Typography>
            {(searchTerm || selectedCategory !== 'all' || selectedType !== 'all' || selectedScope !== 'all' || enabledFilter !== 'all') && (
              <Button 
                variant="outlined" 
                sx={{ mt: 2 }}
                onClick={resetFilters}
              >
                清除过滤器
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PluginList;
