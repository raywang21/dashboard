# 后端对接配置指南

## 概述
本项目已经配置好了完整的后端对接架构，包括API服务、认证管理、错误处理等。

## 文件结构
```
src/
├── services/
│   └── api.ts          # API服务层
├── contexts/
│   └── AuthContext.tsx # 认证上下文
└── components/
    └── login/
        └── Login.tsx   # 登录组件
```

## 配置步骤

### 1. 环境变量配置
在项目根目录创建 `.env` 文件：
```bash
# API配置
REACT_APP_API_BASE_URL=http://localhost:8080/api

# 应用配置
REACT_APP_APP_NAME=Shiny AI Gate Dashboard
REACT_APP_VERSION=1.0.0
```

### 2. 在App.tsx中集成AuthProvider
```tsx
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/login/Login';

function App() {
  return (
    <AuthProvider>
      <Login />
    </AuthProvider>
  );
}
```

## 后端API接口要求

### 登录接口
- **URL**: `POST /api/auth/login`
- **请求体**:
```json
{
  "username": "string",
  "password": "string"
}
```
- **响应体**:
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "jwt_token_string",
    "refreshToken": "refresh_token_string",
    "user": {
      "id": "user_id",
      "username": "username",
      "email": "user@example.com",
      "role": "user",
      "avatar": "avatar_url",
      "permissions": ["read", "write"]
    }
  }
}
```

### 登出接口
- **URL**: `POST /api/auth/logout`
- **请求头**: `Authorization: Bearer {token}`

### 获取用户信息
- **URL**: `GET /api/auth/me`
- **请求头**: `Authorization: Bearer {token}`

### 刷新Token
- **URL**: `POST /api/auth/refresh`
- **请求体**: 包含refreshToken

## 错误处理

### HTTP状态码
- `200`: 成功
- `400`: 请求参数错误
- `401`: 未授权（用户名密码错误或token无效）
- `403`: 禁止访问
- `500`: 服务器内部错误

### 错误响应格式
```json
{
  "success": false,
  "message": "错误描述",
  "code": "ERROR_CODE",
  "details": {}
}
```

## 认证流程

1. **登录**: 用户输入用户名密码，调用登录接口
2. **Token存储**: 登录成功后，将token和refreshToken存储到localStorage
3. **自动认证**: 页面刷新时自动检查token有效性
4. **Token刷新**: token过期时自动使用refreshToken刷新
5. **登出**: 清除本地存储的token，调用后端登出接口

## 安全特性

- **JWT Token**: 使用JWT进行身份验证
- **Token刷新**: 支持token自动刷新
- **请求拦截**: 自动在请求头中添加token
- **错误重试**: 网络错误时自动重试
- **状态管理**: 统一的用户状态管理

## 开发调试

### 启用调试模式
```bash
# 在.env文件中设置
REACT_APP_DEBUG=true
```

### 查看网络请求
在浏览器开发者工具的Network标签页中查看API请求详情。

### 查看认证状态
在浏览器开发者工具的Console中查看认证相关的日志信息。

## 常见问题

### Q: 如何修改API地址？
A: 修改 `.env` 文件中的 `REACT_APP_API_BASE_URL` 值。

### Q: 如何处理CORS问题？
A: 后端需要配置正确的CORS策略，允许前端域名访问。

### Q: 如何自定义错误消息？
A: 在 `Login.tsx` 的 `handleSubmit` 方法中修改错误处理逻辑。

### Q: 如何添加更多API接口？
A: 在 `api.ts` 文件中添加新的接口方法，参考现有的接口格式。

## 扩展功能

### 添加路由保护
```tsx
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div>加载中...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return children;
};
```

### 添加权限控制
```tsx
const { user } = useAuth();
const hasPermission = (permission: string) => {
  return user?.permissions?.includes(permission) || false;
};
```

## 联系支持
如有问题，请查看项目文档或联系开发团队。
