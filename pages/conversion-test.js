// 简化的React数据转换测试页面
// 使用最基础的React，避免复杂依赖

const ConversionTest = {
  // 测试数据集
  testData: [
    {
      name: "纯camelCase对象",
      description: "测试纯camelCase键名的转换",
      data: {
        queryResult: "some data",
        showResult: true,
        stockCode: "AAPL",
        isRunning: false,
        currentTask: "查询中",
        startTime: "2024-01-15T10:30:00Z",
        runningTime: "00:05:23"
      }
    },
    {
      name: "纯kebab-case对象",
      description: "测试kebab-case键名的转换",
      data: {
        "query-result": "kebab data",
        "show-result": true,
        "stock-code": "AAPL",
        "is-running": false,
        "current-task": "查询中",
        "start-time": "2024-01-15T10:30:00Z",
        "running-time": "00:05:23"
      }
    },
    {
      name: "混合格式对象",
      description: "测试混合命名格式的转换",
      data: {
        queryResult: "camel data",
        "show-result": "kebab data",
        stockCode: "AAPL",
        "is-running": false,
        currentTask: "camel task",
        mixed_case: "snake case",
        startTime: "2024-01-15T10:30:00Z",
        "running-time": "00:05:23"
      }
    },
    {
      name: "嵌套对象",
      description: "测试嵌套对象的递归转换",
      data: {
        outerData: {
          innerResult: "nested camel",
          "inner-data": "nested kebab",
          deepNested: {
            deepField: "deep value",
            "deep-field": "deep kebab"
          }
        },
        simpleField: "simple value",
        "simple-field": "simple kebab"
      }
    },
    {
      name: "数组对象",
      description: "测试包含数组的对象转换",
      data: {
        items: [
          {queryResult: "item1", "show-result": true, stockCode: "AAPL"},
          {queryResult: "item2", "show-result": false, stockCode: "GOOGL"},
          {"query-result": "item3", "showResult": true, "stock-code": "MSFT"}
        ],
        count: 3,
        "item-count": 3
      }
    }
  ]
};

// React组件定义
ConversionTest.Component = function() {
  const [logs, setLogs] = React.useState(['测试日志：']);
  const [loading, setLoading] = React.useState(false);

  // 添加日志
  const addLog = React.useCallback((message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[${timestamp}] ${message}`);
  }, []);

  // 清除日志
  const clearLogs = React.useCallback(() => {
    setLogs(['测试日志：']);
  }, []);

  // 运行单个测试
  const runTest = React.useCallback(async (index) => {
    const test = ConversionTest.testData[index];
    if (!test) return;

    setLoading(true);
    addLog(`开始测试: ${test.name}`);
    addLog(`描述: ${test.description}`);
    addLog(`原始数据: ${JSON.stringify(test.data, null, 2)}`);

    try {
      // 获取转换前的数据
      const beforeData = window.clojureBridge?.getModuleData ? window.clojureBridge.getModuleData('analysis') : {};
      addLog(`调用getModuleData('analysis')查看转换前模块数据: ${JSON.stringify(beforeData, null, 2)}`);

      // 执行转换
      if (window.clojureBridge && window.clojureBridge.updateModuleData) {
        window.clojureBridge.updateModuleData('analysis', test.data);
        addLog(`✅ 成功调用 updateModuleData('analysis', data)`);
      } else {
        addLog(`❌ clojureBridge.updateModuleData 不可用`);
        return;
      }

      // 获取转换后的数据
      setTimeout(() => {
        const afterData = window.clojureBridge?.getModuleData ? window.clojureBridge.getModuleData('analysis') : {};
        addLog(`调用getModuleData('analysis')查看转换后模块数据: ${JSON.stringify(afterData, null, 2)}`);
        
        // 额外的 getModuleData 调用测试
        //const extraData = window.clojureBridge?.getModuleData ? window.clojureBridge.getModuleData('analysis') : {};
        //addLog(`额外调用 getModuleData 结果: ${JSON.stringify(extraData, null, 2)}`);
        
        addLog(`--- 测试完成 ---`);
        setLoading(false);
      }, 100);

    } catch (error) {
      addLog(`❌ 测试失败: ${error.message}`);
      setLoading(false);
    }
  }, [addLog]);

  // 渲染按钮
  const renderButtons = () => {
    return ConversionTest.testData.map((test, index) =>
      React.createElement('button', {
        key: index,
        onClick: () => runTest(index),
        disabled: loading,
        style: {
          margin: '5px',
          padding: '10px 15px',
          background: loading ? '#ccc' : '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '14px'
        }
      }, test.name)
    );
  };

  // 渲染日志区域
  const renderLogArea = () => {
    return React.createElement('div', {
      style: {
        marginTop: '20px',
        padding: '15px',
        background: '#f5f5f5',
        borderRadius: '4px',
        maxHeight: '400px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '12px',
        whiteSpace: 'pre-wrap',
        lineHeight: '1.4'
      }
    }, logs.join('\n'));
  };

  // 主渲染
  return React.createElement('div', {
    style: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }
  }, [
    // 标题
    React.createElement('h2', {
      key: 'title',
      style: {
        margin: '0 0 10px 0',
        color: '#333'
      }
    }, '数据转换测试'),

    // 描述
    React.createElement('p', {
      key: 'description',
      style: {
        margin: '0 0 20px 0',
        color: '#666'
      }
    }, '点击下面的按钮测试不同的数据格式转换'),

    // 测试按钮容器
    React.createElement('div', {
      key: 'buttons',
      style: {
        margin: '20px 0'
      }
    }, renderButtons()),

    // 清除日志按钮
    React.createElement('button', {
      key: 'clear',
      onClick: clearLogs,
      disabled: loading,
      style: {
        margin: '5px',
        padding: '10px 15px',
        background: loading ? '#ccc' : '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontSize: '14px'
      }
    }, '清除日志'),

    // 加载指示器
    loading ? React.createElement('div', {
      key: 'loading',
      style: {
        margin: '10px 0',
        padding: '10px',
        background: '#e3f2fd',
        border: '1px solid #1976d2',
        borderRadius: '4px',
        color: '#1976d2'
      }
    }, '⏳ 测试执行中，请稍候...') : null,

    // 日志区域
    renderLogArea()
  ]);
};

// 注册到全局
window.ConversionTest = ConversionTest.Component;
