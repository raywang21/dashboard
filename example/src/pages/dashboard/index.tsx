import React, { useState } from 'react';

// REPL 执行区域组件
const REPLExecutionArea: React.FC = () => {
  const [clojureCode, setClojureCode] = useState('');
  const [jsCode, setJsCode] = useState('');

  const executeClojure = () => {
    if (typeof window !== 'undefined' && (window as any).executeClojureCode) {
      try {
        (window as any).executeClojureCode(clojureCode);
      } catch (error) {
        console.error('ClojureScript执行失败:', error);
      }
    } else {
      console.error('executeClojureCode function not found');
    }
  };

  const executeJavaScript = () => {
    if (typeof window !== 'undefined' && (window as any).executeJavaScriptCode) {
      try {
        (window as any).executeJavaScriptCode(jsCode);
      } catch (error) {
        console.error('JavaScript执行失败:', error);
      }
    } else {
      console.error('executeJavaScriptCode function not found');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">REPL 执行区域</h2>
      
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', width: '100%' }}>
        {/* 左侧：ClojureScript 执行 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1e40af' }}>ClojureScript 执行</h3>
          <textarea
            value={clojureCode}
            onChange={(e) => setClojureCode(e.target.value)}
            placeholder="输入ClojureScript代码...例如：(+ 1 2 3)"
            style={{ 
              minHeight: '300px', 
              width: '100%', 
              padding: '16px', 
              border: '2px solid #bfdbfe', 
              borderRadius: '8px', 
              fontFamily: 'monospace', 
              fontSize: '14px',
              resize: 'none',
              outline: 'none'
            }}
          />
          <button
            onClick={executeClojure}
            style={{ 
              marginTop: '12px', 
              width: '100%', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              padding: '12px 16px', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
          >
            执行 ClojureScript
          </button>
        </div>

        {/* 右侧：JavaScript 执行 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#15803d' }}>JavaScript 执行</h3>
          <textarea
            value={jsCode}
            onChange={(e) => setJsCode(e.target.value)}
            placeholder="输入JavaScript函数调用...例如：window.my_alert()"
            style={{ 
              minHeight: '300px', 
              width: '100%', 
              padding: '16px', 
              border: '2px solid #86efac', 
              borderRadius: '8px', 
              fontFamily: 'monospace', 
              fontSize: '14px',
              resize: 'none',
              outline: 'none'
            }}
          />
          <button
            onClick={executeJavaScript}
            style={{ 
              marginTop: '12px', 
              width: '100%', 
              backgroundColor: '#22c55e', 
              color: 'white', 
              padding: '12px 16px', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#22c55e'}
          >
            执行 JavaScript
          </button>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded-md">
        <h4 className="font-semibold text-blue-800 mb-2">使用说明：</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• ClojureScript代码必须使用英文括号和语法</li>
          <li>• JavaScript代码可以调用全局函数，如 window.my_alert()</li>
          <li>• 所有执行结果都会在浏览器控制台中显示</li>
          <li>• 示例：ClojureScript: <code className="bg-blue-100 px-1 rounded">(+ 1 2 3)</code></li>
          <li>• 示例：JavaScript: <code className="bg-blue-100 px-1 rounded">window.my_alert()</code></li>
        </ul>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  React.useEffect(() => {
    // 当组件挂载时执行 ClojureScript 函数
    if (typeof window !== 'undefined' && (window as any).init_plugininfo) {
      (window as any).init_plugininfo();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div id="app"></div>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Scittle 内联代码测试</h1>
          <p className="text-gray-600 mt-2">
            直接在HTML中使用script标签测试ClojureScript功能
          </p>
        </header>

        {/* REPL 执行区域 */}
        <REPLExecutionArea />

        {/* 通用表单生成器 */}
        <FormGeneratorSection />

        {/* 内联代码测试 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">直接Script标签测试</h2>
          <p className="text-gray-600 mb-4">
            点击下方按钮测试在index.html中直接定义的ClojureScript函数
          </p>
          
          <DashboardTest />
          
          <p className="text-sm text-gray-500 mt-2">
            函数直接在index.html中定义，应该可以正常调用
          </p>
        </div>

        {/* 外部cljs文件测试 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">外部cljs文件测试</h2>
          <p className="text-gray-600 mb-4">
            点击下方按钮测试从外部cljs文件加载的ClojureScript函数
          </p>
          
          <ExternalCljsTest />
          
          <p className="text-sm text-gray-500 mt-2">
            函数从 /public/cljs/demo.cljs 文件加载，应该可以正常调用
          </p>
        </div>

        {/* API 集成测试 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">TypeScript API 集成测试</h2>
          <p className="text-gray-600 mb-4">
            测试 ClojureScript 直接调用 TypeScript API 函数
          </p>
          
          <ApiIntegrationTest />
          
          <p className="text-sm text-gray-500 mt-2">
            使用 Scittle 的 :require 功能直接导入 JavaScript 模块
          </p>
        </div>

        {/* 代码展示 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">当前测试的代码</h2>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">index.html中的代码：</h3>
            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
              <code>{`(defn my-alert []
  (js/alert "内联代码测试成功！你点击了按钮！"))
;; export function to use from JavaScript:
(set! (.-my_alert js/window) my_alert)`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

// 简化的测试组件
const DashboardTest: React.FC = () => {
  // 测试内联代码功能
  const handleInlineTest = () => {
    if (typeof window !== 'undefined' && (window as any).my_alert) {
      (window as any).my_alert();
    } else {
      console.error('my_alert function not found on window object');
    }
  };

  return (
    <button 
      onClick={handleInlineTest}
      className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
    >
      测试内联代码功能
    </button>
  );
};

// 外部cljs文件测试组件
const ExternalCljsTest: React.FC = () => {
  // 测试greet函数
  const handleGreetTest = () => {
    if (typeof window !== 'undefined' && (window as any).greet) {
      const result = (window as any).greet("世界");
      alert(result);
      console.log("greet result:", result);
    } else {
      console.error('greet function not found on window object');
    }
  };

  // 测试calculate-sum函数
  const handleCalculateSumTest = () => {
    if (typeof window !== 'undefined' && (window as any).calculate_sum) {
      const result = (window as any).calculate_sum(10, 25);
      alert(`10 + 25 = ${result}`);
      console.log("calculate_sum result:", result);
    } else {
      console.error('calculate_sum function not found on window object');
    }
  };

  // 测试show-info函数
  const handleShowInfoTest = () => {
    if (typeof window !== 'undefined' && (window as any).show_info) {
      (window as any).show_info();
    } else {
      console.error('show_info function not found on window object');
    }
  };

  return (
    <div className="space-y-3">
      <button 
        onClick={handleGreetTest}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        测试 greet 函数
      </button>
      <button 
        onClick={handleCalculateSumTest}
        className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        测试 calculate_sum 函数
      </button>
      <button 
        onClick={handleShowInfoTest}
        className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        测试 show_info 函数
      </button>
    </div>
  );
};

// 表单生成器组件
const FormGeneratorSection: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const handleInitFormGenerator = () => {
    if (typeof window !== 'undefined' && (window as any).init_form_generator) {
      (window as any).init_form_generator("ai-proxy");
      setShowForm(true);
    } else {
      console.error('init_form_generator function not found');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">通用表单生成器</h2>
        <button
          onClick={handleInitFormGenerator}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {showForm ? "重新生成表单" : "生成插件配置表单"}
        </button>
      </div>
      
      <div className="text-gray-600 mb-4">
        <p>基于插件Schema动态生成配置表单，支持多种字段类型。</p>
      </div>
      
      {showForm && (
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <h4 className="font-semibold text-blue-800 mb-2">使用说明：</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 表单将显示在页面顶部的app容器中</li>
            <li>• 填写表单后点击提交，数据会输出到控制台</li>
            <li>• 支持string、integer、boolean等基本类型</li>
            <li>• 基于Material UI设计风格</li>
          </ul>
        </div>
      )}
    </div>
  );
};

// API 集成测试组件
const ApiIntegrationTest: React.FC = () => {
  const handleShowUserInfo = () => {
    console.log('Testing show_user_info...');
    if (typeof window !== 'undefined' && (window as any).show_user_info) {
      (window as any).show_user_info();
    } else {
      console.error('show_user_info function not found on window object');
      alert('show_user_info function not found');
    }
  };

  const handleGetUserInfo = () => {
    console.log('Testing get_user_info...');
    if (typeof window !== 'undefined' && (window as any).get_user_info) {
      (window as any).get_user_info()
        .then((result: any) => {
          console.log('Promise result:', result);
          alert(`成功获取用户信息: ${result.data.username}`);
        })
        .catch((error: any) => {
          console.error('Promise error:', error);
          alert(`错误: ${error.message}`);
        });
    } else {
      console.error('get_user_info function not found on window object');
      alert('get_user_info function not found');
    }
  };

  return (
    <div className="space-y-3">
      <button 
        onClick={handleShowUserInfo}
        className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        显示用户信息（回调方式）
      </button>
      <button 
        onClick={handleGetUserInfo}
        className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        获取用户信息（Promise方式）
      </button>
    </div>
  );
};

export default Dashboard;
