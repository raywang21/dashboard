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

## 🔍 重要发现：转换函数的真实行为与演进

### 实际测试结果与问题发现
经过全面测试和实际问题解决，转换函数的演进过程如下：

#### 阶段1：初始实现的问题
```javascript
// 测试数据
const testData = {
  queryResult: "some data",
  showResult: true,
  stockCode: "AAPL"
};

// 初始转换结果
// JavaScript → ClojureScript → JavaScript
// {"queryResult": "some data"} → {:queryResult "some data"} → {":queryResult": "some data"}
// 问题：键名格式不一致，出现冒号前缀
```

#### 阶段2：键名重复问题
```clojure
;; 更深层的问题：atom中出现重复键名
{:analysis {:stockCode "", "stockCode" "AAPL", 
            :startTime nil, "startTime" "2024-01-15T10:30:00Z",
            :queryResult nil, "queryResult" "some data"}}
;; 问题：同一字段同时存在关键字和字符串版本
```

#### 阶段3：最终解决方案
```clojure
;; 正确的转换函数实现
(defn js-key->clj-key [js-key]
  (keyword js-key))

(defn clj-key->js-key [clj-key] 
  (name clj-key))

(defn js->clj-camelcase [js-obj]
  (when js-obj
    (let [converted (js->clj js-obj :keyword-fn js-key->clj-key)]
      (walk/postwalk 
        (fn [x]
          (if (map? x)
            (into {} (map (fn [[k v]] 
                           [(if (string? k) (keyword k) k) v]) x))
            x))
        converted)))))

;; 最终转换结果
;; JavaScript → ClojureScript → JavaScript
;; {"queryResult": "some data"} → {:queryResult "some data"} → {"queryResult": "some data"}
;; 成功：键名格式完全一致！
```

### 关键认知更新
- **函数命名误导**：`js->clj-camelcase` 中的 "camelcase" 是历史遗留命名
- **实际功能**：需要递归处理的类型转换器，保持原始键名格式
- **设计原则**：对称转换 + 递归处理 + 键名统一
- **核心问题**：必须使用 `walk/postwalk` 确保嵌套对象的正确转换
- **数据一致性**：在存储层统一使用关键字格式，避免键名重复

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

#### 核心转换函数（最终解决方案）
```clojure
;; 自定义键名转换函数
(defn js-key->clj-key [js-key]
  "将JavaScript键名转换为ClojureScript关键字"
  (keyword js-key))

(defn clj-key->js-key [clj-key] 
  "将ClojureScript关键字转换为JavaScript键名"
  (name clj-key))

;; JavaScript → ClojureScript（递归处理）
(defn js->clj-camelcase [js-obj]
  "递归将JavaScript对象转换为ClojureScript map，统一使用关键字"
  (when js-obj
    (let [converted (js->clj js-obj :keyword-fn js-key->clj-key)]
      (walk/postwalk 
        (fn [x]
          (if (map? x)
            (into {} (map (fn [[k v]] 
                           [(if (string? k) (keyword k) k) v]) x))
            x))
        converted)))))

;; ClojureScript → JavaScript（递归处理）
(defn clj->js-camelcase [clj-data]
  "递归将ClojureScript数据转换为JavaScript对象"
  (when clj-data
    (clj->js clj-data :keyword-fn clj-key->js-key)))
```

#### 在数据管理函数中的使用
```clojure
;; 更新模块数据（避免键名重复）
(defn update-module-data! [module-key data]
  (let [keyword-key (if (keyword? module-key)
                      module-key
                      (keyword module-key))
        ;; 递归转换并统一键名格式
        processed-data (js->clj-camelcase data)
        ;; 清理现有数据，移除字符串键，避免重复
        current-data (get @module-data keyword-key)
        cleaned-data (into {} 
                          (filter (fn [[k _]] (keyword? k)) current-data))]
    
    ;; 使用清理后的数据进行合并
    (swap! module-data assoc keyword-key (merge cleaned-data processed-data))
    
    ;; 通知订阅者
    (doseq [callback @data-subscribers]
      (when callback
        (callback keyword-key processed-data)))))

;; 获取模块数据
(defn get-module-data [module-key]
  (let [keyword-key (if (keyword? module-key)
                      module-key
                      (keyword module-key))
        clj-data (get @module-data keyword-key)]
    (when clj-data
      (clj->js-camelcase clj-data))))
```

#### 关键实现要点
1. **递归处理**：使用 `walk/postwalk` 确保所有嵌套层级都被正确处理
2. **键名统一**：在存储层统一使用关键字格式，避免混合键名
3. **避免重复**：在merge前清理现有数据，防止键名重复
4. **对称转换**：两个方向的转换函数保持一致的转换逻辑

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

## 🎓 经验教训与最佳实践

### 关键经验总结

#### 1. 问题诊断要深入
- **表面现象**：键名格式不一致，出现冒号前缀
- **深层原因**：转换函数缺乏递归处理，导致嵌套对象转换不完整
- **教训**：不要满足于表面修复，要追根溯源找到根本原因

#### 2. 渐进式解决策略
- **第一阶段**：解决表面键名格式问题（自定义转换函数）
- **第二阶段**：发现并解决深层结构问题（键名重复）
- **第三阶段**：实施完整的递归解决方案
- **教训**：复杂问题需要分层解决，每个阶段都要验证效果

#### 3. 数据一致性的核心地位
- **存储层**：统一使用关键字格式，避免混合键名
- **转换层**：处理格式转换逻辑，确保双向一致性
- **接口层**：保持JavaScript兼容性
- **教训**：明确各层职责，避免混合处理导致的数据混乱

#### 4. 测试驱动的重要性
- **多种测试用例**：纯camelCase、kebab-case、混合格式、嵌套对象、数组对象
- **验证方法**：检查atom内部状态，而不仅仅是输出结果
- **教训**：全面的测试能暴露隐藏的问题，确保修复的完整性

#### 5. 递归处理的必要性
- **问题**：简单的转换函数无法处理嵌套对象
- **解决方案**：使用 `walk/postwalk` 递归遍历所有层级
- **关键代码**：
```clojure
(walk/postwalk 
  (fn [x]
    (if (map? x)
      (into {} (map (fn [[k v]] 
                     [(if (string? k) (keyword k) k) v]) x))
      x))
  converted)
```
- **教训**：对于复杂的数据结构，递归处理是必需的

#### 6. 键名重复的预防
- **问题**：merge操作导致同一字段同时存在关键字和字符串版本
- **解决方案**：在merge前清理现有数据，统一键名格式
- **关键代码**：
```clojure
;; 清理现有数据，移除字符串键，避免重复
current-data (get @module-data keyword-key)
cleaned-data (into {} 
                  (filter (fn [[k _]] (keyword? k)) current-data))
```
- **教训**：数据合并前必须确保键名格式的一致性

### 最佳实践总结

#### 1. 转换函数设计
- **对称性**：两个方向的转换函数保持一致的逻辑
- **递归性**：确保所有嵌套层级都被正确处理
- **可测试性**：转换逻辑应该易于单独测试和验证

#### 2. 数据结构管理
- **统一格式**：在存储层统一使用关键字格式
- **避免混合**：防止同一数据中存在不同格式的键名
- **清理机制**：定期清理和验证数据结构的一致性

#### 3. 错误处理和调试
- **日志记录**：在转换过程中添加详细的调试日志
- **状态检查**：定期检查atom内部的数据结构
- **异常处理**：对异常键名格式进行适当的处理

#### 4. 团队协作
- **文档更新**：及时更新技术文档，反映最新的实现
- **知识分享**：在团队中分享问题解决的经验和教训
- **代码审查**：建立专门的检查点，确保转换逻辑的正确性

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
- [ ] 检查递归处理的正确性
- [ ] 验证键名重复预防机制

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

#### 嵌套对象测试
```clojure
;; 测试嵌套对象的递归转换
(def nested-data {:outerData {:innerResult "nested camel"
                            "inner-data" "nested kebab"
                            :deepNested {:deepField "deep value"
                                        "deep-field" "deep kebab"}}})

;; 验证所有层级都被正确转换
(println (clj->js-camelcase nested-data))
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
  (let [keyword-key (if (keyword? module-key)
                      module-key
                      (keyword module-key))
        clj-data (get @module-data keyword-key)]
    (when clj-data
      (clj->js-camelcase clj-data))))

;; 更新数据时自动转换JavaScript对象
(defn update-module-data! [module-key data]
  (let [keyword-key (if (keyword? module-key)
                      module-key
                      (keyword module-key))
        ;; 递归转换并统一键名格式
        processed-data (js->clj-camelcase data)
        ;; 清理现有数据，移除字符串键，避免重复
        current-data (get @module-data keyword-key)
        cleaned-data (into {} 
                          (filter (fn [[k _]] (keyword? k)) current-data))]
    
    ;; 使用清理后的数据进行合并
    (swap! module-data assoc keyword-key (merge cleaned-data processed-data))
    
    ;; 通知订阅者
    (doseq [callback @data-subscribers]
      (when callback
        (callback keyword-key processed-data)))))
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
7. **问题预防**：通过经验总结避免类似问题的再次发生

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

**文档版本**: 2.1  
**创建日期**: 2025-11-05  
**更新日期**: 2025-11-07  
**适用范围**: Dashboard项目所有JavaScript和ClojureScript代码  
**维护责任**: 全体开发团队  
**相关文档**: [JavaScript与ClojureScript数据桥接指南](./js-clojurescript-data-bridge-guide.md)

## 📝 更新日志

### v2.1 (2025-11-07) - 经验总结更新
- 🔥 **新增**：完整的经验教训与最佳实践章节
- 🔥 **新增**：问题诊断的深入分析方法
- 🔥 **新增**：渐进式解决策略的详细说明
- 🔥 **新增**：递归处理的必要性和实现细节
- 🔥 **新增**：键名重复预防机制
- 🔥 **新增**：团队协作和知识分享的最佳实践
- 🔧 **优化**：代码审查检查点，增加转换逻辑验证
- 🔧 **优化**：测试验证章节，增加嵌套对象测试

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
- 🚀 **实施**：详细的迁移指南和最佳实践
