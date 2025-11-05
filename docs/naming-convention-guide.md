# JavaScript与ClojureScript命名规范指南

## 📋 文档概述

本文档定义了Dashboard项目中JavaScript与ClojureScript之间的统一命名约定，采用**数据层camelCase + 函数层kebab-case**的混合策略，确保代码可读性、API兼容性和开发效率的平衡。

## 🎯 核心原则

### 1. 分层命名策略
- **数据结构层**：统一使用camelCase
- **函数定义层**：ClojureScript使用kebab-case，JavaScript使用camelCase
- **局部变量层**：ClojureScript使用kebab-case，JavaScript使用camelCase

### 2. 零转换原则
- JavaScript与ClojureScript之间的数据传递无需命名转换
- 与后端API的数据格式保持一致
- 避免因转换导致的数据丢失和性能开销

## 📝 详细规范

### 1. 数据结构命名规范

#### JavaScript端
```javascript
// ✅ 正确：使用camelCase
const analysisData = {
  stockData: {},
  queryResult: null,
  showResult: false,
  stockCode: "",
  isRunning: false,
  currentTask: "无",
  startTime: null,
  runningTime: "00:00:00",
  loading: {
    start: false,
    stop: false,
    query: false
  }
};

// ❌ 错误：使用kebab-case
const wrongData = {
  "stock-data": {},
  "query-result": null,
  "show-result": false
};
```

#### ClojureScript端
```clojure
;; ✅ 正确：数据结构使用camelCase关键字
(defonce module-data
  (r/atom {:analysis {:stockData {}
                       :queryResult nil
                       :showResult false
                       :stockCode ""
                       :isRunning false
                       :currentTask "无"
                       :startTime nil
                       :runningTime "00:00:00"
                       :loading {:start false
                               :stop false
                               :query false}}}))

;; ❌ 错误：数据结构使用kebab-case
(defonce wrong-data
  (r/atom {:analysis {:stock-data {}
                       :query-result nil}}))
```

### 2. 函数命名规范

#### JavaScript端
```javascript
// ✅ 正确：函数名使用camelCase
function handleGetShareCapital() {
  // 实现逻辑
}

const updateAnalysisData = (key, value) => {
  // 实现逻辑
};

// ❌ 错误：函数名使用kebab-case
function handle-get-share-capital() {
  // 错误的命名方式
}
```

#### ClojureScript端
```clojure
;; ✅ 正确：函数名使用kebab-case
(defn get-analysis-data []
  {:stockData (get-in @module-data [:analysis :stockData])
   :queryResult (get-in @module-data [:analysis :queryResult])
   :showResult (get-in @module-data [:analysis :showResult])})

(defn update-analysis-data! [key value]
  (let [current-data (get-in @module-data [:analysis])]
    (update-module-data! :analysis (assoc current-data key value))))

;; ❌ 错误：函数名使用camelCase
(defn getAnalysisData []
  ;; 错误的命名方式
  )
```

### 3. 局部变量命名规范

#### JavaScript端
```javascript
// ✅ 正确：局部变量使用camelCase
function processAnalysisData() {
  const queryResult = data.queryResult;
  const showResult = data.showResult;
  const stockCode = data.stockCode;
  
  // 处理逻辑
}
```

#### ClojureScript端
```clojure
;; ✅ 正确：局部变量使用kebab-case
(defn process-analysis-data []
  (let [query-result (:queryResult analysis-data)
        show-result (:showResult analysis-data)
        stock-code (:stockCode analysis-data)]
    ;; 处理逻辑
    ))

;; ❌ 错误：局部变量使用camelCase
(defn process-analysis-data []
  (let [queryResult (:queryResult analysis-data)]
    ;; 虽然能工作，但不符合ClojureScript惯例
    ))
```

### 4. 数据传递规范

#### JavaScript → ClojureScript
```javascript
// ✅ 正确：直接传递，无需转换
const analysisData = {
  queryResult: queryResultData,
  showResult: true,
  stockCode: stockCode
};

// 直接传递给ClojureScript
data.updateModuleData('analysis', analysisData);

// ❌ 错误：不必要的转换
const convertedData = {
  "query-result": queryResultData,
  "show-result": true,
  "stock-code": stockCode
};
data.updateModuleData('analysis', convertedData);
```

#### ClojureScript端JavaScript对象处理
```clojure
;; ✅ 正确：使用专用转换函数，保持camelCase
(defn js->clj-camelcase [js-obj]
  "将JavaScript对象转换为ClojureScript map，保持camelCase关键字"
  (when js-obj
    (->> (js->clj js-obj :keywordize-keys false)  ; 关键：设置为false
         (map (fn [[k v]] [(keyword k) v]))
         (into {}))))

(defn update-module-data! [module-key data]
  (let [processed-data (cond
                        ;; JavaScript对象转换
                        (and (exists? js/Object) (instance? js/Object data))
                        (do
                          (println "Converting JavaScript object to ClojureScript map")
                          (js->clj-camelcase data))  ; 使用专用转换函数
                        
                        ;; ClojureScript map直接使用
                        (map? data)
                        data
                        
                        ;; 其他情况保持原样
                        :else
                        data)]
    ;; 继续处理...
    ))

;; ❌ 错误：使用 :keywordize-keys true 会破坏命名规范
(defn wrong-conversion [data]
  (js->clj data :keywordize-keys true))  ; 会将camelCase转换为kebab-case
```

#### ClojureScript → JavaScript
```clojure
;; ✅ 正确：直接返回camelCase数据
(defn get-analysis-data []
  {:queryResult (get-in @module-data [:analysis :queryResult])
   :showResult (get-in @module-data [:analysis :showResult])
   :stockCode (get-in @module-data [:analysis :stockCode])})

;; ❌ 错误：返回kebab-case数据
(defn get-analysis-data []
  {:query-result (get-in @module-data [:analysis :query-result])
   :show-result (get-in @module-data [:analysis :show-result])})
```

### 5. API集成规范

#### 后端API对接
```javascript
// ✅ 正确：直接使用API返回的数据
const fetchAnalysisData = async (stockCode) => {
  const response = await fetch(`/api/stocks/${stockCode}/analysis`);
  const apiData = await response.json();
  // apiData格式: { queryResult: {...}, showResult: true, stockCode: "AAPL" }
  
  // 直接传递给ClojureScript，无需转换
  data.updateModuleData('analysis', apiData);
  return apiData;
};

// ❌ 错误：不必要的转换
const fetchAnalysisDataWrong = async (stockCode) => {
  const response = await fetch(`/api/stocks/${stockCode}/analysis`);
  const apiData = await response.json();
  
  // 不必要的转换
  const convertedData = {
    "query-result": apiData.queryResult,
    "show-result": apiData.showResult,
    "stock-code": apiData.stockCode
  };
  
  data.updateModuleData('analysis', convertedData);
  return convertedData;
};
```

## 🔧 实施指南

### 1. 现有代码迁移步骤

#### 步骤1：更新数据结构
```clojure
;; 从kebab-case迁移到camelCase
;; 之前：
{:query-result nil :show-result false :stock-code ""}

;; 之后：
{:queryResult nil :showResult false :stockCode ""}
```

#### 步骤2：更新数据访问代码
```clojure
;; 更新所有数据访问点
;; 之前：
(get-in @module-data [:analysis :query-result])

;; 之后：
(get-in @module-data [:analysis :queryResult])
```

#### 步骤3：移除转换逻辑
```javascript
// 移除所有不必要的转换代码
// 删除类似这样的转换函数：
function camelToKebab(str) { /* 删除 */ }
function convertToKebabCase(obj) { /* 删除 */ }
```

### 2. 代码审查检查点

#### JavaScript代码审查清单
- [ ] 数据对象使用camelCase命名
- [ ] 函数名使用camelCase命名
- [ ] 局部变量使用camelCase命名
- [ ] 与ClojureScript数据传递无转换
- [ ] API数据直接使用，无格式转换

#### ClojureScript代码审查清单
- [ ] 数据结构使用camelCase关键字
- [ ] 函数名使用kebab-case命名
- [ ] 局部变量使用kebab-case命名
- [ ] 数据访问使用camelCase关键字
- [ ] JavaScript对象转换使用 `js->clj` 时设置 `:keywordize-keys false`
- [ ] 使用专用的 `js->clj-camelcase` 函数处理JavaScript对象
- [ ] 避免使用 `:keywordize-keys true` 破坏camelCase命名

### 3. 工具配置

#### ESLint配置
```json
{
  "rules": {
    "camelcase": ["error", { "properties": "always" }]
  }
}
```

#### Clj-kondo配置
```clj
{:linters {:naming {:patterns {defs "^[a-z][a-zA-Z0-9-]*$"}}}}
```

## 📚 最佳实践示例

### 完整的数据流示例

#### JavaScript组件
```javascript
function StockAnalysis({ data }) {
  const [queryResult, setQueryResult] = useState(data.queryResult || null);
  const [showResult, setShowResult] = useState(data.showResult || false);
  const [stockCode, setStockCode] = useState(data.stockCode || '');

  const handleQuery = async () => {
    const result = await fetchStockData(stockCode);
    
    // 直接使用API返回的camelCase数据
    const updatedData = {
      queryResult: result,
      showResult: true,
      stockCode: stockCode
    };
    
    // 直接传递给ClojureScript，无转换
    data.updateModuleData('analysis', updatedData);
    setQueryResult(result);
    setShowResult(true);
  };

  return React.createElement('div', {}, /* UI */);
}
```

#### ClojureScript数据层
```clojure
(defn get-analysis-data []
  {:queryResult (get-in @module-data [:analysis :queryResult])
   :showResult (get-in @module-data [:analysis :showResult])
   :stockCode (get-in @module-data [:analysis :stockCode])})

(defn update-analysis-data! [key value]
  (let [current-data (get-in @module-data [:analysis])]
    (update-module-data! :analysis (assoc current-data key value))))

(defn process-query-result [query-result]
  (when query-result
    (let [formatted-result (format-data query-result)]
      (update-analysis-data! :queryResult formatted-result))))
```

## 🚀 迁移时间表

### 第一阶段（1-2周）：数据结构标准化
- [ ] 更新所有ClojureScript数据结构为camelCase
- [ ] 更新数据访问代码
- [ ] 运行测试确保功能正常

### 第二阶段（1周）：移除转换逻辑
- [ ] 删除所有命名转换函数
- [ ] 更新JavaScript组件，移除转换调用
- [ ] 更新API集成代码

### 第三阶段（1周）：工具和文档
- [ ] 配置代码检查工具
- [ ] 更新开发文档
- [ ] 团队培训和规范宣导

## 📋 快速参考

| 层面 | JavaScript | ClojureScript |
|------|------------|---------------|
| 数据结构 | camelCase | camelCase关键字 |
| 函数名 | camelCase | kebab-case |
| 局部变量 | camelCase | kebab-case |
| API数据 | 直接使用 | 直接使用 |
| 数据传递 | 无转换 | 无转换 |

## 🎯 核心收益

1. **零转换开销**：消除所有命名转换的性能损耗
2. **API兼容性**：与标准REST API完美兼容
3. **开发效率**：JavaScript开发者无学习成本
4. **代码可读性**：保持各语言的最佳实践
5. **维护简化**：减少因转换导致的bug和调试复杂度

## 🔄 与现有文档的关系

本规范是对 `js-clojurescript-data-bridge-guide.md` 的补充和标准化：

- **数据桥接指南**：专注于技术实现和问题解决
- **命名规范指南**：专注于代码风格和开发规范

两个文档应该结合使用，确保技术实现和代码风格的一致性。

## 📞 支持与反馈

如果在实施过程中遇到问题或有改进建议，请：

1. 查阅 `js-clojurescript-data-bridge-guide.md` 获取技术实现细节
2. 在团队会议中讨论规范的实际应用效果
3. 根据项目实际情况调整规范细节

---

**文档版本**: 1.1  
**创建日期**: 2025-11-05  
**更新日期**: 2025-11-05  
**适用范围**: Dashboard项目所有JavaScript和ClojureScript代码  
**维护责任**: 全体开发团队  
**相关文档**: [JavaScript与ClojureScript数据桥接指南](./js-clojurescript-data-bridge-guide.md)

## 📝 更新日志

### v1.1 (2025-11-05)
- 🔥 **新增**：ClojureScript端JavaScript对象处理的技术细节
- 🔥 **新增**：`js->clj-camelcase` 专用转换函数的实现
- 🔥 **新增**：`:keywordize-keys false` 的使用说明
- 🔥 **新增**：代码审查检查点中关于JavaScript对象转换的具体要求
- 🔧 **优化**：数据传递规范的完整性和准确性

### v1.0 (2025-11-05)
- 🎉 **初始版本**：建立完整的命名规范体系
- 📋 **定义**：数据层camelCase + 函数层kebab-case的混合策略
- 🔧 **实施**：详细的迁移指南和最佳实践
