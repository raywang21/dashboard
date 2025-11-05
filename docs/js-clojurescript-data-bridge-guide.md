# JavaScript 与 ClojureScript 数据桥接指南

## 📋 概述

本文档总结了在 `stock-analysis.js`、`dashboard-main.js` 和 `main.cljs` 之间建立数据传递时遇到的问题和解决方案。

## 🔍 问题分析

### 核心问题
JavaScript (React) 与 ClojureScript (Reagent) 之间的数据传递存在多层格式不匹配问题。

### 具体问题点

#### 1. 数据键名格式不匹配
- **JavaScript 使用 camelCase**: `queryResult`, `showResult`, `stockCode`
- **ClojureScript 期望 kebab-case**: `query-result`, `show-result`, `stock-code`

#### 2. 数据类型转换问题
- JavaScript 对象传递到 ClojureScript 时需要正确的类型转换
- ClojureScript 的 `update-module-data!` 函数需要正确识别和处理 JavaScript 对象

#### 3. 数据合并逻辑问题
- ClojureScript 端的 `update-module-data!` 函数需要区分合并和替换操作
- 需要正确处理嵌套对象的合并

## 🛠️ 解决方案

### 1. stock-analysis.js 数据上传设计

```javascript
// ✅ 正确的数据格式 - 使用 kebab-case 匹配 ClojureScript
const updatedAnalysisData = {
  ...currentAnalysisData,
  "query-result": queryResultData,    // ✅ kebab-case
  "show-result": true,              // ✅ kebab-case  
  "stock-code": stockCode           // ✅ kebab-case
};

// ✅ 通过 data.updateModuleData 上传
data.updateModuleData('analysis', updatedAnalysisData);
```

**关键点：**
- 使用字符串键名确保与 ClojureScript 匹配
- 保持数据结构的完整性
- 通过 props 传递的函数进行更新

### 2. dashboard-main.js 函数中转设计

```javascript
// ✅ 正确的回调函数传递
return React.createElement(Component, { 
  data: {
    ...componentData,
    updateModuleData: componentCallbacks.updateModuleData,  // ✅ 直接传递函数引用
    getModuleData: componentCallbacks.getModuleData,      // ✅ 直接传递函数引用
    callCljsFunc: componentCallbacks.callCljsFunc,
    addLog: componentCallbacks.addLog,
    clearLogs: componentCallbacks.clearLogs
  }
});
```

**关键点：**
- 直接传递函数引用，避免包装
- 确保所有必要的桥接函数都可用
- 保持数据流的单向性

### 3. main.cljs 数据结构设计

```clojure
;; ✅ 正确的 atom 结构
(defonce module-data
  (r/atom {:analysis {:stock-data {}
                       :logs []
                       :is-running false
                       :current-task "无"
                       :start-time nil
                       :running-time "00:00:00"
                       :stock-code ""           ; ✅ kebab-case
                       :query-result nil         ; ✅ kebab-case
                       :show-result false        ; ✅ kebab-case
                       :loading {:start false
                               :stop false
                               :query false}}}))
```

**关键点：**
- 统一使用 kebab-case 命名
- 保持数据结构的完整性
- 初始化合理的默认值

### 4. main.cljs 更新函数设计

```clojure
;; ✅ 正确的更新逻辑
(defn update-module-data! [module-key data]
  (println "update-module-data! called with:" module-key data)
  (println "Data type:" (type data))
  (println "Is map?" (map? data))
  
  (let [processed-data (cond
                        ;; 如果是JavaScript对象，转换为ClojureScript map
                        (and (exists? js/Object) (instance? js/Object data))
                        (do
                          (println "Converting JavaScript object to ClojureScript map")
                          (js->clj data :keywordize-keys true))
                        
                        ;; 如果已经是ClojureScript map，直接使用
                        (map? data)
                        data
                        
                        ;; 其他情况，保持原样
                        :else
                        data)]
    
    (if (map? processed-data)
      ;; 如果processed-data是map，则合并更新
      (do
        (println "Merging data for module:" module-key)
        (swap! module-data update-in [module-key] merge processed-data))
      ;; 如果processed-data不是map，则直接替换整个模块数据
      (do
        (println "Replacing entire module data for:" module-key)
        (swap! module-data assoc module-key processed-data)))
    
    ;; 通知所有订阅者
    (doseq [callback @data-subscribers]
      (when callback
        (callback module-key processed-data)))
    (println "Module data after update:" (get @module-data module-key))
    (println "Full module-data:" @module-data)))
```

**关键点：**
- 使用 `map?` 检查数据类型
- `merge` 用于部分更新，`assoc` 用于完整替换
- 详细的调试日志帮助问题定位

## 🎯 最佳实践

### 1. 数据命名规范
- **统一使用 kebab-case**: `query-result`, `show-result`, `stock-code`
- **避免混合格式**: 不要在同一项目中混用 camelCase 和 kebab-case
- **制定命名约定**: 在项目开始时确定并遵守

### 2. 数据传递规范
- **JavaScript → ClojureScript**: 使用字符串键名的对象
- **函数传递**: 直接传递函数引用，不要包装
- **类型一致性**: 确保两端数据结构匹配

### 3. 调试策略
- **分层日志**: 在每个数据传递层添加日志
- **类型检查**: 验证数据类型和结构
- **状态验证**: 确认数据是否正确更新

### 4. 错误处理
- **降级处理**: 当 bridge 不可用时的备用方案
- **类型验证**: 检查传入数据的类型
- **状态同步**: 确保 UI 状态与后端状态一致

## 📚 经验总结

### 1. 数据格式一致性是最重要的
- 前后端数据格式必须完全匹配
- 任何不匹配都会导致数据丢失
- 建议使用 JSON Schema 验证

### 2. 分层调试有助于快速定位问题
- 在每个数据传递点添加日志
- 使用结构化日志格式
- 包含数据类型和内容信息

### 3. 函数传递要直接，避免包装
- 直接传递函数引用
- 避免在中间层修改函数行为
- 保持函数的原始签名

### 4. ClojureScript 的 `merge` 和 `assoc` 要正确使用
- `merge` 用于部分数据更新
- `assoc` 用于完整数据替换
- 根据使用场景选择合适的方法

### 5. JavaScript 对象键名要匹配 ClojureScript 期望
- 使用字符串键名，避免符号转换问题
- 保持命名约定的一致性
- 在文档中明确说明格式要求

### 6. 🔥 **新增：JavaScript 对象转换的关键问题**
- **问题**：JavaScript 对象传递到 ClojureScript 时，键名可能同时存在字符串和关键字两种格式
- **现象**：数据中同时出现 `"show-result": true` 和 `:show-result false`，导致数据冲突
- **解决方案**：在 ClojureScript 端使用 `js->clj` 转换时必须设置 `:keywordize-keys true`
- **代码示例**：
  ```clojure
  ;; ✅ 正确的转换方式
  (js->clj data :keywordize-keys true)
  
  ;; ❌ 错误的转换方式（会导致键名不一致）
  (js->clj data)
  ```

### 7. 🔥 **新增：键名冲突的检测和解决**
- **问题现象**：同一个字段同时存在字符串键和关键字键，值不一致
- **检测方法**：查看 ClojureScript atom 数据，检查是否有重复键名
- **解决策略**：
  1. 统一使用关键字键（ClojureScript 标准）
  2. 在 `update-analysis-data!` 中添加键名转换逻辑
  3. 优先使用专门的字段更新函数而非整体替换

### 8. 🔥 **新增：逐字段更新 vs 整体替换的选择**
- **逐字段更新**（推荐）：
  ```javascript
  // ✅ 推荐：使用专门的更新函数
  window.clojureBridge.updateAnalysisData("query-result", queryResultData);
  window.clojureBridge.updateAnalysisData("show-result", true);
  window.clojureBridge.updateAnalysisData("stock-code", stockCode);
  ```
- **整体替换**（备用方案）：
  ```javascript
  // ⚠️ 备用：整体替换，需要确保键名格式正确
  const keywordUpdatedData = {
    "query-result": queryResultData,
    "show-result": true,
    "stock-code": stockCode
  };
  data.updateModuleData('analysis', keywordUpdatedData);
  ```

### 9. 🔥 **新增：调试日志的最佳实践**
- **ClojureScript 端**：
  ```clojure
  (defn update-analysis-data! [key value]
    (println "update-analysis-data! called with:" key value)
    (let [current-data (get-in @module-data [:analysis])
          keyword-key (if (keyword? key) key (keyword key))]
      (println "Current analysis data:" current-data)
      (println "Updating key:" keyword-key "with value:" value)
      (update-module-data! :analysis (assoc current-data keyword-key value))
      (println "Updated analysis data:" (get-in @module-data [:analysis]))))
  ```
- **JavaScript 端**：
  ```javascript
  console.log('准备同步的查询结果数据:', queryResultData);
  console.log('当前分析数据:', currentAnalysisData);
  console.log('使用 updateAnalysisData 逐字段更新完成');
  ```

### 10. 🔥 **新增：数据流验证的完整流程**
1. **JavaScript 查询获取数据** → 
2. **本地状态更新** → 
3. **同步到 ClojureScript atom** → 
4. **验证 atom 数据结构** → 
5. **UI 响应式更新**
- 每一步都要有日志验证
- 发现问题时要能快速定位到具体步骤

## 🚀 快速检查清单

### 开发时检查点
- [ ] 数据键名格式是否统一 (kebab-case)
- [ ] 函数传递是否直接 (无包装)
- [ ] ClojureScript 端是否正确处理 JavaScript 对象
- [ ] 是否有足够的调试日志
- [ ] 错误处理是否完善
- [ ] 🔥 **新增：js->clj 转换是否使用 :keywordize-keys true**
- [ ] 🔥 **新增：是否存在键名冲突（字符串键 vs 关键字键）**
- [ ] 🔥 **新增：是否优先使用逐字段更新而非整体替换**
- [ ] 🔥 **新增：update-analysis-data! 函数是否有键名转换逻辑**

### 测试时检查点
- [ ] 数据是否能正确从 JavaScript 传递到 ClojureScript
- [ ] ClojureScript atom 是否正确更新
- [ ] UI 是否能正确显示更新后的数据
- [ ] 错误情况下的数据流是否正常

## � 参考资源

### 相关文件
- `pages/stock-analysis.js` - React 组件
- `dashboard-main.js` - 主仪表板和路由
- `main.cljs` - ClojureScript 数据层

### 关键函数
- `data.updateModuleData()` - JavaScript 端数据更新
- `update-module-data!()` - ClojureScript 端数据更新
- `data.getModuleData()` - JavaScript 端数据获取
- `get-module-data()` - ClojureScript 端数据获取

## 🎉 修复成功案例

### 净资产查询数据同步问题修复

**问题描述**：
- 净资产查询结果无法正确更新到 ClojureScript atom
- 数据中存在键名冲突：同时有字符串键和关键字键
- `:query-result` 字段始终为 nil，导致查询结果无法显示

**根本原因**：
1. JavaScript 对象转换时未使用 `:keywordize-keys true`
2. 键名格式不一致导致数据冲突
3. 整体替换数据时覆盖了其他字段

**解决方案**：
1. **修复 JavaScript 对象转换**：
   ```clojure
   ;; 在 update-module-data! 中
   (js->clj data :keywordize-keys true)
   ```

2. **增强键名处理逻辑**：
   ```clojure
   ;; 在 update-analysis-data! 中
   (defn update-analysis-data! [key value]
     (let [keyword-key (if (keyword? key) key (keyword key))]
       (update-module-data! :analysis (assoc current-data keyword-key value))))
   ```

3. **优化数据更新策略**：
   ```javascript
   // 优先使用逐字段更新
   window.clojureBridge.updateAnalysisData("query-result", queryResultData);
   window.clojureBridge.updateAnalysisData("show-result", true);
   window.clojureBridge.updateAnalysisData("stock-code", stockCode);
   ```

**修复结果**：
- ✅ 查询结果正确存储到 `:query-result` 字段
- ✅ 键名冲突完全解决
- ✅ 数据流完整：JavaScript → ClojureScript → UI
- ✅ 净资产查询功能完全正常

---

**更新日期**: 2025-11-05  
**版本**: 1.1  
**作者**: Dashboard Team  
**更新内容**: 新增 JavaScript 对象转换和键名冲突修复经验
