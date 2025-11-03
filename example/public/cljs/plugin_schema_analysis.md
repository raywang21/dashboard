# Plugin Schema 分析报告

## 当前实现分析

### 1. 字段类型检测函数（form-fields.cljs）
```clojure
(defn get-field-type [schema]
  (cond
    (contains? schema "enum") :enum
    (contains? schema "oneOf") :one-of
    (contains? schema "patternProperties") :pattern-object
    (= (get schema "type") "string") :string
    (= (get schema "type") "integer") :integer
    (= (get schema "type") "boolean") :boolean
    (= (get schema "type") "object") :object
    (= (get schema "type") "array") :array
    :else :string))
```

### 2. sample-schema3 字段类型分析

| 字段名 | 类型 | 当前检测能力 | 需要的处理 |
|--------|------|-------------|-----------|
| _meta | object | ✅ 支持 | 需要处理嵌套的 oneOf 字段 |
| allow_patterns | array | ✅ 支持 | 字符串数组，当前支持 |
| content_categories | object | ✅ 支持 | **需要特殊处理** - 复杂的嵌套对象 |
| deny_patterns | array | ✅ 支持 | 字符串数组，当前支持 |
| enable_content_category | boolean | ✅ 支持 | 简单布尔字段 |
| match_all_conversation_history | boolean | ✅ 支持 | 简单布尔字段 |
| match_all_roles | boolean | ✅ 支持 | 简单布尔字段 |

## 主要问题识别

### 1. content_categories 字段复杂性
```json
"content_categories": {
  "default": {
    "drugs": ["毒品", "dupin", "drugs"],
    "gambling": ["赌博", "dubo", "gambling"],
    // ... 更多类别，每个包含大量关键词
  },
  "type": "object"
}
```

**问题**：
- 对象的值都是字符串数组
- 数据量很大（包含数百个关键词）
- 需要更好的 UI 来管理和编辑

### 2. _meta 字段的 oneOf 处理
```json
"_meta": {
  "properties": {
    "error_response": {
      "oneOf": [{"type": "string"}, {"type": "object"}]
    }
  }
}
```

**问题**：当前 oneOf 字段处理需要改进

## 需要的修改

### 1. 增强 form-fields.cljs

#### A. 创建复杂对象字段组件
```clojure
(defn complex-object-field [path schema form-data])
```
- 支持大型对象的折叠/展开
- 为字符串数组提供更好的编辑界面
- 添加搜索和过滤功能

#### B. 改进 oneOf 字段处理
- 更好的类型选择界面
- 支持动态类型切换

#### C. 增强数组字段处理
- 支持数组的数组（如 content_categories 中的值）
- 提供标签式编辑界面

### 2. 更新 plugininfo.cljs

#### A. 改进数据格式化
```clojure
(defn format-complex-object-data [field-path field-schema raw-value])
```

#### B. 增强错误处理
- 对复杂数据结构的验证
- 更好的错误提示

### 3. 新增功能

#### A. 数据导入/导出
- 支持从文件导入敏感词列表
- 导出当前配置

#### B. 预设模板
- 常用的敏感词分类模板
- 快速配置选项

## 实施优先级

1. **高优先级**：complex-object-field 组件
2. **中优先级**：改进 oneOf 字段处理
3. **低优先级**：数据导入/导出功能
