import { config } from '../config/config';
import CryptoJS from 'crypto-js';

// 扩展 Window 接口以包含 crypto 属性
declare global {
  interface Window {
    crypto: Crypto;
  }
}

// API基础配置
const API_BASE_URL = config.api.baseURL;

// 加密密钥，必须与后端一致（32字节 = 256位）
const ENCRYPTION_KEY = 'your-32-byte-encryption-key-here';

// 使用纯 JavaScript 实现 AES 加密（CBC模式）
async function encryptPassword(password: string): Promise<string> {
  // 生成随机IV（16字节，AES-CBC需要）
  const iv = CryptoJS.lib.WordArray.random(16);
  
  // 将密钥转换为 WordArray
  const key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY);
  
  // 使用 AES 加密（CBC 模式）
  const encrypted = CryptoJS.AES.encrypt(password, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  // 获取加密后的数据
  const encryptedData = encrypted.ciphertext;
  
  // 组合IV和加密数据
  const combined = CryptoJS.lib.WordArray.create()
    .concat(iv)
    .concat(encryptedData);
  
  // 转换为 base64
  const result = CryptoJS.enc.Base64.stringify(combined);
  
  return result;
}

// 请求头配置
const getHeaders = () => {
  const token = localStorage.getItem('authToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// 通用请求方法
export const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const requestConfig: RequestInit = {
    headers: getHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, requestConfig);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// 登录接口
export const loginUser = async (credentials: { username: string; password: string }) => {
  // 加密密码
  const encryptedPassword = await encryptPassword(credentials.password);
  
  return request<LoginResponse>('/api/signin', {
    method: 'POST',
    body: JSON.stringify({
      username: credentials.username,
      password: encryptedPassword
    }),
  });
};

// 登出接口
export const logoutUser = async () => {
  return request('/api/signout', {
    method: 'POST',
  });
};

// 获取用户信息
export const getUserInfo = async () => {
  return request<WrappedResponse<UserInfo>>('/api/user');
};

// 刷新token
export const refreshToken = async () => {
  const refreshTokenValue = localStorage.getItem(config.auth.refreshTokenKey);
  return request<LoginResponse>('/api/refresh', {
    method: 'POST',
    body: JSON.stringify({
      refreshToken: refreshTokenValue
    }),
  });
};

// 类型定义
export interface LoginResponse {
  code: number;
  message: string;
  data?: {
    token: string;
    refreshToken: string;
    user: UserInfo;
  };
}

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  role: string;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
  avatar?: string;
  permissions?: string[];
}

// 包装的响应类型
export interface WrappedResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}
