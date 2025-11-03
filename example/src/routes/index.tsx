import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Dashboard from '../pages/dashboard';
import { Routes } from '../pages/routes';
import { Upstreams } from '../pages/upstreams';
import { Consumers } from '../pages/consumers';
import { Plugins } from '../pages/plugins';
import { SSL } from '../pages/ssl';
import { SystemConfig } from '../pages/systemConfig';
import TestPluginAPI from '../pages/test-plugin-api';
import { NotFound } from '../components/NotFound';
import { Login } from '../pages/login';
import { MainLayout } from '../components/layout/MainLayout';
import { AuthGuard } from '../components/guards/AuthGuard';

// 路由配置
export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <AuthGuard requireAuth={false}>
        <Login />
      </AuthGuard>
    ),
  },
  {
    path: '/',
    element: (
      <AuthGuard requireAuth={true}>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'routes',
        element: <Routes />,
      },
      {
        path: 'upstreams',
        element: <Upstreams />,
      },
      {
        path: 'consumers',
        element: <Consumers />,
      },
      {
        path: 'plugins',
        element: <Plugins />,
      },
      {
        path: 'plugins/list',
        element: <Plugins />,
      },
      {
        path: 'ssl',
        element: <SSL />,
      },
      {
        path: 'system-config',
        element: <SystemConfig />,
      },
      {
        path: 'test-plugin-api',
        element: <TestPluginAPI />,
      },
    ],
  },
  // 404 页面 - 独立的路由，不包含在 MainLayout 中
  {
    path: '*',
    element: <NotFound />,
  },
]);

// 路由路径常量
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ROUTES: '/routes',
  UPSTREAMS: '/upstreams',
  CONSUMERS: '/consumers',
  PLUGINS: '/plugins',
  SSL: '/ssl',
  SYSTEM_CONFIG: '/system-config',
  NOT_FOUND: '*',
} as const;

// 路由配置类型
export interface RouteConfig {
  id: string;
  path: string;
  title: string;
  icon?: string;
  children?: RouteConfig[];
}

// 菜单路由配置
export const menuRoutes: RouteConfig[] = [
  {
    id: 'dashboard',
    path: ROUTES.DASHBOARD,
    title: '仪表板',
    icon: 'dashboard',
  },
  {
    id: 'routes',
    path: ROUTES.ROUTES,
    title: '路由管理',
    icon: 'route',
  },
  {
    id: 'upstreams',
    path: ROUTES.UPSTREAMS,
    title: '上游服务',
    icon: 'cloud',
  },
  {
    id: 'consumers',
    path: ROUTES.CONSUMERS,
    title: '消费者',
    icon: 'people',
  },
  {
    id: 'plugins',
    path: ROUTES.PLUGINS,
    title: '插件配置',
    icon: 'extension',
  },
  {
    id: 'ssl',
    path: ROUTES.SSL,
    title: 'SSL证书',
    icon: 'security',
  },
  {
    id: 'system-config',
    path: ROUTES.SYSTEM_CONFIG,
    title: '系统配置',
    icon: 'settings',
  },
];
