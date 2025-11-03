import { request, WrappedResponse, ApiError } from './api';

// 简化的插件信息接口 - 与后端 /api/plugins/simple 接口匹配
export interface PluginInfo {
  id: string;
  name: string;
  category: string;
  version: string;
  priority: number;
  description: string;
  type: string;
  scope: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// 插件列表响应接口
export interface PluginListResponse {
  plugins: PluginInfo[];
  total: number;
}

// 错误处理增强
class PluginApiError extends Error implements ApiError {
  code?: string;
  details?: any;

  constructor(message: string, code?: string, details?: any) {
    super(message);
    this.name = 'PluginApiError';
    this.code = code;
    this.details = details;
  }
}

// 请求拦截器 - 处理插件特定的错误
const handlePluginError = (error: any): never => {
  // 处理HTTP错误响应
  if (error.name === 'Error' && error.message.includes('HTTP error! status:')) {
    const statusMatch = error.message.match(/HTTP error! status: (\d+)/);
    if (statusMatch) {
      const status = parseInt(statusMatch[1]);
      
      switch (status) {
        case 400:
          throw new PluginApiError('请求参数错误', 'VALIDATION_ERROR');
        case 401:
          throw new PluginApiError('认证失败，请重新登录', 'AUTH_ERROR');
        case 403:
          throw new PluginApiError('权限不足，无法访问插件管理', 'PERMISSION_ERROR');
        case 404:
          throw new PluginApiError('插件不存在或已被删除', 'NOT_FOUND_ERROR');
        case 500:
          throw new PluginApiError('服务器内部错误', 'SERVER_ERROR');
        default:
          throw new PluginApiError(`请求失败 (${status})`, 'UNKNOWN_ERROR');
      }
    }
  }
  
  // 处理网络错误
  if (error.message.includes('Network Error')) {
    throw new PluginApiError('网络连接失败，请检查网络设置', 'NETWORK_ERROR');
  }
  
  // 处理其他错误
  throw new PluginApiError(error.message || '未知错误', 'UNKNOWN_ERROR');
};

// 响应拦截器 - 处理插件特定的响应格式
const handlePluginResponse = <T>(response: any): T => {
  // 统一的响应格式处理
  if (response.code !== undefined && response.code !== 0) {
    throw new PluginApiError(
      response.message || '操作失败',
      response.code.toString(),
      response.details
    );
  }
  
  return response.data || response;
};

// 数据转换函数 - 将后端返回的 Map<String, Object> 转换为 PluginInfo
const transformPluginData = (pluginData: any): PluginInfo => {
  return {
    id: pluginData.id || pluginData.name || '',
    name: pluginData.name || '',
    category: pluginData.category || 'general',
    version: pluginData.version || '1.0.0',
    priority: pluginData.priority || 1000,
    description: pluginData.description || '',
    type: pluginData.type || 'normal',
    scope: pluginData.scope || 'route',
    enabled: pluginData.enabled !== false,
    created_at: pluginData.created_at || pluginData.create_time ? new Date().toISOString() : '',
    updated_at: pluginData.updated_at || pluginData.update_time ? new Date().toISOString() : ''
  };
};

// 插件API服务类
class PluginService {
  private readonly basePath = '/api/plugins';

  /**
   * 获取插件列表 - 使用后端的 /api/plugins/simple 接口
   * @returns 插件列表和总数
   */
  async getPluginList(): Promise<PluginListResponse> {
    try {
      const response = await request<any[]>(`${this.basePath}/simple`, {
        method: 'GET'
      });
      
      // 转换数据格式
      const plugins = response.map(transformPluginData);
      
      return {
        plugins,
        total: plugins.length
      };
    } catch (error) {
      throw handlePluginError(error);
    }
  }

  /**
   * 根据插件名称获取插件信息 - 使用后端的 /api/plugins/{id} 接口
   * @param pluginName 插件名称
   * @returns 插件详细信息
   */
  async getPluginByName(pluginName: string): Promise<PluginInfo> {
    try {
      const response = await request<any>(`${this.basePath}/${pluginName}`, {
        method: 'GET'
      });
      
      return transformPluginData(response);
    } catch (error) {
      throw handlePluginError(error);
    }
  }
}

// 导出单例实例
export const pluginService = new PluginService();

// 默认导出
export default pluginService;
