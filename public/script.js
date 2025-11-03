// 应用状态管理
class AppState {
    constructor() {
        this.isRunning = false;
        this.currentTask = '无';
        this.startTime = null;
        this.runningTimeInterval = null;
        this.logs = [];
    }

    start() {
        this.isRunning = true;
        this.startTime = new Date();
        this.startRunningTimeCounter();
    }

    stop() {
        this.isRunning = false;
        this.currentTask = '无';
        this.stopRunningTimeCounter();
    }

    startRunningTimeCounter() {
        this.runningTimeInterval = setInterval(() => {
            this.updateRunningTime();
        }, 1000);
    }

    stopRunningTimeCounter() {
        if (this.runningTimeInterval) {
            clearInterval(this.runningTimeInterval);
            this.runningTimeInterval = null;
        }
        document.getElementById('runningTime').textContent = '00:00:00';
    }

    updateRunningTime() {
        if (this.startTime) {
            const now = new Date();
            const diff = Math.floor((now - this.startTime) / 1000);
            const hours = Math.floor(diff / 3600);
            const minutes = Math.floor((diff % 3600) / 60);
            const seconds = diff % 60;
            
            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            document.getElementById('runningTime').textContent = timeString;
        }
    }

    addLog(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString('zh-CN');
        const logEntry = {
            time: timestamp,
            message: message,
            type: type
        };
        
        this.logs.push(logEntry);
        this.renderLog(logEntry);
        
        // 保持日志数量在合理范围内
        if (this.logs.length > 100) {
            this.logs.shift();
        }
    }

    renderLog(logEntry) {
        const logContainer = document.getElementById('logContainer');
        const logDiv = document.createElement('div');
        logDiv.className = `log-entry log-${logEntry.type}`;
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'log-time';
        timeSpan.textContent = `[${logEntry.time}]`;
        
        const messageSpan = document.createElement('span');
        messageSpan.className = 'log-message';
        messageSpan.textContent = logEntry.message;
        
        logDiv.appendChild(timeSpan);
        logDiv.appendChild(messageSpan);
        
        logContainer.appendChild(logDiv);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    clearLogs() {
        this.logs = [];
        const logContainer = document.getElementById('logContainer');
        logContainer.innerHTML = '';
        this.addLog('日志已清空', 'info');
    }
}

// 前端调用 nbb 后台 cljs 函数的通用方法
async function callCljsFunc(funcName, args = []) {
    const res = await fetch("http://localhost:3001/execute-cljs", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({funcName, args})
    });
    return res.json();
}

// API 通信管理（兼容旧接口，内部使用 callCljsFunc）
class ApiClient {
    constructor(baseUrl = 'http://localhost:3001') {
        this.baseUrl = baseUrl;
    }

    async start() {
        return await callCljsFunc("start-browser", []);
    }

    async stop() {
        return await callCljsFunc("stop-browser", []);
    }

    async getStatus() {
        return await callCljsFunc("get-status", []);
    }

    async getLogs() {
        return await callCljsFunc("get-logs-data", []);
    }

    async clearLogs() {
        return await callCljsFunc("clear-logs-data", []);
    }
}

// UI 控制器
class UIController {
    constructor(appState, apiClient) {
        this.appState = appState;
        this.apiClient = apiClient;
        this.initializeElements();
        this.bindEvents();
        this.initializeUI();
    }

    initializeElements() {
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.clearLogBtn = document.getElementById('clearLogBtn');
        this.refreshLogBtn = document.getElementById('refreshLogBtn');
        this.stockCodeInput = document.getElementById('stockCodeInput');
        this.getShareCapitalBtn = document.getElementById('getShareCapitalBtn');
        this.shareCapitalResult = document.getElementById('shareCapitalResult');
        this.shareCapitalOutput = document.getElementById('shareCapitalOutput');
        this.browserStatus = document.getElementById('browserStatus');
        this.currentTask = document.getElementById('currentTask');
        this.runningTime = document.getElementById('runningTime');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.handleStart());
        this.stopBtn.addEventListener('click', () => this.handleStop());
        this.clearLogBtn.addEventListener('click', () => this.handleClearLog());
        this.refreshLogBtn.addEventListener('click', () => this.handleRefreshLog());
        this.getShareCapitalBtn.addEventListener('click', () => this.handleGetShareCapital());
        this.stockCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleGetShareCapital();
            }
        });
    }

    initializeUI() {
        this.updateButtonStates();
        this.appState.addLog('系统已就绪，等待操作...', 'info');
        
        // 定期检查状态
        setInterval(() => this.checkStatus(), 5000);
    }

    async handleStart() {
        this.setButtonLoading(this.startBtn, true);
        this.appState.addLog('正在启动浏览器...', 'info');

        const result = await this.apiClient.start();
        
        this.setButtonLoading(this.startBtn, false);
        
        if (result.success) {
            this.appState.start();
            this.appState.currentTask = '浏览器启动中';
            this.appState.addLog('浏览器启动成功', 'success');
            this.updateUI();
        } else {
            this.appState.addLog(`启动失败: ${result.error}`, 'error');
        }
    }

    async handleStop() {
        this.setButtonLoading(this.stopBtn, true);
        this.appState.addLog('正在停止浏览器...', 'warning');

        try {
            const result = await this.apiClient.stop();
            
            if (result.success) {
                this.appState.stop();
                this.appState.addLog('浏览器已停止', 'success');
                this.updateUI();
            } else {
                this.appState.addLog(`停止失败: ${result.error}`, 'error');
            }
        } catch (error) {
            this.appState.addLog(`停止过程中发生异常: ${error.message}`, 'error');
        } finally {
            this.setButtonLoading(this.stopBtn, false);
        }
    }

    async handleClearLog() {
        const result = await this.apiClient.clearLogs();
        if (result.success) {
            this.appState.clearLogs();
        } else {
            this.appState.addLog(`清空日志失败: ${result.error}`, 'error');
        }
    }

    async handleRefreshLog() {
        const result = await this.apiClient.getLogs();
        if (result.success) {
            // 清空当前日志并重新渲染
            const logContainer = document.getElementById('logContainer');
            logContainer.innerHTML = '';
            
            result.data.forEach(log => {
                this.appState.renderLog(log);
            });
            
            this.appState.addLog('日志已刷新', 'info');
        } else {
            this.appState.addLog(`刷新日志失败: ${result.error}`, 'error');
        }
    }

    async checkStatus() {
        const result = await this.apiClient.getStatus();
        if (result.success) {
            const status = result.data;
            this.browserStatus.textContent = status.browserRunning ? '运行中' : '已停止';
            this.browserStatus.className = `status-value ${status.browserRunning ? 'status-running' : 'status-stopped'}`;
            this.currentTask.textContent = status.currentTask || '无';
            
            // 更新应用状态
            if (status.browserRunning && !this.appState.isRunning) {
                this.appState.start();
                this.appState.currentTask = status.currentTask || '运行中';
            } else if (!status.browserRunning && this.appState.isRunning) {
                this.appState.stop();
            }
            
            this.updateUI();
        }
    }

    updateUI() {
        this.updateButtonStates();
        this.updateStatusDisplay();
    }

    updateButtonStates() {
        if (this.appState.isRunning) {
            this.startBtn.disabled = true;
            this.stopBtn.disabled = false;
            this.startBtn.classList.remove('pulse');
        } else {
            this.startBtn.disabled = false;
            this.stopBtn.disabled = false;
            this.startBtn.classList.add('pulse');
        }
    }

    updateStatusDisplay() {
        this.browserStatus.textContent = this.appState.isRunning ? '运行中' : '已停止';
        this.browserStatus.className = `status-value ${this.appState.isRunning ? 'status-running' : 'status-stopped'}`;
        this.currentTask.textContent = this.appState.currentTask;
    }

    async handleGetShareCapital() {
        const stockCode = this.stockCodeInput.value.trim();
        
        if (!stockCode) {
            this.appState.addLog('请输入股票代码', 'warning');
            return;
        }

        this.setButtonLoading(this.getShareCapitalBtn, true);
        this.appState.addLog(`正在查询股票 ${stockCode} 的净资产...`, 'info');

        // 创建超时Promise
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('查询超时，请检查股票代码或网络连接后重试'));
            }, 30000); // 30秒超时
        });

        // 创建查询Promise
        const queryPromise = callCljsFunc("get-net-asset", [stockCode]);

        try {
            // 使用Promise.race来处理查询和超时
            const result = await Promise.race([queryPromise, timeoutPromise]);
            
            this.shareCapitalResult.style.display = 'block';
            
            if (result.success) {
                const data = result.data || {};
                this.shareCapitalOutput.innerHTML = `
                    <div class="success-result">
                        <div class="stock-info">
                            <strong>股票代码:</strong> ${result["stock-code"] || stockCode}
                        </div>
                        ${data["total-share-capital"] ? `
                        <div class="capital-info">
                            <strong>总股本:</strong> ${data["total-share-capital"]}
                        </div>` : ''}
                        ${data["shareholder-equity"] ? `
                        <div class="capital-info">
                            <strong>股东权益:</strong> ${data["shareholder-equity"]}
                        </div>` : ''}
                        ${data["currency-info"] ? `
                        <div class="capital-info">
                            <strong>币种:</strong> ${data["currency-info"]}
                        </div>` : ''}
                        ${data["net-asset-per-share"] ? `
                        <div class="capital-info">
                            <strong>每股净资产:</strong> ${data["net-asset-per-share"]}
                        </div>` : ''}
                        <div class="capital-info">
                            <strong>查询状态:</strong> 净资产查询完成
                        </div>
                    </div>
                `;
                this.appState.addLog(`股票 ${stockCode} 净资产查询完成`, 'success');
            } else {
                this.shareCapitalOutput.innerHTML = `
                    <div class="error-result">
                        <div class="error-message">
                            <strong>查询失败:</strong> ${result.error}
                        </div>
                    </div>
                `;
                this.appState.addLog(`股票 ${stockCode} 净资产查询失败: ${result.error}`, 'error');
            }
        } catch (error) {
            // 处理所有错误情况，包括超时
            this.appState.addLog(`股票 ${stockCode} 查询失败: ${error.message}`, 'error');
            this.shareCapitalResult.style.display = 'block';
            this.shareCapitalOutput.innerHTML = `
                <div class="error-result">
                    <div class="error-message">
                        <strong>查询失败:</strong> ${error.message}
                    </div>
                </div>
            `;
        } finally {
            // 确保在任何情况下都恢复按钮状态
            this.setButtonLoading(this.getShareCapitalBtn, false);
        }
    }


    setButtonLoading(button, loading) {
        if (loading) {
            button.disabled = true;
            const originalContent = button.innerHTML;
            button.innerHTML = '<span class="loading"></span> 处理中...';
            button.dataset.originalContent = originalContent;
        } else {
            button.disabled = false;
            if (button.dataset.originalContent) {
                button.innerHTML = button.dataset.originalContent;
                delete button.dataset.originalContent;
            }
        }
    }
}

// 应用初始化
document.addEventListener('DOMContentLoaded', () => {
    const appState = new AppState();
    const apiClient = new ApiClient();
    const uiController = new UIController(appState, apiClient);
    
    // 全局错误处理
    window.addEventListener('error', (event) => {
        appState.addLog(`系统错误: ${event.message}`, 'error');
    });
    
    // 网络状态监听
    window.addEventListener('online', () => {
        appState.addLog('网络连接已恢复', 'success');
    });
    
    window.addEventListener('offline', () => {
        appState.addLog('网络连接已断开', 'warning');
    });
    
    console.log('雪球股票数据爬取工具已启动');
});
