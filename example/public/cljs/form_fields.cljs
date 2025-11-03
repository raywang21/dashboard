(ns form-fields
  (:require
   [clojure.string :as str]))

;; ===========================================
;; 表单字段组件集合
;; ===========================================

;; 获取字段类型的辅助函数
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

;; 获取字段约束的辅助函数
(defn get-field-constraints [schema]
  {:min-length (get schema "minLength")
   :max-length (get schema "maxLength")
   :pattern (get schema "pattern")
   :format (get schema "format")
   :default (get schema "default")
   :minimum (get schema "minimum")
   :maximum (get schema "maximum")
   :multiple-of (get schema "multipleOf")})

;; 获取UI提示的辅助函数
(defn get-ui-hints [schema]
  {:placeholder (get schema "placeholder")
   :read-only (get schema "readOnly")
   :example (get schema "example")})

;; 增强的文本字段组件
(defn enhanced-text-field [path schema form-data constraints ui-hints]
  (let [value (get-in @form-data path (or (:default constraints) ""))
        description (get schema "description")
        placeholder (or (:placeholder ui-hints) 
                        (case (:format constraints)
                          "email" "请输入邮箱地址"
                          "uri" "请输入URL地址"
                          "password" "请输入密码"
                          "请输入文本"))
        min-length (:min-length constraints)
        max-length (:max-length constraints)
        pattern (:pattern constraints)]
    [:div {:style {:margin-bottom "16px"}}
     [:label {:style {:display "block" :margin-bottom "4px" :font-weight "bold"}}
      (last path)
      (when description
        [:span {:style {:color "#666" :font-size "12px" :margin-left "8px"}} description])
      (when (:default constraints)
        [:span {:style {:color "#999" :font-size "11px" :margin-left "4px"}} 
         (str "(默认: " (:default constraints) ")")])]
     [:input
      {:type (if (= (:format constraints) "password") "password" "text")
       :value value
       :placeholder placeholder
       :minlength min-length
       :maxlength max-length
       :pattern pattern
       :readOnly (:read-only ui-hints)
       :on-change #(swap! form-data assoc-in path (-> % .-target .-value))
       :style {:width "100%" :padding "8px" :border "1px solid #ddd" :border-radius "4px"}}]
     (when (or min-length max-length)
       [:div {:style {:font-size "11px" :color "#666" :margin-top "2px"}}
        (when min-length (str "最少 " min-length " 个字符"))
        (when (and min-length max-length) " / ")
        (when max-length (str "最多 " max-length " 个字符"))])]))

;; 保持向后兼容的文本字段组件
(defn text-field [path schema form-data]
  (enhanced-text-field path schema form-data (get-field-constraints schema) (get-ui-hints schema)))

;; 枚举字段组件
(defn enum-field [path schema form-data]
  (let [value (get-in @form-data path)
        options (get schema "enum")
        description (get schema "description")]
    [:div {:style {:margin-bottom "16px"}}
     [:label {:style {:display "block" :margin-bottom "4px" :font-weight "bold"}}
      (last path)
      (when description
        [:span {:style {:color "#666" :font-size "12px" :margin-left "8px"}} description])]
     [:select
      {:value (or value "")
       :on-change #(swap! form-data assoc-in path (-> % .-target .-value))
       :style {:width "100%" :padding "8px" :border "1px solid #ddd" :border-radius "4px"}}
      [:option {:value ""} "请选择..."]
      (for [option options]
        [:option {:key option :value option} option])]]))

;; 增强的数字字段组件
(defn enhanced-number-field [path schema form-data constraints ui-hints]
  (let [value (get-in @form-data path (or (:default constraints) ""))
        description (get schema "description")
        placeholder (or (:placeholder ui-hints) "请输入数字")
        minimum (:minimum constraints)
        maximum (:maximum constraints)
        step (or (:multiple-of constraints) 1)]
    [:div {:style {:margin-bottom "16px"}}
     [:label {:style {:display "block" :margin-bottom "4px" :font-weight "bold"}}
      (last path)
      (when description
        [:span {:style {:color "#666" :font-size "12px" :margin-left "8px"}} description])
      (when (:default constraints)
        [:span {:style {:color "#999" :font-size "11px" :margin-left "4px"}} 
         (str "(默认: " (:default constraints) ")")])]
     [:input
      {:type "number"
       :value (if (string? value) (js/Number. value) value)
       :placeholder placeholder
       :min minimum
       :max maximum
       :step step
       :on-change #(let [new-value (-> % .-target .-value)]
                     (if (not= new-value "")
                       (swap! form-data assoc-in path (js/Number. new-value))
                       (swap! form-data assoc-in path nil)))
       :style {:width "100%" :padding "8px" :border "1px solid #ddd" :border-radius "4px"}}]
     (when (or minimum maximum)
       [:div {:style {:font-size "11px" :color "#666" :margin-top "2px"}}
        (when minimum (str "最小值: " minimum))
        (when (and minimum maximum) " / ")
        (when maximum (str "最大值: " maximum))])]))

;; 保持向后兼容的数字字段组件
(defn number-field [path schema form-data]
  (enhanced-number-field path schema form-data (get-field-constraints schema) (get-ui-hints schema)))

;; 布尔字段组件
(defn boolean-field [path schema form-data]
  (let [value (get-in @form-data path)
        description (get schema "description")
        default-val (get schema "default")]
    [:div {:style {:margin-bottom "16px"}}
     [:label {:style {:display "flex" :align-items "center" :cursor "pointer"}}
      [:input
       {:type "checkbox"
        :checked (if (nil? value) default-val value)
        :on-change #(swap! form-data assoc-in path (-> % .-target .-checked))
        :style {:margin-right "8px"}}]
      [:span {:style {:font-weight "bold"}} (last path)]
      (when description
        [:span {:style {:color "#666" :font-size "12px" :margin-left "8px"}} description])
      (when default-val
        [:span {:style {:color "#999" :font-size "11px" :margin-left "4px"}} (str "(默认: " default-val ")")])]]))

;; OneOf字段组件 - 处理可以是多种类型之一的字段
(defn one-of-field [path schema form-data]
  (let [value (get-in @form-data path)
        options (get schema "oneOf")
        description (get schema "description")
        selected-type (get-in @form-data (conj path "_type"))]
    [:div {:style {:margin-bottom "16px"}}
     [:label {:style {:display "block" :margin-bottom "4px" :font-weight "bold"}}
      (last path)
      (when description
        [:span {:style {:color "#666" :font-size "12px" :margin-left "8px"}} description])]

     ;; 类型选择器
     [:div {:style {:margin-bottom "8px"}}
      [:label {:style {:display "block" :margin-bottom "4px" :color "#333" :font-size "14px"}} "选择类型："]
      [:select
       {:value (or selected-type "")
        :on-change #(do
                      (let [new-type (-> % .-target .-value)]
                        ;; 清除旧值，设置新类型
                        (swap! form-data assoc-in path nil)
                        (swap! form-data assoc-in (conj path "_type") new-type)))
        :style {:width "100%" :padding "8px" :border "1px solid #ddd" :border-radius "4px"}}
       [:option {:value ""} "请选择类型..."]
       (for [option options]
         (let [type-label (case (get option "type")
                            "string" "字符串"
                            "object" "对象"
                            "integer" "整数"
                            "boolean" "布尔值"
                            (get option "type"))]
           [:option {:key (get option "type") :value (get option "type")} type-label]))]]

     ;; 根据选择的类型显示对应的输入字段
     (when selected-type
       (let [selected-option (first (filter #(= (get % "type") selected-type) options))]
         (case selected-type
           "string" [:div {:style {:margin-top "8px"}}
                     [:input
                      {:type "text"
                       :value (or value "")
                       :placeholder "请输入字符串值"
                       :on-change #(swap! form-data assoc-in path (-> % .-target .-value))
                       :style {:width "100%" :padding "8px" :border "1px solid #ddd" :border-radius "4px"}}]]
           "object" [:div {:style {:margin-top "8px" :padding "8px" :border "1px solid #eee" :border-radius "4px"}}
                     [:textarea
                      {:value (if (string? value) value (js/JSON.stringify (clj->js value) nil 2))
                       :placeholder "请输入JSON对象，如：{\"key\": \"value\"}"
                       :on-change #(swap! form-data assoc-in path (-> % .-target .-value))
                       :style {:width "100%" :height "80px" :padding "8px" :border "1px solid #ddd" :border-radius "4px" :font-family "monospace"}}]]
           [:div {:style {:margin-top "8px" :color "#666" :font-size "12px"}} "暂不支持此类型"])))]))

;; 增强的数组字段组件
(defn enhanced-array-field [path schema form-data constraints ui-hints]
  (let [value (get-in @form-data path [])
        description (get schema "description")
        items-schema (get schema "items")
        unique-items (get schema "uniqueItems" false)
        min-items (get schema "minItems")
        max-items (get schema "maxItems")
        item-type (if items-schema (get-field-type items-schema) :string)]
    
    [:div {:style {:margin-bottom "16px"}}
     [:label {:style {:display "block" :margin-bottom "4px" :font-weight "bold"}}
      (last path)
      (when description
        [:span {:style {:color "#666" :font-size "12px" :margin-left "8px"}} description])]
     
     ;; 根据数组元素类型选择不同的输入方式
     (cond
       ;; 字符串数组 - 使用文本区域
       (= item-type :string)
       [:div
        [:textarea
         {:value (if (vector? value) (str/join "\n" value) "")
          :placeholder "每行输入一个数组元素"
        :on-change #(let [input-value (-> % .-target .-value)]
                      (let [filtered-lines (->> (str/split-lines input-value)
                                               (filter (fn [line] (not= line ""))))]
                        (swap! form-data assoc-in path 
                               (if unique-items (distinct filtered-lines) filtered-lines))))
          :style {:width "100%" :height "100px" :padding "8px" :border "1px solid #ddd" :border-radius "4px"}}]
        (when unique-items
          [:div {:style {:font-size "11px" :color "#666" :margin-top "2px"}}
           "提示：数组元素必须唯一"])
        (when (or min-items max-items)
          [:div {:style {:font-size "11px" :color "#666" :margin-top "2px"}}
           (when min-items (str "最少 " min-items " 项"))
           (when (and min-items max-items) " / ")
           (when max-items (str "最多 " max-items " 项"))])]
       
       ;; 枚举数组 - 使用多选框
       (= item-type :enum)
       [:div {:style {:border "1px solid #ddd" :padding "8px" :border-radius "4px"}}
        (for [option (get items-schema "enum")]
          (let [checked? (some #(= % option) value)]
            [:div {:key option :style {:margin-bottom "4px"}}
             [:label {:style {:display "flex" :align-items "center" :cursor "pointer"}}
              [:input
               {:type "checkbox"
                :checked checked?
          :on-change #(if checked?
                       (swap! form-data assoc-in path 
                              (vec (remove (fn [item] (= item option)) value)))
                       (swap! form-data assoc-in path 
                              (conj value option)))
                :style {:margin-right "6px"}}]
              [:span option]]]))]
       
       ;; 其他类型 - 简单的JSON输入
       :else
       [:div
        [:textarea
         {:value (if (vector? value) 
                   (js/JSON.stringify (clj->js value) nil 2) 
                   "")
          :placeholder "请输入JSON数组格式，如：[\"item1\", \"item2\"]"
          :on-change #(let [input-value (-> % .-target .-value)]
                        (try
                          (let [parsed-value (js/JSON.parse input-value)]
                            (when (array? parsed-value)
                              (swap! form-data assoc-in path (vec parsed-value))))
                          (catch js/Error e
                            ;; JSON解析错误，暂时不更新值
                            )))
          :style {:width "100%" :height "100px" :padding "8px" :border "1px solid #ddd" :border-radius "4px" :font-family "monospace"}}]
        [:div {:style {:font-size "11px" :color "#666" :margin-top "2px"}}
         "提示：请输入有效的JSON数组格式"]])]))

;; 保持向后兼容的数组字段组件
(defn array-field [path schema form-data]
  (enhanced-array-field path schema form-data (get-field-constraints schema) (get-ui-hints schema)))

;; 简单对象字段组件
(defn simple-object-field [path schema form-data]
  (let [properties (get-in schema ["properties"])
        description (get schema "description")]
    [:div {:style {:margin-bottom "20px" :padding "12px" :border "1px solid #eee" :border-radius "6px" :background-color "#f9f9f9"}}
     [:h4 {:style {:margin-top "0" :margin-bottom "12px" :color "#333"}}
      (last path)
      (when description
        [:span {:style {:color "#666" :font-size "12px" :margin-left "8px"}} description])]
     (for [[prop-name prop-schema] properties]
       (let [field-path (conj path prop-name)
             field-type (get-field-type prop-schema)]
         ^{:key prop-name}
         (case field-type
           :string (text-field field-path prop-schema form-data)
           :enum (enum-field field-path prop-schema form-data)
           :integer (number-field field-path prop-schema form-data)
           :boolean (boolean-field field-path prop-schema form-data)
           :object (simple-object-field field-path prop-schema form-data)
           :one-of (one-of-field field-path prop-schema form-data)
           :array (array-field field-path prop-schema form-data)
           [:div "Unsupported field type: " field-type])))]))

;; Auth字段组件
(defn auth-field [path schema form-data]
  (let [description (get schema "description")]
    [:div {:style {:margin-bottom "20px" :padding "12px" :border "1px solid #fff3e0" :border-radius "6px" :background-color "#fff8f0"}}
     [:h4 {:style {:margin-top "0" :margin-bottom "12px" :color "#e65100"}}
      (last path)
      (when description
        [:span {:style {:color "#666" :font-size "12px" :margin-left "8px"}} description])]
     
     ;; Header认证
     [:div {:style {:margin-bottom "16px" :padding "8px" :background-color "white" :border-radius "4px" :border "1px solid #ffcc02"}}
      [:h5 {:style {:margin-top "0" :margin-bottom "8px" :color "#f57c00" :font-size "14px"}} "Header 认证配置"]
      [:div {:style {:margin-bottom "8px"}}
       [:label {:style {:display "block" :margin-bottom "4px" :font-weight "bold" :color "#333"}} "Header 名称"]
       [:input
        {:type "text"
         :value (get-in @form-data (conj path "header" "name") "")
         :placeholder "例如: Authorization"
         :on-change #(swap! form-data assoc-in (conj path "header" "name") (-> % .-target .-value))
         :style {:width "100%" :padding "8px" :border "1px solid #ddd" :border-radius "4px" :margin-bottom "8px"}}]]
      [:div
       [:label {:style {:display "block" :margin-bottom "4px" :font-weight "bold" :color "#333"}} "Header 值"]
       [:input
        {:type "text"
         :value (get-in @form-data (conj path "header" "value") "")
         :placeholder "例如: Bearer token123"
         :on-change #(swap! form-data assoc-in (conj path "header" "value") (-> % .-target .-value))
         :style {:width "100%" :padding "8px" :border "1px solid #ddd" :border-radius "4px"}}]]]
     
     ;; Query认证
     [:div {:style {:margin-bottom "16px" :padding "8px" :background-color "white" :border-radius "4px" :border "1px solid #4fc3f7"}}
      [:h5 {:style {:margin-top "0" :margin-bottom "8px" :color "#0288d1" :font-size "14px"}} "Query 参数认证配置"]
      [:div {:style {:margin-bottom "8px"}}
       [:label {:style {:display "block" :margin-bottom "4px" :font-weight "bold" :color "#333"}} "参数名称"]
       [:input
        {:type "text"
         :value (get-in @form-data (conj path "query" "name") "")
         :placeholder "例如: api_key"
         :on-change #(swap! form-data assoc-in (conj path "query" "name") (-> % .-target .-value))
         :style {:width "100%" :padding "8px" :border "1px solid #ddd" :border-radius "4px" :margin-bottom "8px"}}]]
      [:div
       [:label {:style {:display "block" :margin-bottom "4px" :font-weight "bold" :color "#333"}} "参数值"]
       [:input
        {:type "text"
         :value (get-in @form-data (conj path "query" "value") "")
         :placeholder "例如: your_api_key_value"
         :on-change #(swap! form-data assoc-in (conj path "query" "value") (-> % .-target .-value))
         :style {:width "100%" :padding "8px" :border "1px solid #ddd" :border-radius "4px"}}]]]]))
