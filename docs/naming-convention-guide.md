# JavaScript与ClojureScript命名规范指南

## 📋 文档概述

本文档定义了Dashboard项目中JavaScript与ClojureScript之间的统一命名约定，采用**保持原始格式 + 纯类型转换**的策略，确保数据完整性、API兼容性和开发效率的平衡。

## 🎯 核心原则

### 1. 保持原始格式原则
- **数据传递**：完全保持原始键名格式，不做任何命名转换
- **类型转换**：只进行数据类型转换，不改变键名格式
- **格式兼容**：支持camelCase、kebab-case、snake_case等所有格式

### 2. 纯类型转换原则
- JavaScript对象 ↔ ClojureScript map：只转换数据类型
- 键名格式：完全保持原样
- 数据完整性：避免因转换导致的数据丢失

### 3. 对称设计原则
- `js->clj-camelcase`：JavaScript → ClojureScript，保持原键名
- `clj->js-camelcase`：ClojureScript → JavaScript，保持原键名
- 完全对称：两个方向的转换行为一致

## 🔍 重要发现：转换函数的真实行为

### 实际测试结果
经过全面测试验证，转换函数的实际行为如下：

```javascript
// 测试数据
const testData = {
  userName: "张三",      // camelCase
  user_age: 25,          // snake_case  
  "last-login": "2024-01-15"  // kebab-case
};

// 通过 js->clj-camelcase 转换后
// 结果：{:userName "张三", :user_age 25, :last-login "2024-01-15"}
// 结论：完全保持原始键名格式！
```

### 关键认知更新
- **函数命名误导**：`js->clj-camelcase` 中的 "camelcase" 是历史遗留命名
- **实际功能**：纯类型转换器，保持所有原始键名格式
- **设计原则**：对称转换 + 零命名修改

## 📝 详细规范

### 1. 数据结构命名规范

#### 推荐实践：统一使用camelCase
```javascript
// ✅ 推荐：JavaScript端使用camelCase
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
```

```clojure
;; ✅ 推荐：ClojureScript端使用camelCase关键字
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

;; ✅ 也支持：其他格式也能正常工作
(defonce mixed-format-data
  (r/atom {:analysis {"stock-data" {}     ; kebab-case
                       "query_result" nil   ; snake_case
                       "showResult" false}})) ; camelCase
```

#### 重要说明
- **推荐统一**：建议全项目统一使用camelCase以提高一致性
- **兼容性**：转换函数支持所有格式，不会破坏现有代码
- **渐进迁移**：可以逐步从其他格式迁移到camelCase

### 2. 转换函数实现规范

#### JavaScript → ClojureScript
```clojure
;; ✅ 正确实现：纯类型转换，保持原键名
(defn js->clj-camelcase [js-obj]
  "将JavaScript对象转换为ClojureScript map，保持原始键名格式"
  (when js-obj
    (js->clj js-obj :keywordize-keys true)))

;; 使用示例
(defn update-module-data! [module-key data]
  (let [processed-data (cond
                        ;; JavaScript对象转换
                        (instance? js/Object data)
                        (js->clj-camelcase data)  ; 保持原键名
                        
                        ;; ClojureScript map直接使用
                        (map? data)
                        data
                        
                        ;; 其他情况保持原样
                        :else
                        data)]
    ;; 继续处理...
    ))
```

#### ClojureScript → JavaScript
```clojure
;; ✅ 正确实现：纯类型转换，保持原键名
(defn clj->js-camelcase [clj-data]
  "将ClojureScript数据转换为JavaScript对象，保持原始键名格式"
  (when clj-data
    (clj->js clj-data :keyword-fn identity)))

;; 在get-module-data中使用
(defn get-module-data [module-key]
  (let [clj-data (get @module-data module-key)]
    (when clj-data
      (clj->js-camelcase clj-data))))  ; 返回JavaScript对象
```

### 3. 数据传递规范

#### JavaScript → ClojureScript
```javascript
// ✅ 正确：直接传递，无需命名转换
const analysisData = {
  queryResult: queryResultData,  // camelCase
  show_result: true,           // snake_case (也支持)
  "stock-code": stockCode        // kebab-case (也支持)
};

// 直接传递给ClojureScript
data.updateModuleData('analysis', analysisData);

// 转换结果：{:queryResult ..., :show_result true, :stock-code ...}
// 所有键名格式都被完美保持！
```

#### ClojureScript → JavaScript
```javascript
// ✅ 正确：直接获取，已经是JavaScript对象
const analysisData = data.getModuleData('analysis');

// analysisData 格式与存储时完全一致
// 如果存储时是camelCase，获取时就是camelCase
// 如果存储时是kebab-case，获取时就是kebab-case
```

### 4. API集成规范

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

// ✅ 也支持：API返回其他格式
const fetchMixedFormatData = async (stockCode) => {
  const response = await fetch(`/api/stocks/${stockCode}/mixed`);
  const apiData = await response.json();
  // apiData格式: { "query_result": {...}, "show-result": true, "stock_code": "AAPL" }
  
  // 同样直接传递，键名格式会被保持
  data.updateModuleData('analysis', apiData);
  return apiData;
};
```

## 🔧 实施指南

### 1. 现有代码迁移步骤

#### 步骤1：评估现状（可选）
```clojure
;; 检查当前数据格式
(println @module-data)
;; 如果发现混合格式，决定是否统一为camelCase
```

#### 步骤2：统一数据格式（推荐）
```clojure
;; 从混合格式迁移到统一的camelCase
;; 之前（混合格式）：
{:query-result nil :showResult false :stock_code ""}

;; 之后（统一camelCase）：
{:queryResult nil :showResult false :stockCode ""}
```

#### 步骤3：更新数据访问代码
```clojure
;; 更新所有数据访问点以匹配新的键名
;; 之前：
(get-in @module-data [:analysis :query-result])

;; 之后：
(get-in @module-data [:analysis :queryResult])
```

### 2. 代码审查检查点

#### JavaScript代码审查清单
- [ ] 数据对象推荐使用camelCase命名
- [ ] 函数名使用camelCase命名
- [ ] 局部变量使用camelCase命名
- [ ] 与ClojureScript数据传递无命名转换
- [ ] API数据直接使用，无格式转换

#### ClojureScript代码审查清单
- [ ] 数据结构推荐使用camelCase关键字
- [ ] 函数名使用kebab-case命名
- [ ] 局部变量使用kebab-case命名
- [ ] 使用 `js->clj-camelcase` 处理JavaScript对象
- [ ] 使用 `clj->js-camelcase` 返回JavaScript对象
- [ ] 理解转换函数保持原键名格式的特性

### 3. 测试验证

#### 转换函数测试
```clojure
;; 测试不同格式的数据转换
(def test-data {:userName "张三" :user_age 25 "last-login" "2024-01-15"})

;; 测试 clj->js-camelcase
(println (clj->js-camelcase test-data))
;; 期望：{userName: "张三", user_age: 25, "last-login": "2024-01-15"}

;; 测试 js->clj-camelcase  
(def js-test-data #js {:userName "张三" :user_age 25 "last-login" "2024-01-15"})
(println (js->clj-camelcase js-test-data))
;; 期望：{:userName "张三", :user_age 25, :last-login "2024-01-15"}
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
    
    // 使用推荐的camelCase格式
    const updatedData = {
      queryResult: result,
      showResult: true,
      stockCode: stockCode
    };
    
    // 直接传递给ClojureScript，无命名转换
    data.updateModuleData('analysis', updatedData);
    setQueryResult(result);
    setShowResult(true);
  };

  return React.createElement('div', {}, /* UI */);
}
```

#### ClojureScript数据层
```clojure
;; 推荐使用camelCase数据结构
(defonce module-data
  (r/atom {:analysis {:queryResult nil
                       :showResult false
                       :stockCode ""}}))

;; 获取数据时自动转换为JavaScript对象
(defn get-module-data [module-key]
  (let [clj-data (get @module-data module-key)]
    (when clj-data
      (clj->js-camelcase clj-data))))

;; 更新数据时自动转换JavaScript对象
(defn update-module-data! [module-key data]
  (let [processed-data (cond
                        (instance? js/Object data)
                        (js->clj-camelcase data)  ; 保持原键名
                        (map? data)
                        data
                        :else
                        data)]
    ;; 存储逻辑...
    ))
```

## 🚀 迁移时间表

### 第一阶段（1周）：理解与测试
- [ ] 团队学习转换函数的真实行为
- [ ] 运行测试验证现有代码兼容性
- [ ] 确定数据格式统一策略

### 第二阶段（1-2周）：数据格式统一（可选）
- [ ] 评估是否需要统一为camelCase
- [ ] 更新数据结构为推荐格式
- [ ] 更新数据访问代码
- [ ] 运行测试确保功能正常

### 第三阶段（1周）：文档和培训
- [ ] 更新开发文档
- [ ] 团队培训和规范宣导
- [ ] 建立代码审查检查点

## 📋 快速参考

| 层面 | JavaScript | ClojureScript | 转换行为 |
|------|------------|---------------|-----------|
| 数据结构 | 推荐camelCase | 推荐camelCase关键字 | 保持原格式 |
| 函数名 | camelCase | kebab-case | 不适用 |
| 局部变量 | camelCase | kebab-case | 不适用 |
| API数据 | 直接使用 | 直接使用 | 保持原格式 |
| 数据传递 | 无命名转换 | 无命名转换 | 保持原格式 |

## 🎯 核心收益

1. **数据完整性**：完全保持原始键名格式，零数据丢失
2. **格式兼容性**：支持所有命名格式，向后兼容
3. **性能优化**：纯类型转换，无额外命名转换开销
4. **开发效率**：JavaScript开发者无学习成本
5. **维护简化**：减少因转换导致的bug和调试复杂度
6. **渐进迁移**：支持逐步统一到推荐格式

## 🔍 重要认知更新

### 转换函数的真实作用
- **不是命名转换器**：不会将camelCase转换为kebab-case
- **是类型转换器**：只进行JavaScript对象 ↔ ClojureScript map的转换
- **保持原格式**：所有键名格式都被完美保持

### 设计哲学
- **保持优于转换**：保持原始格式比强制转换更安全
- **兼容性优先**：支持多种格式，不破坏现有代码
- **渐进改进**：推荐统一格式，但不强制要求

## 🔄 与现有文档的关系

本规范是对 `js-clojurescript-data-bridge-guide.md` 的重要更新：

- **数据桥接指南**：专注于技术实现细节
- **命名规范指南**：基于实际测试结果的规范定义

两个文档应该结合使用，确保技术实现和代码规范的一致性。

## 📞 支持与反馈

如果在实施过程中遇到问题或有改进建议，请：

1. 查阅 `js-clojurescript-data-bridge-guide.md` 获取技术实现细节
2. 使用转换测试页面验证转换行为
3. 在团队会议中讨论规范的实际应用效果
4. 根据项目实际情况调整规范细节

---

**文档版本**: 2.0  
**创建日期**: 2025-11-05  
**更新日期**: 2025-11-07  
**适用范围**: Dashboard项目所有JavaScript和ClojureScript代码  
**维护责任**: 全体开发团队  
**相关文档**: [JavaScript与ClojureScript数据桥接指南](./js-clojurescript-data-bridge-guide.md)

## 📝 更新日志

### v2.0 (2025-11-07) - 重大更新
- 🔥 **重构**：基于实际测试结果完全重写核心原则
- 🔥 **修正**：转换函数实际行为说明（保持原键名格式）
- 🔥 **新增**：纯类型转换原则和对称设计原则
- 🔥 **新增**：重要发现章节，澄清函数命名误导
- 🔥 **新增**：格式兼容性说明，支持多种命名格式
- 🔧 **优化**：实施指南，增加渐进迁移选项
- 🔧 **优化**：最佳实践示例，反映真实转换行为

### v1.1 (2025-11-05)
- 🔥 **新增**：ClojureScript端JavaScript对象处理的技术细节
- 🔥 **新增**：`js->clj-camelcase` 专用转换函数的实现
- 🔥 **新增**：`:keywordize-keys false` 的使用说明
- 🔥 **新增**：代码审查检查点中关于JavaScript对象转换的具体要求
- 🔧 **优化**：数据传递规范的完整性和准确性

### v1.0 (2025-11-05)
- 🎉 **初始版本**：建立完整的命名规范体系
- 📋 **定义**：数据层camelCase + 函数层kebab-case的混合策略
- � **实施**：详细的迁移指南和最佳实践
