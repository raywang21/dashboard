(ns enhanced-form-fields
  "增强的表单字段组件，用于处理复杂的插件 schema"
  (:require
   [reagent.core :as r]
   [clojure.string :as str]
   [form-fields :as ff]))

;; ===========================================
;; 增强的字段类型检测
;; ===========================================

;; 增强的字段类型检测函数
(defn get-enhanced-field-type
  "增强的字段类型检测，支持更多复杂类型"
  [schema]
  (cond
    (contains? schema "enum") :enum
    (contains? schema "oneOf") :one-of
    (contains? schema "patternProperties") :pattern-object
    (contains? schema "additionalProperties") :pattern-object
    (= (get schema "type") "string") :string
    (= (get schema "type") "integer") :integer
    (= (get schema "type") "boolean") :boolean
    (= (get schema "type") "object") :object
    (= (get schema "type") "array") :array
    :else :string))

;; 检测是否为内容分类对象（如 content_categories）
(defn is-content-categories-object?
  "检测是否为内容分类对象"
  [schema]
  (let [properties (get schema "properties")
        default-value (get schema "default")]
    (or 
     ;; 检查properties中包含预期分类
     (and properties
          (some #(= % "drugs") (keys properties))
          (some #(= % "gambling") (keys properties))
          (some #(= % "hate") (keys properties)))
     ;; 检查默认值中包含预期分类
     (and default-value
          (map? default-value)
          (some #(= % "drugs") (keys default-value))
          (some #(= % "gambling") (keys default-value))
          (some #(= % "hate") (keys default-value))))))

;; 检测是否为大型对象（包含大量属性）
(defn is-large-object?
  "检测是否为大型对象（超过10个属性）"
  [schema]
  (let [properties (get schema "properties")]
    (and properties (> (count properties) 10))))

;; ===========================================
;; 复杂对象字段组件
;; ===========================================

;; 内容分类辅助函数
(defn add-keyword-to-category [categories field-path form-data keyword-inputs-path category-name keyword-text]
  (when (and keyword-text 
             (not= (str/trim keyword-text) "")
             category-name
             (not (str/starts-with? (name category-name) "_")))  ;; 确保不是内部字段
    (let [clean-keyword (str/trim keyword-text)
          current-keywords (get categories category-name [])
          updated-keywords (if (some #(= % clean-keyword) current-keywords)
                            current-keywords  ;; 避免重复
                            (conj current-keywords clean-keyword))]
      (js/console.log "Adding keyword:" clean-keyword "to category:" category-name)
      (swap! form-data assoc-in (conj field-path category-name) updated-keywords)
      ;; 清空输入框
      (swap! form-data assoc-in (conj keyword-inputs-path category-name) ""))))

(defn remove-keyword-from-category [field-path form-data category-name keyword-to-remove]
  (let [current-keywords (get-in @form-data (conj field-path category-name) [])
        updated-keywords (vec (remove #(= % keyword-to-remove) current-keywords))]
    (swap! form-data assoc-in (conj field-path category-name) updated-keywords)))

(defn add-new-category [categories field-path form-data category-name-path category-keywords-path]
  (let [category-name (str/trim (get-in @form-data category-name-path))
        initial-keywords (->> (str/split-lines (get-in @form-data category-keywords-path))
                             (map str/trim)
                             (filter #(not= % "")))]
    (when (and (not= category-name "") 
               (not (contains? categories category-name)))
      (swap! form-data assoc-in (conj field-path category-name) initial-keywords)
      ;; 重置输入
      (swap! form-data assoc-in category-name-path "")
      (swap! form-data assoc-in category-keywords-path ""))))

(defn get-category-display-name [category-name]
  (case category-name
    "drugs" "毒品相关"
    "gambling" "赌博相关"
    "hate" "仇恨言论"
    "illegal" "违法信息"
    "political" "政治敏感"
    "porn" "色情内容"
    "self_harm" "自残自杀"
    "sensitive_info" "敏感信息"
    "terrorism" "恐怖主义"
    "violence" "暴力内容"
    category-name))

;; 过滤内部状态字段的辅助函数
(defn filter-internal-fields
  "过滤掉以 _ 开头的内部状态字段"
  [categories]
  (into {} (filter (fn [[category-name _]] 
                     (not (str/starts-with? (name category-name) "_"))) 
                   categories)))

;; 内容分类字段组件（专门处理 content_categories）
(defn content-categories-field
  "专门处理内容分类的字段组件"
  [field-path schema form-data]
  (let [current-value (get-in @form-data field-path)
        description (get schema "description")
        default-categories (get schema "default" {})
        categories (or current-value default-categories)
        
        ;; 过滤掉内部状态字段，只显示实际的数据分类
        display-categories (filter-internal-fields categories)
        
        ;; 使用 form-data 来管理编辑状态，避免局部 atoms
        new-keyword-inputs (get-in @form-data (conj field-path "_keyword_inputs") {})
        new-category-name (get-in @form-data (conj field-path "_new_category_name") "")
        new-category-keywords (get-in @form-data (conj field-path "_new_category_keywords") "")]
    
    ;; 添加调试日志
    (js/console.log "Debug - categories:" categories)
    (js/console.log "Debug - display-categories:" display-categories)
    (js/console.log "Debug - new-keyword-inputs:" new-keyword-inputs)
    
    [:div {:style {:margin-bottom "20px" :padding "16px" :border "2px solid #e3f2fd" :border-radius "8px" :background-color "#f8f9fa"}}
     [:h4 {:style {:margin-top "0" :margin-bottom "16px" :color "#1976d2" :display "flex" :align-items "center"}}
      [:span {:style {:margin-right "8px"}} "🏷️"]
      (last field-path)
      (when description
        [:span {:style {:color "#666" :font-size "14px" :margin-left "8px" :font-weight "normal"}} description])]
     
     ;; 分类列表 - 使用过滤后的数据
     (for [[category-name keywords] (sort display-categories)]
       ^{:key category-name}
       [:div {:style {:margin-bottom "16px" :padding "12px" :background-color "white" :border-radius "6px" :border "1px solid #e0e0e0"}}
        [:div {:style {:display "flex" :justify-content "space-between" :align-items "center" :margin-bottom "8px"}}
         [:h5 {:style {:margin "0" :color "#333" :font-size "14px" :font-weight "bold"}}
          (get-category-display-name category-name)]
         [:span {:style {:color "#666" :font-size "12px"}} (str (count keywords) " 个关键词")]]
        
        ;; 关键词标签（可删除）
        [:div {:style {:display "flex" :flex-wrap "wrap" :gap "4px" :margin-bottom "8px"}}
         (for [keyword keywords]
           ^{:key keyword}
           [:div {:style {:display "flex" :align-items "center" :background-color "#e3f2fd" :padding "2px 6px" :border-radius "3px" :font-size "11px" :border "1px solid #bbdefb"}}
            [:span {:style {:color "#1976d2"}} keyword]
            [:button 
             {:on-click #(remove-keyword-from-category field-path form-data category-name keyword)
              :style {:background "none" :border "none" :color "#1976d2" :cursor "pointer" :margin-left "4px" :padding "0" :font-size "12px" :line-height "1"}}
             "×"]])]
        
        ;; 添加关键词输入区域
        [:div {:style {:display "flex" :gap "4px"}}
         [:input 
          {:type "text"
           :value (get new-keyword-inputs category-name "")
           :placeholder "输入新关键词，按回车添加"
           :on-change #(swap! form-data assoc-in (conj field-path "_keyword_inputs" category-name) (-> % .-target .-value))
           :on-key-press #(when (= (.-key %) "Enter")
                           (add-keyword-to-category categories field-path form-data (conj field-path "_keyword_inputs") category-name (get new-keyword-inputs category-name "")))
           :style {:flex "1" :padding "6px" :border "1px solid #ddd" :border-radius "3px" :font-size "12px"}}]
         [:button 
          {:on-click #(add-keyword-to-category categories field-path form-data (conj field-path "_keyword_inputs") category-name (get new-keyword-inputs category-name ""))
           :disabled (or (not (get new-keyword-inputs category-name)) (= (str/trim (get new-keyword-inputs category-name "")) ""))
           :style {:background-color "#2196f3" :color "white" :border "none" :padding "6px 12px" :border-radius "3px" :cursor "pointer" :font-size "12px"}}
          "添加"]]])
     
     ;; 添加新分类区域
     [:div {:style {:margin-top "16px" :padding "12px" :background-color "#f5f5f5" :border-radius "6px" :border "1px dashed #ccc"}}
      [:h6 {:style {:margin "0 0 8px 0" :color "#666" :font-size "12px" :font-weight "bold"}} "添加新分类"]
      [:div {:style {:margin-bottom "8px"}}
       [:input 
        {:type "text"
         :value new-category-name
         :placeholder "分类名称（英文，如: new_category）"
         :on-change #(swap! form-data assoc-in (conj field-path "_new_category_name") (-> % .-target .-value))
         :style {:width "100%" :padding "6px" :border "1px solid #ddd" :border-radius "3px" :font-size "12px" :margin-bottom "4px"}}]]
      [:div {:style {:margin-bottom "8px"}}
       [:textarea 
        {:value new-category-keywords
         :placeholder "初始关键词（每行一个）"
         :on-change #(swap! form-data assoc-in (conj field-path "_new_category_keywords") (-> % .-target .-value))
         :style {:width "100%" :height "60px" :padding "6px" :border "1px solid #ddd" :border-radius "3px" :font-size "12px" :resize "vertical"}}]]
      [:div {:style {:text-align "right"}}
       [:button 
        {:on-click #(add-new-category categories field-path form-data (conj field-path "_new_category_name") (conj field-path "_new_category_keywords"))
         :disabled (or (= (str/trim new-category-name) "") (contains? categories new-category-name))
         :style {:background-color "#4caf50" :color "white" :border "none" :padding "8px 16px" :border-radius "4px" :cursor "pointer" :font-size "12px"}}
        "添加分类"]]]]))

;; 通用复杂对象字段组件
(defn complex-object-field
  "通用的复杂对象字段组件"
  [field-path schema form-data]
  (let [current-value (get-in @form-data field-path)
        description (get schema "description")
        properties (get schema "properties")
        collapsed? (get-in @form-data (conj field-path "_collapsed") true)]
    
    [:div {:style {:margin-bottom "20px" :padding "16px" :border "1px solid #ddd" :border-radius "8px" :background-color "#fafafa"}}
     [:div {:style {:display "flex" :justify-content "space-between" :align-items "center" :margin-bottom "12px" :cursor "pointer"}
             :on-click #(swap! form-data assoc-in (conj field-path "_collapsed") (not collapsed?))}
      [:h4 {:style {:margin "0" :color "#333" :display "flex" :align-items "center"}}
       [:span {:style {:margin-right "8px"}} (if collapsed? "▶" "▼")]
       (last field-path)
       (when description
         [:span {:style {:color "#666" :font-size "12px" :margin-left "8px" :font-weight "normal"}} description])]
      [:span {:style {:color "#999" :font-size "12px"}} 
       (str (count (or properties {})) " 个属性")]]
     
     ;; 属性内容（可折叠）
     (when-not collapsed?
       [:div {:style {:margin-top "12px"}}
        (for [[prop-name prop-schema] properties]
          (let [sub-path (conj field-path prop-name)
                field-type (get-enhanced-field-type prop-schema)]
            ^{:key prop-name}
            [:div {:style {:margin-bottom "12px" :padding "8px" :background-color "white" :border-radius "4px"}}
             [:label {:style {:display "block" :margin-bottom "4px" :font-weight "bold" :color "#555"}}
              prop-name
              (when (contains? prop-schema "description")
                [:span {:style {:color "#888" :font-size "11px" :margin-left "4px"}}
                 (get prop-schema "description")])]
             
             ;; 根据字段类型渲染不同的输入控件
             (case field-type
               :string [:input
                        {:type "text"
                         :value (get-in @form-data sub-path (or (get prop-schema "default") ""))
                         :placeholder (get prop-schema "placeholder" "请输入文本")
                         :on-change #(swap! form-data assoc-in sub-path (-> % .-target .-value))
                         :style {:width "100%" :padding "6px" :border "1px solid #ddd" :border-radius "3px"}}]
               
               :boolean [:label {:style {:display "flex" :align-items "center" :cursor "pointer"}}
                        [:input
                         {:type "checkbox"
                          :checked (get-in @form-data sub-path (get prop-schema "default" false))
                          :on-change #(swap! form-data assoc-in sub-path (-> % .-target .-checked))
                          :style {:margin-right "6px"}}]
                        (if (get-in @form-data sub-path) "启用" "禁用")]
               
               :integer [:input
                        {:type "number"
                         :value (get-in @form-data sub-path (or (get prop-schema "default") 0))
                         :min (get prop-schema "minimum")
                         :max (get prop-schema "maximum")
                         :on-change #(let [val (-> % .-target .-value)]
                                       (swap! form-data assoc-in sub-path (if (not= val "") (js/parseInt val) 0)))
                         :style {:width "100%" :padding "6px" :border "1px solid #ddd" :border-radius "3px"}}]
               
               :array [:div {:style {:border "1px solid #e0e0e0" :padding "8px" :border-radius "4px"}}
                       [:textarea
                        {:value (if (vector? (get-in @form-data sub-path)) 
                                  (str/join "\n" (get-in @form-data sub-path))
                                  "")
                         :placeholder "每行输入一个数组元素"
                         :on-change #(let [input-value (-> % .-target .-value)]
                                       (let [lines (->> (str/split-lines input-value)
                                                      (filter (fn [line] (not= line ""))))]
                                         (swap! form-data assoc-in sub-path lines)))
                         :style {:width "100%" :height "80px" :padding "6px" :border "none" :resize "vertical" :font-family "monospace" :font-size "12px"}}]]
               
               ;; 默认渲染为文本输入
               [:input
                {:type "text"
                 :value (str (get-in @form-data sub-path ""))
                 :placeholder "请输入值"
                 :on-change #(swap! form-data assoc-in sub-path (-> % .-target .-value))
                 :style {:width "100%" :padding "6px" :border "1px solid #ddd" :border-radius "3px"}}])]))])]))

;; ===========================================
;; 增强的 oneOf 字段组件
;; ===========================================

(defn enhanced-one-of-field
  "增强的 oneOf 字段组件"
  [field-path schema form-data]
  (let [options (get schema "oneOf")
        current-value (get-in @form-data field-path)
        description (get schema "description")
        selected-type (get-in @form-data (conj field-path "_type"))
        field-id (str "oneof-" (str/join "-" field-path))]
    
    [:div {:style {:margin-bottom "20px" :padding "16px" :border "1px solid #ffecb3" :border-radius "8px" :background-color "#fff8e1"}}
     [:h4 {:style {:margin-top "0" :margin-bottom "12px" :color "#f57c00"}}
      (last field-path)
      (when description
        [:span {:style {:color "#666" :font-size "12px" :margin-left "8px" :font-weight "normal"}} description])]
     
     ;; 类型选择器
     [:div {:style {:margin-bottom "12px"}}
      [:label {:style {:display "block" :margin-bottom "6px" :font-weight "bold" :color "#333"}} "选择类型："]
      [:select
       {:value (or selected-type "")
        :on-change #(let [new-type (-> % .-target .-value)]
                      ;; 清除旧值，设置新类型
                      (swap! form-data assoc-in field-path nil)
                      (swap! form-data assoc-in (conj field-path "_type") new-type))
        :style {:width "100%" :padding "8px" :border "1px solid #ddd" :border-radius "4px" :background-color "white"}}
       [:option {:value ""} "请选择类型..."]
       (for [option options]
         (let [type-label (case (get option "type")
                            "string" "字符串"
                            "object" "对象"
                            "integer" "整数"
                            "boolean" "布尔值"
                            "array" "数组"
                            (get option "type"))]
           [:option {:key (get option "type") :value (get option "type")} type-label]))]]
     
     ;; 根据选择的类型显示对应的输入字段
     (when selected-type
       (let [selected-option (first (filter #(= (get % "type") selected-type) options))]
         [:div {:style {:margin-top "12px" :padding "12px" :background-color "white" :border-radius "6px" :border "1px solid #e0e0e0"}}
          [:div {:style {:margin-bottom "8px" :font-weight "bold" :color "#555"}}
           (str "输入 " (case selected-type
                        "string" "字符串"
                        "object" "JSON 对象"
                        "integer" "整数"
                        "boolean" "布尔值"
                        "array" "JSON 数组"
                        selected-type) " 值：")]
          
          (case selected-type
            "string" [:input
                     {:type "text"
                      :value (or current-value "")
                      :placeholder "请输入字符串值"
                      :on-change #(swap! form-data assoc-in field-path (-> % .-target .-value))
                      :style {:width "100%" :padding "8px" :border "1px solid #ddd" :border-radius "4px"}}]
            
            "integer" [:input
                      {:type "number"
                       :value (or current-value 0)
                       :on-change #(let [val (-> % .-target .-value)]
                                     (swap! form-data assoc-in field-path (if (not= val "") (js/parseInt val) 0)))
                       :style {:width "100%" :padding "8px" :border "1px solid #ddd" :border-radius "4px"}}]
            
            "boolean" [:label {:style {:display "flex" :align-items "center" :cursor "pointer"}}
                      [:input
                       {:type "checkbox"
                        :checked (or current-value false)
                        :on-change #(swap! form-data assoc-in field-path (-> % .-target .-checked))
                        :style {:margin-right "8px"}}]
                      (if current-value "真" "假")]
            
            "object" [:textarea
                     {:value (if (string? current-value) current-value (js/JSON.stringify (clj->js current-value) nil 2))
                      :placeholder "请输入JSON对象，如：{\"key\": \"value\"}"
                      :on-change #(swap! form-data assoc-in field-path (-> % .-target .-value))
                      :style {:width "100%" :height "100px" :padding "8px" :border "1px solid #ddd" :border-radius "4px" :font-family "monospace" :font-size "12px"}}]
            
            "array" [:textarea
                    {:value (if (string? current-value) current-value (js/JSON.stringify (clj->js current-value) nil 2))
                     :placeholder "请输入JSON数组，如：[\"item1\", \"item2\"]"
                     :on-change #(swap! form-data assoc-in field-path (-> % .-target .-value))
                     :style {:width "100%" :height "100px" :padding "8px" :border "1px solid #ddd" :border-radius "4px" :font-family "monospace" :font-size "12px"}}]
            
            [:div {:style {:color "#666" :font-size "12px"}} "暂不支持此类型"])]))]))

;; ===========================================
;; 增强的数据格式化函数
;; ===========================================

(defn format-content-categories-data
  "格式化内容分类数据，过滤内部状态字段和空值"
  [field-path field-schema raw-value]
  (when (and raw-value (map? raw-value))
    (let [formatted-data (atom {})]
      (doseq [[category keywords] raw-value]
        ;; 过滤掉内部状态字段（以 _ 开头的字段）和空值
        (when (and (not (str/starts-with? (name category) "_"))
                   (vector? keywords)
                   (not (empty? keywords)))  ;; 只包含非空关键词的分类
          (let [filtered-keywords (filter (fn [kw] (and kw (not= kw "") (not (nil? kw)))) keywords)]
            (when (not (empty? filtered-keywords))  ;; 确保过滤后仍有关键词
              (js/console.log "Keeping category:" category "filtered keywords:" filtered-keywords)
              (swap! formatted-data assoc category filtered-keywords)))))
      (let [result @formatted-data]
        (js/console.log "Final formatted content categories data:" result)
        result))))

(defn format-complex-object-data
  "格式化复杂对象数据"
  [field-path field-schema raw-value]
  (when raw-value
    (if (map? raw-value)
      raw-value
      (try
        (js->clj (js/JSON.parse raw-value))
        (catch js/Error e
          (js/console.warn "无法解析复杂对象数据:" raw-value e)
          nil)))))

(defn format-enhanced-field-value
  "增强的字段值格式化器"
  [field-path field-schema raw-value]
  (let [field-type (get-enhanced-field-type field-schema)
        constraints (ff/get-field-constraints field-schema)]

    (when (and (not (nil? raw-value))
               (not= raw-value ""))
      (case field-type
        :integer (if (string? raw-value)
                   (js/parseInt raw-value)
                   raw-value)
        :boolean (if (string? raw-value)
                   (= raw-value "true")
                   raw-value)
        :array (if (string? raw-value)
                 (->> (str/split-lines raw-value)
                      (filter (fn [line] (not= line ""))))
                 (if (vector? raw-value) raw-value [raw-value]))
        :object (cond
                  ;; 内容分类对象特殊处理
                  (is-content-categories-object? field-schema)
                  (format-content-categories-data field-path field-schema raw-value)
                  
                  ;; 其他复杂对象处理
                  (is-large-object? field-schema)
                  (format-complex-object-data field-path field-schema raw-value)
                  
                  ;; 普通对象
                  :else raw-value)
        raw-value))))

;; ===========================================
;; 主要的字段渲染函数
;; ===========================================

(defn render-enhanced-field
  "增强的字段渲染函数"
  [field-path field-schema form-data]
  (let [field-type (get-enhanced-field-type field-schema)
        field-name (last field-path)
        constraints (ff/get-field-constraints field-schema)
        ui-hints (ff/get-ui-hints field-schema)]

    ;; 特殊字段检测和处理
    (cond
      ;; 内容分类字段特殊处理
      (and (= field-name "content_categories")
           (is-content-categories-object? field-schema))
      (content-categories-field field-path field-schema form-data)
      
      ;; 大型对象特殊处理
      (and (= field-type :object)
           (is-large-object? field-schema))
      (complex-object-field field-path field-schema form-data)
      
      ;; oneOf 字段处理
      (= field-type :one-of)
      (enhanced-one-of-field field-path field-schema form-data)
      
      ;; 使用原有的字段组件
      :else (case field-type
              :string (ff/enhanced-text-field field-path field-schema form-data constraints ui-hints)
              :enum (ff/enum-field field-path field-schema form-data)
              :integer (ff/enhanced-number-field field-path field-schema form-data constraints ui-hints)
              :boolean (ff/boolean-field field-path field-schema form-data)
              :object (ff/simple-object-field field-path field-schema form-data)
              :pattern-object (ff/simple-object-field field-path field-schema form-data)
              :one-of (ff/one-of-field field-path field-schema form-data)
              :array (ff/enhanced-array-field field-path field-schema form-data constraints ui-hints)
              [:div {:style {:color "red" :padding "8px"}} "Unsupported field type: " field-type]))))

;; ===========================================
;; 导出函数
;; ===========================================

;; 导出主要函数供其他模块使用
(set! (.-render_enhanced_field js/window) render-enhanced-field)
(set! (.-get_enhanced_field_type js/window) get-enhanced-field-type)
(set! (.-format_enhanced_field_value js/window) format-enhanced-field-value)
(set! (.-format_content_categories_data js/window) format-content-categories-data)

(js/console.log "enhanced_form_fields.cljs loaded successfully!")
