import { ROUTES } from '../routes';

// 路由跳转工具类
export class RouterUtils {
  // 跳转到仪表板
  static goToDashboard() {
    return ROUTES.DASHBOARD;
  }

  // 跳转到路由管理
  static goToRoutes() {
    return ROUTES.ROUTES;
  }

  // 跳转到上游服务
  static goToUpstreams() {
    return ROUTES.UPSTREAMS;
  }

  // 跳转到消费者管理
  static goToConsumers() {
    return ROUTES.CONSUMERS;
  }

  // 跳转到插件配置
  static goToPlugins() {
    return ROUTES.PLUGINS;
  }

  // 跳转到SSL证书
  static goToSSL() {
    return ROUTES.SSL;
  }

  // 跳转到系统配置
  static goToSystemConfig() {
    return ROUTES.SYSTEM_CONFIG;
  }

  // 跳转到登录页
  static goToLogin() {
    return ROUTES.LOGIN;
  }

  // 获取路由路径
  static getPath(routeKey: keyof typeof ROUTES) {
    return ROUTES[routeKey];
  }

  // 检查当前路径是否匹配
  static isCurrentPath(pathname: string, routeKey: keyof typeof ROUTES) {
    return pathname === ROUTES[routeKey];
  }

  // 获取路由标题
  static getRouteTitle(routeKey: keyof typeof ROUTES) {
    const routeTitles: Record<keyof typeof ROUTES, string> = {
      LOGIN: '登录',
      DASHBOARD: '仪表板',
      ROUTES: '路由管理',
      UPSTREAMS: '上游服务',
      CONSUMERS: '消费者管理',
      PLUGINS: '插件配置',
      SSL: 'SSL证书',
      SYSTEM_CONFIG: '系统配置',
      NOT_FOUND: '页面未找到',
    };
    return routeTitles[routeKey];
  }
}

// 导出路由常量
export { ROUTES };
