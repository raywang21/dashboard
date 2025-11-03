// 动态获取API基础地址
const getDynamicApiBaseURL = (): string => {
  // 优先使用环境变量
  if (import.meta.env.VITE_API_BASE_URL) {
    console.log('🌍 使用环境变量API地址:', import.meta.env.VITE_API_BASE_URL);
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // 获取当前访问的主机名/IP
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  console.log('🔍 检测到访问信息:', { hostname, port, fullUrl: window.location.href });
  
  // 如果是本机访问（localhost, 127.0.0.1, 或者没有hostname）
  if (hostname === 'localhost' || hostname === '127.0.0.1' || !hostname) {
    const localUrl = 'http://localhost:9000';
    console.log('🏠 本机访问，使用API地址:', localUrl);
    return localUrl;
  }
  
  // 如果是其他IP访问，使用当前IP对应的后端地址
  const remoteUrl = `http://${hostname}:9000`;
  console.log('🌐 远程访问，使用API地址:', remoteUrl);
  return remoteUrl;
};

// 应用配置
export const config = {
  // API配置
  api: {
    baseURL: getDynamicApiBaseURL(),
    timeout: 10000, // 10秒超时
  },
  
  // 应用信息
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Shiny AI Gate Dashboard',
    version: import.meta.env.VITE_VERSION || '1.0.0',
  },
  
  // 认证配置
  auth: {
    tokenKey: 'authToken',
    refreshTokenKey: 'refreshToken',
    tokenExpiry: 3600, // 1小时
    refreshTokenExpiry: 86400, // 24小时
  },
  
  // 开发配置
  dev: {
    debug: import.meta.env.VITE_DEBUG === 'true',
    mockAPI: import.meta.env.VITE_MOCK_API === 'true',
  },
};
