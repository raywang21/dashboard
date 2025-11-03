import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { loginUser, logoutUser, getUserInfo, refreshToken, UserInfo } from '../services/api';
import { config } from '../config/config';

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: UserInfo) => void;
  checkTokenValidity: () => Promise<boolean>;
  refreshTokenIfNeeded: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem(config.auth.tokenKey));

  // 检查用户是否已登录
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem(config.auth.tokenKey);
      
      if (token) {
        try {
          const userData = await getUserInfo();
          // 处理Spring Boot包装的响应结构
          if (userData && typeof userData === 'object' && 'code' in userData) {
            // 如果返回的是包装的响应，提取实际数据
            if (userData.code === 0 && userData.data) {
              setUser(userData.data);
            } else {
              throw new Error('获取用户信息失败');
            }
          } else {
            // 直接返回的用户数据
            setUser(userData);
          }
        } catch (error) {
          console.error('Failed to get user info:', error);
          // Token可能已过期，尝试刷新
          try {
            const refreshResult = await refreshToken();
            // 处理Spring Boot包装的响应结构
            if (refreshResult.code === 0 && refreshResult.data) {
              const { token: newToken, refreshToken: newRefreshToken, user: userData } = refreshResult.data;
              localStorage.setItem(config.auth.tokenKey, newToken);
              localStorage.setItem(config.auth.refreshTokenKey, newRefreshToken);
              setToken(newToken);
              setUser(userData);
            } else {
              throw new Error('刷新token失败');
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            // 刷新失败，清除token
            localStorage.removeItem(config.auth.tokenKey);
            localStorage.removeItem(config.auth.refreshTokenKey);
            setToken(null);
          }
        }
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // 登录方法
  const login = async (username: string, password: string) => {
    try {
      const response = await loginUser({ username, password });
      
      // 处理Spring Boot包装的响应结构
      if (response.code === 0 && response.data) {
        setIsLoading(true);
        const { token, refreshToken: refreshTokenValue, user: userData } = response.data;
        
        // 保存token到localStorage
        localStorage.setItem(config.auth.tokenKey, token);
        localStorage.setItem(config.auth.refreshTokenKey, refreshTokenValue);
        
        // 更新token状态
        setToken(token);
        
        // 更新用户状态
        setUser(userData);
      } else {
        throw new Error(response.message || '登录失败');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 登出方法
  const logout = async () => {
    try {
      // 调用后端登出接口
      await logoutUser();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // 清除本地存储和状态
      localStorage.removeItem(config.auth.tokenKey);
      localStorage.removeItem(config.auth.refreshTokenKey);
      setToken(null);
      setUser(null);
    }
  };

  // 更新用户信息
  const updateUser = (userData: UserInfo) => {
    setUser(userData);
  };

  // 检查token有效性
  const checkTokenValidity = useCallback(async (): Promise<boolean> => {
    if (!token) {
      return false;
    }

    try {
      const userData = await getUserInfo();
      // 处理Spring Boot包装的响应结构
      if (userData && typeof userData === 'object' && 'code' in userData) {
        if (userData.code === 0 && userData.data) {
          setUser(userData.data);
          return true;
        } else {
          return false;
        }
      } else {
        setUser(userData);
        return true;
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }, [token]);

  // 刷新token
  const refreshTokenIfNeeded = useCallback(async (): Promise<boolean> => {
    const refreshTokenValue = localStorage.getItem(config.auth.refreshTokenKey);
    if (!refreshTokenValue) {
      return false;
    }

    try {
      const refreshResult = await refreshToken();
      // 处理Spring Boot包装的响应结构
      if (refreshResult.code === 0 && refreshResult.data) {
        const { token: newToken, refreshToken: newRefreshToken, user: userData } = refreshResult.data;
        localStorage.setItem(config.auth.tokenKey, newToken);
        localStorage.setItem(config.auth.refreshTokenKey, newRefreshToken);
        setToken(newToken);
        setUser(userData);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    token,
    login,
    logout,
    updateUser,
    checkTokenValidity,
    refreshTokenIfNeeded,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
