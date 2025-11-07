// Stock Analysis Component for Dashboard
// Converted from public/ directory stock scraping tool - 纯函数版本

// Stock Analysis Component - 纯函数，无内部状态
function StockAnalysis({ data = {} }) {
  const { useState, useEffect, useRef } = React;
  const { 
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Box,
    Grid,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Paper,
    Divider,
    Chip,
    LinearProgress
  } = window.MaterialUI;

  // 调试日志：组件渲染时的数据状态
  console.log('StockAnalysis component rendered with data:', data);

  // 从props获取数据，如果没有则使用默认数据
  const [isRunning, setIsRunning] = useState(data.isRunning || false);
  const [currentTask, setCurrentTask] = useState(data.currentTask || '无');
  const [startTime, setStartTime] = useState(data.startTime || null);
  const [runningTime, setRunningTime] = useState(data.runningTime || '00:00:00');
  const [logs, setLogs] = useState(data.logs || []);
  const [stockCode, setStockCode] = useState(data.stockCode || '');
  const [queryResult, setQueryResult] = useState(data.queryResult || null);
  const [showResult, setShowResult] = useState(data.showResult || false);
  const [loading, setLoading] = useState(data.loading || {
    start: false,
    stop: false,
    query: false
  });

  const runningTimeInterval = useRef(null);

  // 同步外部数据到内部状态 - 日志数据
  useEffect(() => {
    if (data.logs && Array.isArray(data.logs)) {
      console.log('External logs changed, syncing to internal state:', data.logs);
      console.log('Current internal logs before sync:', logs);
      setLogs(data.logs);
    }
  }, [data.logs]);

  // 同步其他关键字段
  useEffect(() => {
    console.log('Syncing other data fields:', data);
    if (data.isRunning !== undefined) setIsRunning(data.isRunning);
    if (data.currentTask !== undefined) setCurrentTask(data.currentTask);
    if (data.startTime !== undefined) setStartTime(data.startTime);
    if (data.runningTime !== undefined) setRunningTime(data.runningTime);
    if (data.stockCode !== undefined) setStockCode(data.stockCode);
    if (data.queryResult !== undefined) setQueryResult(data.queryResult);
    if (data.showResult !== undefined) setShowResult(data.showResult);
    if (data.loading !== undefined) setLoading(data.loading);
  }, [data]);

  // API communication functions - 从props获取或使用默认
  const callCljsFunc = data.callCljsFunc || async function(funcName, args = []) {
    const res = await fetch("http://localhost:3001/execute-cljs", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({funcName, args})
    });
    return res.json();
  };

  // Log management - 从props获取回调或使用默认
  const addLog = data.addLog || function(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString('zh-CN');
    const logEntry = {
      time: timestamp,
      message: message,
      type: type
    };
    
    console.log('addLog called:', message, type);
    
    // 更新内部状态
    setLogs(prevLogs => {
      const newLogs = [...prevLogs, logEntry];
      // Keep logs under 100 entries
      if (newLogs.length > 100) {
        return newLogs.slice(-100);
      }
      return newLogs;
    });
    
    // 同时同步到外部数据（如果可用）
    if (window.clojureBridge && window.clojureBridge.addAnalysisLog) {
      console.log('Syncing log to ClojureScript atom:', message, type);
      window.clojureBridge.addAnalysisLog(message, type);
    }
  };

  const clearLogs = data.clearLogs || function() {
    setLogs([]);
    addLog('日志已清空', 'info');
  };

  // Running time counter
  const startRunningTimeCounter = data.startRunningTimeCounter || function() {
    runningTimeInterval.current = setInterval(() => {
      updateRunningTime();
    }, 1000);
  };

  const stopRunningTimeCounter = data.stopRunningTimeCounter || function() {
    if (runningTimeInterval.current) {
      clearInterval(runningTimeInterval.current);
      runningTimeInterval.current = null;
    }
    setRunningTime('00:00:00');
  };

  const updateRunningTime = data.updateRunningTime || function() {
    if (startTime) {
      const now = new Date();
      const diff = Math.floor((now - startTime) / 1000);
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;
      
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setRunningTime(timeString);
    }
  };

  // Control functions - 从props获取回调或使用默认
  const handleStart = data.handleStart || async function() {
    setLoading(prev => ({...prev, start: true}));
    addLog('正在启动浏览器...', 'info');

    try {
      const result = await callCljsFunc("start-browser", []);
      
      if (result.success) {
        setIsRunning(true);
        setStartTime(new Date());
        setCurrentTask('浏览器启动中');
        startRunningTimeCounter();
        addLog('浏览器启动成功', 'success');
      } else {
        addLog(`启动失败: ${result.error}`, 'error');
      }
    } catch (error) {
      addLog(`启动过程中发生异常: ${error.message}`, 'error');
    } finally {
      setLoading(prev => ({...prev, start: false}));
    }
  };

  const handleStop = data.handleStop || async function() {
    setLoading(prev => ({...prev, stop: true}));
    addLog('正在停止浏览器...', 'warning');

    try {
      const result = await callCljsFunc("stop-browser", []);
      
      if (result.success) {
        setIsRunning(false);
        setCurrentTask('无');
        stopRunningTimeCounter();
        addLog('浏览器已停止', 'success');
      } else {
        addLog(`停止失败: ${result.error}`, 'error');
      }
    } catch (error) {
      addLog(`停止过程中发生异常: ${error.message}`, 'error');
    } finally {
      setLoading(prev => ({...prev, stop: false}));
    }
  };

  const handleGetShareCapital = data.handleGetShareCapital || async function() {
    // 添加调试日志 - 检查传入的 data 对象
    console.log('handleGetShareCapital 开始执行，传入的 data 对象:', data);
    console.log('data.updateModuleData 是否存在:', !!data.updateModuleData);
    console.log('data.getModuleData 是否存在:', !!data.getModuleData);
    console.log('window.clojureBridge 是否存在:', !!window.clojureBridge);
    
    if (!stockCode.trim()) {
      addLog('请输入股票代码', 'warning');
      return;
    }

    setLoading(prev => ({...prev, query: true}));
    addLog(`正在查询股票 ${stockCode} 的净资产...`, 'info');

    // Create timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('查询超时，请检查股票代码或网络连接后重试'));
      }, 30000);
    });

    // Create query promise
    const queryPromise = callCljsFunc("get-net-asset", [stockCode]);

    try {
      const result = await Promise.race([queryPromise, timeoutPromise]);
      console.log('查询结果:', result);
      
      setShowResult(true);
      
      if (result.success) {
        // 修复变量名冲突 - 使用 responseData 而不是 data
        const responseData = result.data || {};
        const queryResultData = {
          stockCode: result["stock-code"] || stockCode,
          totalShareCapital: responseData["total-share-capital"],
          shareholderEquity: responseData["shareholder-equity"],
          currencyInfo: responseData["currency-info"],
          netAssetPerShare: responseData["net-asset-per-share"],
          success: true
        };
        
        console.log('准备同步的查询结果数据:', queryResultData);
        
        // 更新本地状态
        setQueryResult(queryResultData);
        
        // 同步到 ClojureScript atom - 使用正确的 data 变量（props 传入的）
        if (data.updateModuleData) {
          console.log('正在同步数据到 ClojureScript atom...');
          addLog('正在同步数据到 ClojureScript atom...', 'info');
          
          const currentAnalysisData = data.getModuleData ? data.getModuleData('analysis') : {};
          console.log('当前分析数据:', currentAnalysisData);
          
          // 创建更新数据，只更新需要修改的字段
          const updatedAnalysisData = {
            "queryResult": queryResultData,
            "showResult": true,
            "stockCode": stockCode
          };
          
          console.log('准备更新的分析数据字段:', updatedAnalysisData);
          
          // 使用 updateAnalysisData 函数进行部分更新，而不是替换整个模块
          if (window.clojureBridge && window.clojureBridge.updateAnalysisData) {
            // 更新 queryResult
            window.clojureBridge.updateAnalysisData("queryResult", queryResultData);
            // 更新 showResult
            window.clojureBridge.updateAnalysisData("showResult", true);
            // 更新 stockCode
            window.clojureBridge.updateAnalysisData("stockCode", stockCode);
            console.log('使用 updateAnalysisData 逐字段更新完成');
          } else {
            // 备用方案：使用 updateModuleData 但只传递需要更新的字段
            // 确保使用关键字键名格式
            const keywordUpdatedData = {
              "queryResult": queryResultData,
              "showResult": true,
              "stockCode": stockCode
            };
            data.updateModuleData('analysis', keywordUpdatedData);
            console.log('使用 updateModuleData 更新完成');
          }
          
          console.log('数据同步完成');
          addLog('查询结果已同步到数据存储', 'success');
        } else {
          console.error('data.updateModuleData 不存在:', data);
          addLog('错误：无法同步数据到存储，updateModuleData 函数不存在', 'error');
        }
        
        addLog(`股票 ${stockCode} 净资产查询完成`, 'success');
      } else {
        const errorResult = {
          error: result.error,
          success: false
        };
        
        console.log('查询失败，错误结果:', errorResult);
        
        // 更新本地状态
        setQueryResult(errorResult);
        
        // 同步错误状态到 ClojureScript atom
        if (data.updateModuleData) {
          console.log('正在同步错误状态到 ClojureScript atom...');
          const currentAnalysisData = data.getModuleData ? data.getModuleData('analysis') : {};
          data.updateModuleData('analysis', {
            ...currentAnalysisData,
            queryResult: errorResult,
            showResult: true,
            stockCode: stockCode
          });
          console.log('错误状态同步完成');
        } else {
          console.error('data.updateModuleData 不存在，无法同步错误状态');
        }
        
        addLog(`股票 ${stockCode} 净资产查询失败: ${result.error}`, 'error');
      }
    } catch (error) {
      const errorResult = {
        error: error.message,
        success: false
      };
      
      console.log('查询异常:', error);
      
      // 更新本地状态
      setQueryResult(errorResult);
      
      // 同步错误状态到 ClojureScript atom
      if (data.updateModuleData) {
        console.log('正在同步异常状态到 ClojureScript atom...');
        const currentAnalysisData = data.getModuleData ? data.getModuleData('analysis') : {};
        data.updateModuleData('analysis', {
          ...currentAnalysisData,
          queryResult: errorResult,
          showResult: true,
          stockCode: stockCode
        });
        console.log('异常状态同步完成');
      } else {
        console.error('data.updateModuleData 不存在，无法同步异常状态');
      }
      
      addLog(`股票 ${stockCode} 查询失败: ${error.message}`, 'error');
    } finally {
      setLoading(prev => ({...prev, query: false}));
    }
  };

  const handleRefreshLog = data.handleRefreshLog || async function() {
    try {
      const result = await callCljsFunc("get-logs-data", []);
      if (result.success) {
        setLogs(result.data || []);
        addLog('日志已刷新', 'info');
      } else {
        addLog(`刷新日志失败: ${result.error}`, 'error');
      }
    } catch (error) {
      addLog(`刷新日志异常: ${error.message}`, 'error');
    }
  };

  // Check status periodically - 从props获取回调或使用默认
  useEffect(() => {
    const checkStatus = data.checkStatus || async function() {
      try {
        const result = await callCljsFunc("get-status", []);
        if (result.success) {
          const status = result.data;
          
          if (status.browserRunning && !isRunning) {
            setIsRunning(true);
            setStartTime(new Date());
            setCurrentTask(status.currentTask || '运行中');
            startRunningTimeCounter();
          } else if (!status.browserRunning && isRunning) {
            setIsRunning(false);
            setCurrentTask('无');
            stopRunningTimeCounter();
          }
        }
      } catch (error) {
        console.error('Status check failed:', error);
      }
    };

    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Initialize with welcome message
  useEffect(() => {
    addLog('系统已就绪，等待操作...', 'info');
  }, []);

  // Render functions
  function renderLogEntry(log, index) {
    const getLogColor = (type) => {
      switch (type) {
        case 'success': return '#4caf50';
        case 'warning': return '#ff9800';
        case 'error': return '#f44336';
        default: return '#0c5460';
      }
    };

    return React.createElement(ListItem, { key: index, sx: { px: 0, py: 0.5 } },
      React.createElement(Box, { display: "flex", width: "100%" },
        React.createElement(Typography, { 
          variant: "body2", 
          sx: { 
            minWidth: 80, 
            color: '#666', 
            fontWeight: 'bold',
            mr: 2 
          } 
        }, `[${log.time}]`),
        React.createElement(Typography, { 
          variant: "body2", 
          sx: { 
            color: getLogColor(log.type),
            flex: 1 
          } 
        }, log.message)
      )
    );
  }


  return React.createElement(Box, { sx: { p: 3 } },
    // Page Title
    React.createElement(Typography, { variant: "h4", gutterBottom: true }, "雪球股票数据爬取工具"),
    React.createElement(Typography, { variant: "body1", color: "text.secondary", paragraph: true }, "自动化获取股票财务数据"),

    // Main Content Grid
    React.createElement(Grid, { container: true, spacing: 3 },
      // Control Panel
      React.createElement(Grid, { item: true, xs: 12, md: 4 },
        React.createElement(Card, null,
          React.createElement(CardContent, null,
            React.createElement(Typography, { variant: "h6", gutterBottom: true }, "控制面板"),
            React.createElement(Box, { sx: { display: 'flex', gap: 2, mt: 2 } },
              React.createElement(Button, {
                variant: "contained",
                color: "success",
                startIcon: React.createElement('span', { className: "material-icons" }, "play_arrow"),
                onClick: handleStart,
                disabled: loading.start || isRunning,
                fullWidth: true
              }, loading.start ? "启动中..." : "启动"),
              React.createElement(Button, {
                variant: "contained",
                color: "error",
                startIcon: React.createElement('span', { className: "material-icons" }, "stop"),
                onClick: handleStop,
                disabled: loading.stop,
                fullWidth: true
              }, loading.stop ? "停止中..." : "停止")
            )
          )
        )
      ),

      // Stock Query Panel
      React.createElement(Grid, { item: true, xs: 12, md: 4 },
        React.createElement(Card, null,
          React.createElement(CardContent, null,
            React.createElement(Typography, { variant: "h6", gutterBottom: true }, "净资产查询"),
            React.createElement(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 2 } }, 
              "输入股票代码查询净资产信息"
            ),
            React.createElement(Box, { sx: { display: 'flex', gap: 1 } },
              React.createElement(TextField, {
                fullWidth: true,
                size: "small",
                placeholder: "输入股票代码，如: 01800, AAPL, MSFT",
                value: stockCode,
                onChange: (e) => setStockCode(e.target.value),
                onKeyPress: (e) => {
                  if (e.key === 'Enter') {
                    handleGetShareCapital();
                  }
                }
              }),
              React.createElement(Button, {
                variant: "contained",
                color: "primary",
                startIcon: React.createElement('span', { className: "material-icons" }, "analytics"),
                onClick: handleGetShareCapital,
                disabled: loading.query
              }, loading.query ? "查询中..." : "查询")
            )
          )
        )
      ),

      // Query Result Panel
      React.createElement(Grid, { item: true, xs: 12, md: 4 },
        React.createElement(Card, null,
          React.createElement(CardContent, null,
            React.createElement(Typography, { variant: "h6", gutterBottom: true }, "净资产查询结果"),
            
            // Loading state
            loading.query && React.createElement(Box, { sx: { display: 'flex', justifyContent: 'center', py: 3 } },
              React.createElement(LinearProgress, { sx: { width: '100%' } })
            ),
            
            // Empty state
            !loading.query && !showResult && React.createElement(Box, { sx: { py: 3, textAlign: 'center' } },
              React.createElement(Typography, { variant: "body2", color: "text.secondary" }, 
                "暂无查询结果，请在左侧输入股票代码进行查询"
              )
            ),
            
            // Query result display
            !loading.query && showResult && queryResult && React.createElement(Box, { sx: { mt: 1 } },
              queryResult.success ? React.createElement(Box, { sx: { '& > div': { mb: 1.5 } } },
                React.createElement(Box, { sx: { mb: 2, pb: 1, borderBottom: '1px solid #eee' } },
                  React.createElement(Typography, { variant: "h6", color: "primary" }, queryResult.stockCode)
                ),
                queryResult.totalShareCapital && React.createElement('div', null,
                  React.createElement(Typography, { variant: "body2", sx: { fontWeight: 'bold', color: '#666' } }, "总股本:"),
                  React.createElement(Typography, { variant: "body1", sx: { fontWeight: 'medium' } }, queryResult.totalShareCapital)
                ),
                queryResult.shareholderEquity && React.createElement('div', null,
                  React.createElement(Typography, { variant: "body2", sx: { fontWeight: 'bold', color: '#666' } }, "股东权益:"),
                  React.createElement(Typography, { variant: "body1", sx: { fontWeight: 'medium' } }, queryResult.shareholderEquity)
                ),
                queryResult.currencyInfo && React.createElement('div', null,
                  React.createElement(Typography, { variant: "body2", sx: { fontWeight: 'bold', color: '#666' } }, "币种:"),
                  React.createElement(Typography, { variant: "body1", sx: { fontWeight: 'medium' } }, queryResult.currencyInfo)
                ),
                queryResult.netAssetPerShare && React.createElement('div', null,
                  React.createElement(Typography, { variant: "body2", sx: { fontWeight: 'bold', color: '#666' } }, "每股净资产:"),
                  React.createElement(Typography, { variant: "body1", sx: { fontWeight: 'medium', color: 'primary' } }, queryResult.netAssetPerShare)
                ),
                React.createElement(Box, { sx: { mt: 2, pt: 1, borderTop: '1px solid #eee' } },
                  React.createElement(Chip, {
                    label: "查询成功",
                    color: "success",
                    size: "small",
                    icon: React.createElement('span', { className: "material-icons" }, "check_circle")
                  })
                )
              ) : React.createElement(Box, { sx: { py: 2, textAlign: 'center' } },
                React.createElement(Typography, { variant: "body2", color: "error", sx: { mb: 1 } }, "查询失败"),
                React.createElement(Typography, { variant: "body2", color: "text.secondary" }, queryResult.error),
                React.createElement(Box, { sx: { mt: 2 } },
                  React.createElement(Chip, {
                    label: "查询失败",
                    color: "error",
                    size: "small",
                    icon: React.createElement('span', { className: "material-icons" }, "error")
                  })
                )
              )
            )
          )
        )
      ),

      // Log Panel
      React.createElement(Grid, { item: true, xs: 12 },
        React.createElement(Card, null,
          React.createElement(CardContent, null,
            React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 } },
              React.createElement(Typography, { variant: "h6" }, "操作日志"),
              React.createElement(Box, null,
                React.createElement(Button, {
                  size: "small",
                  onClick: clearLogs,
                  sx: { mr: 1 }
                }, "清空日志"),
                React.createElement(Button, {
                  size: "small",
                  onClick: handleRefreshLog
                }, "刷新日志")
              )
            ),
            React.createElement(Paper, { 
              variant: "outlined", 
              sx: { 
                maxHeight: 300, 
                overflow: 'auto',
                p: 1,
                bgcolor: '#f8f9fa'
              } 
            },
              React.createElement(List, { dense: true },
                logs.map((log, index) => renderLogEntry(log, index))
              )
            )
          )
        )
      )
    )
  );
}

// Export for use in dashboard
window.StockAnalysis = StockAnalysis;
