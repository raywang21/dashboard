(ns plugininfo
  "插件信息处理和表单生成器"
  (:require
   [reagent.core :as r]
   [reagent.dom :as rdom]
   [form-fields :as ff]
   [enhanced-form-fields :as eff]
   [clojure.string :as str]
   [demo :as demo]))

;; ===========================================
;; 通用表单生成器
;; ===========================================

;; 表单数据状态
(defonce form-data (r/atom {}))

;; 获取字段类型（直接使用form-fields中的实现）
;; 注意：这个函数现在直接通过 ff/get-field-type 调用

;; 格式化Auth数据
(defn format-auth-data [auth-data]
  (js/console.log "Debug - auth-data:" auth-data)
  (js/console.log "Debug - auth-data keys:" (keys auth-data))
  (js/console.log "Debug - get header:" (get auth-data "header"))
  (js/console.log "Debug - get query:" (get auth-data "query"))

  (let [header (get auth-data "header")
        query (get auth-data "query")
        result (atom {})]

    (when (and header
               (string? (get header "name"))
               (string? (get header "value"))
               (not= (get header "name") "")
               (not= (get header "value") ""))
      (let [header-name (get header "name")
            header-value (get header "value")]
        (js/console.log "Adding header:" header-name "=" header-value)
        (swap! result assoc "header" {header-name header-value})))

    (when (and query
               (string? (get query "name"))
               (string? (get query "value"))
               (not= (get query "name") "")
               (not= (get query "value") ""))
      (let [query-name (get query "name")
            query-value (get query "value")]
        (js/console.log "Adding query:" query-name "=" query-value)
        (swap! result assoc "query" {query-name query-value})))

    (js/console.log "Debug - final auth result:" @result)
    @result))

;; 通用字段值格式化器
(defn format-field-value [field-path field-schema raw-value]
  "增强的字段值格式化器，使用增强版本的格式化逻辑"
  (eff/format-enhanced-field-value field-path field-schema raw-value))

;; 通用数据格式化器
(defn format-output-data [form-data schema]
  (js/console.log "Debug - format-output-data input:" form-data)
  (let [properties (get schema "properties")
        formatted-data (atom {})]

    ;; 遍历所有字段进行格式化
    (doseq [[field-name field-schema] properties]
      (let [field-path [field-name]
            raw-value (get-in @form-data field-path)]

        ;; 特殊字段处理
        (cond
          ;; Auth字段特殊处理
          (and (= field-name "auth")
               (contains? (get field-schema "properties") "header")
               (contains? (get field-schema "properties") "query"))
          (let [formatted-auth (format-auth-data raw-value)]
            (when (and formatted-auth (seq formatted-auth))
              (swap! formatted-data assoc field-name formatted-auth)))

          ;; 通用字段格式化
          :else (let [formatted-value (format-field-value field-path field-schema raw-value)]
                  (when formatted-value
                    (swap! formatted-data assoc field-name formatted-value))))))

    (js/console.log "Debug - format-output-data result:" @formatted-data)
    @formatted-data))

;; 字段驱动的渲染引擎
(defn render-field [field-path field-schema]
  "增强的字段渲染函数，优先使用增强版本的字段组件"
  (let [field-name (last field-path)]

    ;; 特殊字段检测和处理
    (cond
      ;; Auth字段特殊处理（保持原有逻辑）
      (and (= field-name "auth")
           (contains? (get field-schema "properties") "header")
           (contains? (get field-schema "properties") "query"))
      (ff/auth-field field-path field-schema form-data)

      ;; 使用增强版本的字段渲染器
      :else (eff/render-enhanced-field field-path field-schema form-data))))

;; 初始化表单默认值
(defn initialize-form-defaults [schema]
  (let [properties (get schema "properties")]
    (doseq [[field-name field-schema] properties]
      (let [field-path [field-name]
            current-value (get-in @form-data field-path)
            default-value (get field-schema "default")]
        ;; 只有当字段值为空且有默认值时才设置
        (when (and (nil? current-value) default-value)
          (js/console.log "设置默认值:" field-name "=" default-value)
          (swap! form-data assoc-in field-path default-value))))))

;; 表单生成器主组件
(defn form-generator [schema]
  (let [properties (get schema "properties")
        required (get schema "required" [])]
    ;; 初始化默认值
    (initialize-form-defaults schema)
    
    [:div {:style {:max-width "800px" :margin "0 auto" :padding "20px" :background-color "white" :border-radius "8px" :box-shadow "0 2px 8px rgba(0,0,0,0.1)"}}
     [:h2 {:style {:margin-bottom "20px" :color "#333" :text-align "center"}} "插件配置表单"]
     (for [[prop-name prop-schema] properties]
       (let [field-path [prop-name]
             is-required (some #{prop-name} required)]
         ^{:key prop-name}
         [:div {:style {:margin-bottom "8px"}}
          (render-field field-path prop-schema)
          (when is-required
            [:span {:style {:color "red" :font-size "12px" :margin-left "4px"}} "*"])]))
     [:div {:style {:margin-top "24px" :text-align "center"}}
      [:button
       {:on-click #(do
                     (js/console.log "Debug - raw form-data:" @form-data)
                     (let [formatted-data (format-output-data @form-data schema)]
                       (js/console.log "Debug - formatted-data:" formatted-data)
                       (js/console.log "表单数据:" (js/JSON.stringify (clj->js formatted-data) nil 2))
                       (js/alert "表单数据已输出到控制台！")))
        :style {:background-color "#4CAF50" :color "white" :padding "12px 24px" :border "none" :border-radius "4px" :cursor "pointer" :font-size "16px"}}
       "提交表单"]]]))

;; 调用 demo.cljs 中的 get-plugin-by-name 函数
(defn get-plugin-info-by-name [plugin-name]
  (js/console.log "plugininfo.cljs: 开始获取插件信息:" plugin-name)
  (-> (demo/get-plugin-by-name plugin-name)
      (.then (fn [plugin-data]
               (js/console.log "plugininfo.cljs: 插件信息获取成功，转换为ClojureScript格式")
               (js/console.log "plugininfo.cljs: plugin-data" plugin-data)
               ;; 转换为ClojureScript数据结构，保持字符串键
               (js->clj plugin-data)))
      (.catch (fn [error]
                (js/console.error "plugininfo.cljs: 获取插件信息失败:" error)
                nil))))

;; 从插件信息中提取 schema 部分
(defn get-plugin-schema-by-name [plugin-name]
  (js/console.log "plugininfo.cljs: 开始获取插件schema:" plugin-name)
  (-> (get-plugin-info-by-name plugin-name)
      (.then (fn [plugin-data]
               (js/console.log "plugininfo.cljs: 插件信息获取成功，开始提取schema")
               (let [schema (get plugin-data "schema")]
                 (if schema
                   (do
                     (js/console.log "plugininfo.cljs: schema提取成功")
                     schema)
                   (do
                     (js/console.warn "plugininfo.cljs: 插件数据中未找到schema字段")
                     nil)))))
      (.catch (fn [error]
                (js/console.error "plugininfo.cljs: 获取插件schema失败:" error)
                nil))))

;; 初始化表单生成器
(defn init-form-generator [plugin-id]
  (js/console.log "初始化表单生成器:" plugin-id)
  (reset! form-data {})
  (when-let [app-element (.getElementById js/document "app")]
    ;; 先渲染加载状态
    (rdom/render [:div "正在加载插件配置..."] app-element)

    ;; 异步获取schema
    (-> (get-plugin-schema-by-name plugin-id)
        (.then (fn [schema]
                 (js/console.log "Schema加载成功:" schema)
                 (if schema
                   ;; 重新渲染表单
                   (rdom/render [form-generator schema] app-element)
                   ;; 显示错误信息
                   (rdom/render [:div {:style {:color "red"}}
                                 "未找到插件配置或加载失败"] app-element))))
        (.catch (fn [error]
                  (js/console.error "Schema加载失败:" error)
                  (rdom/render [:div {:style {:color "red"}}
                                "插件配置加载失败"] app-element))))))

;; ===========================================
;; 导出函数到全局
;; ===========================================
(set! (.-init_form_generator js/window) init-form-generator)
(set! (.-get_plugin_info_by_name js/window) get-plugin-info-by-name)
(set! (.-get_plugin_schema_by_name js/window) get-plugin-schema-by-name)
