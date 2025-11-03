import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Typography,
  Paper,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Stack,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Key as KeyIcon,
  Input as ValueIcon,
} from '@mui/icons-material';

// 字段类型定义
interface FieldConfig {
  type: 'text' | 'password' | 'select' | 'multiselect' | 'switch' | 'textarea' | 'array' | 'object' | 'dynamic-object';
  label: string;
  name: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  enum?: string[];
  arrayType?: 'string' | 'integer';
  objectFields?: FieldConfig[];
  layout?: 'vertical' | 'horizontal';
  group?: string;
  wrap?: boolean;
  defaultValue?: any;
}

// 表单数据结构
interface FormData {
  [key: string]: any;
}

// 动态键值对类型
interface DynamicKeyValue {
  key: string;
  value: string;
}

const ExampleForm: React.FC = () => {
  // 表单配置
  const formConfig: FieldConfig[] = [
    // 简单字段
    {
      type: 'text',
      label: '用户名',
      name: 'username',
      required: true,
      defaultValue: '',
    },
    {
      type: 'password',
      label: '密码',
      name: 'password',
      required: true,
      defaultValue: '',
    },
    {
      type: 'select',
      label: '角色',
      name: 'role',
      required: true,
      options: [
        { value: 'admin', label: '管理员' },
        { value: 'user', label: '普通用户' },
        { value: 'guest', label: '访客' },
      ],
      defaultValue: 'user',
    },
    {
      type: 'multiselect',
      label: '权限',
      name: 'permissions',
      required: false,
      options: [
        { value: 'read', label: '读取' },
        { value: 'write', label: '写入' },
        { value: 'delete', label: '删除' },
        { value: 'admin', label: '管理' },
      ],
      defaultValue: [],
    },
    {
      type: 'switch',
      label: '启用账户',
      name: 'enabled',
      defaultValue: true,
    },
    {
      type: 'textarea',
      label: '描述',
      name: 'description',
      defaultValue: '',
    },
    // 复杂字段
    {
      type: 'array',
      label: '标签',
      name: 'tags',
      arrayType: 'string',
      defaultValue: [],
    },
    {
      type: 'array',
      label: '数字列表',
      name: 'numbers',
      arrayType: 'integer',
      defaultValue: [],
    },
    {
      type: 'object',
      label: '个人信息',
      name: 'profile',
      objectFields: [
        { type: 'text', label: '姓名', name: 'name', defaultValue: '' },
        { type: 'text', label: '邮箱', name: 'email', defaultValue: '' },
        { type: 'text', label: '电话', name: 'phone', defaultValue: '' },
      ],
      defaultValue: {},
    },
    {
      type: 'dynamic-object',
      label: '自定义属性',
      name: 'customProperties',
      defaultValue: [],
    },
    // 嵌套对象
    {
      type: 'object',
      label: '地址信息',
      name: 'address',
      objectFields: [
        { type: 'text', label: '街道', name: 'street', defaultValue: '' },
        { type: 'text', label: '城市', name: 'city', defaultValue: '' },
        {
          type: 'object',
          label: '国家信息',
          name: 'country',
          objectFields: [
            { type: 'text', label: '国家名称', name: 'name', defaultValue: '' },
            { type: 'text', label: '国家代码', name: 'code', defaultValue: '' },
          ],
          defaultValue: {},
        },
      ],
      defaultValue: {},
    },
  ];

  // 表单数据状态
  const [formData, setFormData] = useState<FormData>(() => {
    const initialData: FormData = {};
    formConfig.forEach(field => {
      initialData[field.name] = field.defaultValue;
    });
    return initialData;
  });

  // 处理字段值变化
  const handleFieldChange = (fieldName: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // 处理嵌套对象字段变化
  const handleNestedFieldChange = (parentName: string, fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentName]: {
        ...prev[parentName],
        [fieldName]: value,
      },
    }));
  };

  // 数组字段操作
  const handleArrayAdd = (fieldName: string, type: 'string' | 'integer') => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] || []), type === 'integer' ? 0 : ''],
    }));
  };

  const handleArrayRemove = (fieldName: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_: any, i: number) => i !== index),
    }));
  };

  const handleArrayChange = (fieldName: string, index: number, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].map((item: any, i: number) => 
        i === index ? value : item
      ),
    }));
  };

  // 动态键值对操作
  const handleDynamicObjectAdd = (fieldName: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] || []), { key: '', value: '' }],
    }));
  };

  const handleDynamicObjectRemove = (fieldName: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_: any, i: number) => i !== index),
    }));
  };

  const handleDynamicObjectChange = (fieldName: string, index: number, key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].map((item: any, i: number) => 
        i === index ? { ...item, [key]: value } : item
      ),
    }));
  };

  // 渲染简单字段
  const renderSimpleField = (field: FieldConfig) => {
    const value = formData[field.name];

    switch (field.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            label={field.label}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.required}
            variant="outlined"
          />
        );

      case 'password':
        return (
          <TextField
            fullWidth
            type="password"
            label={field.label}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.required}
            variant="outlined"
          />
        );

      case 'select':
        return (
          <FormControl fullWidth required={field.required}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value || ''}
              label={field.label}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'multiselect':
        return (
          <FormControl fullWidth required={field.required}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              multiple
              value={value || []}
              label={field.label}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((selectedValue: string) => {
                    const option = field.options?.find(opt => opt.value === selectedValue);
                    return <Chip key={selectedValue} label={option?.label || selectedValue} />;
                  })}
                </Box>
              )}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'switch':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={value || false}
                onChange={(e) => handleFieldChange(field.name, e.target.checked)}
              />
            }
            label={field.label}
          />
        );

      case 'textarea':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label={field.label}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.required}
            variant="outlined"
          />
        );

      default:
        return null;
    }
  };

  // 渲染数组字段
  const renderArrayField = (field: FieldConfig) => {
    const value = formData[field.name] || [];
    const arrayType = field.arrayType || 'string';

    return (
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          {field.label}
        </Typography>
        <Stack spacing={1}>
          {value.map((item: any, index: number) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                type={arrayType === 'integer' ? 'number' : 'text'}
                value={item}
                onChange={(e) => handleArrayChange(field.name, index, 
                  arrayType === 'integer' ? parseInt(e.target.value) || 0 : e.target.value
                )}
                size="small"
                sx={{ flex: 1 }}
              />
              <IconButton
                size="small"
                onClick={() => handleArrayRemove(field.name, index)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={() => handleArrayAdd(field.name, arrayType)}
            variant="outlined"
            size="small"
          >
            添加{arrayType === 'integer' ? '数字' : '文本'}
          </Button>
        </Stack>
      </Box>
    );
  };

  // 渲染对象字段
  const renderObjectField = (field: FieldConfig, parentName?: string) => {
    const value = formData[field.name] || {};
    const objectFields = field.objectFields || [];

    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">{field.label}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            {objectFields.map((subField) => {
              if (subField.type === 'object') {
                return (
                  <Box key={subField.name}>
                    {renderObjectField(subField, field.name)}
                  </Box>
                );
              }
              
              const fieldValue = parentName 
                ? formData[parentName]?.[subField.name] 
                : value[subField.name];

              return (
                <Box key={subField.name}>
                  {subField.type === 'text' && (
                    <TextField
                      fullWidth
                      label={subField.label}
                      value={fieldValue || ''}
                      onChange={(e) => {
                        if (parentName) {
                          handleNestedFieldChange(parentName, subField.name, e.target.value);
                        } else {
                          handleNestedFieldChange(field.name, subField.name, e.target.value);
                        }
                      }}
                      required={subField.required}
                      variant="outlined"
                      size="small"
                    />
                  )}
                </Box>
              );
            })}
          </Stack>
        </AccordionDetails>
      </Accordion>
    );
  };

  // 渲染动态键值对字段
  const renderDynamicObjectField = (field: FieldConfig) => {
    const value = formData[field.name] || [];

    return (
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          {field.label}
        </Typography>
        <Stack spacing={1}>
          {value.map((item: DynamicKeyValue, index: number) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                label="键"
                value={item.key}
                onChange={(e) => handleDynamicObjectChange(field.name, index, 'key', e.target.value)}
                size="small"
                sx={{ flex: 1 }}
                InputProps={{
                  startAdornment: <KeyIcon sx={{ mr: 1, color: 'action.active' }} />,
                }}
              />
              <TextField
                label="值"
                value={item.value}
                onChange={(e) => handleDynamicObjectChange(field.name, index, 'value', e.target.value)}
                size="small"
                sx={{ flex: 1 }}
                InputProps={{
                  startAdornment: <ValueIcon sx={{ mr: 1, color: 'action.active' }} />,
                }}
              />
              <IconButton
                size="small"
                onClick={() => handleDynamicObjectRemove(field.name, index)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={() => handleDynamicObjectAdd(field.name)}
            variant="outlined"
            size="small"
          >
            添加键值对
          </Button>
        </Stack>
      </Box>
    );
  };

  // 渲染字段
  const renderField = (field: FieldConfig) => {
    switch (field.type) {
      case 'text':
      case 'password':
      case 'select':
      case 'multiselect':
      case 'switch':
      case 'textarea':
        return renderSimpleField(field);
      case 'array':
        return renderArrayField(field);
      case 'object':
        return renderObjectField(field);
      case 'dynamic-object':
        return renderDynamicObjectField(field);
      default:
        return null;
    }
  };

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('表单数据:', formData);
    alert('表单数据已打印到控制台，请查看开发者工具');
  };

  // 重置表单
  const handleReset = () => {
    const initialData: FormData = {};
    formConfig.forEach(field => {
      initialData[field.name] = field.defaultValue;
    });
    setFormData(initialData);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        动态表单示例
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* 简单字段组 */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  简单字段
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                  <Box>
                    {renderField(formConfig[0])} {/* 用户名 */}
                  </Box>
                  <Box>
                    {renderField(formConfig[1])} {/* 密码 */}
                  </Box>
                  <Box>
                    {renderField(formConfig[2])} {/* 角色 */}
                  </Box>
                  <Box>
                    {renderField(formConfig[3])} {/* 权限 */}
                  </Box>
                  <Box>
                    {renderField(formConfig[4])} {/* 开关 */}
                  </Box>
                  <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                    {renderField(formConfig[5])} {/* 描述 */}
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* 复杂字段组 */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  复杂字段
                </Typography>
                <Stack spacing={3}>
                  {renderField(formConfig[6])} {/* 标签数组 */}
                  {renderField(formConfig[7])} {/* 数字数组 */}
                  {renderField(formConfig[8])} {/* 个人信息对象 */}
                  {renderField(formConfig[9])} {/* 自定义属性 */}
                </Stack>
              </CardContent>
            </Card>

            {/* 嵌套属性组 */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  嵌套属性
                </Typography>
                {renderField(formConfig[10])} {/* 地址信息 */}
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                提交表单
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={handleReset}
                size="large"
              >
                重置表单
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>

      {/* 实时数据预览 */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          实时数据预览
        </Typography>
        <Box
          component="pre"
          sx={{
            backgroundColor: '#f5f5f5',
            p: 2,
            borderRadius: 1,
            overflow: 'auto',
            maxHeight: 400,
            fontSize: '0.875rem',
          }}
        >
          {JSON.stringify(formData, null, 2)}
        </Box>
      </Paper>
    </Box>
  );
};

export default ExampleForm;
