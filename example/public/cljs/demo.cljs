(ns demo
  "Demo ClojureScript file for Scittle integration"
  (:require ["APIModule" :as api]))

;; 插件信息记录
(defrecord PluginInfo [id name category version priority description type scope enabled created_at updated_at])

;; 插件列表响应
(defrecord PluginListResponse [plugins total])

;; 数据转换函数
(defn transform-plugin-data [plugin-data]
  (map->PluginInfo
    {:id (or (:id plugin-data) (:name plugin-data) "")
     :name (or (:name plugin-data) "")
     :category (or (:category plugin-data) "general")
     :version (or (:version plugin-data) "1.0.0")
     :priority (or (:priority plugin-data) 1000)
     :description (or (:description plugin-data) "")
     :type (or (:type plugin-data) "normal")
     :scope (or (:scope plugin-data) "route")
     :enabled (not= (:enabled plugin-data) false)
     :created_at (or (:created_at plugin-data) (:create_time plugin-data) (js/Date.))
     :updated_at (or (:updated_at plugin-data) (:update_time plugin-data) (js/Date.))}))

;; 错误处理函数
(defn handle-plugin-error [error]
  (js/console.error "Plugin API Error:" error)
  (js/Promise.reject error))

;; 获取插件列表 - 返回 Promise
(defn get-plugin-list []
  (js/console.log "开始获取插件列表...")
  (-> (api/request "/api/plugins/simple" #js {:method "GET"})
      (.then (fn [response]
               (js/console.log "插件列表获取成功:" response)
               ;; 直接返回原始数据，不进行转换，确保数据完整性
               #js {:plugins response :total (count response)} 
               ))
      (.catch handle-plugin-error)))

;; 根据插件名称获取插件详情 - 返回 Promise
(defn get-plugin-by-name [plugin-name]
  (js/console.log "开始获取插件详情:" plugin-name)
  (-> (api/request (str "/api/plugins/" plugin-name) #js {:method "GET"})
      (.then (fn [response]
               (js/console.log "插件详情获取成功:" response)
               ;; 直接返回原始数据，不进行转换，确保数据完整性
               response))
      (.catch handle-plugin-error)))


;; 原有的函数保持不变
(defn greet [name]
  (str "Hello111, " name "! Welcome to ClojureScript!"))

(defn calculate-sum [a b]
  (+ a b))

(defn show-info []
  (js/alert "This is loaded from an external .cljs file!"))

;; 新增：直接调用 TypeScript API 的函数
(defn get-user-info []
  (js/console.log "开始获取用户信息...")
  (-> (api/getUserInfo)
      (.then (fn [result]
               (js/console.log "用户信息获取成功:" result)
               result))
      (.catch (fn [error]
                (js/console.error "用户信息获取失败:" error)
                (throw error)))))

;; 带回调的友好版本
(defn get-user-info-callback [success-callback error-callback]
  (-> (api/getUserInfo)
      (.then success-callback)
      (.catch error-callback)))

;; 简化版本：直接显示结果
(defn show-user-info []
  (js/console.log "show-user-info 被调用")
  (get-user-info-callback
    (fn [result]
      (js/alert (str "用户信息: \n用户名: " (.-username (.-data result))
                    "\n邮箱: " (.-email (.-data result))
                    "\n角色: " (.-role (.-data result)))))
    (fn [error]
      (js/alert (str "获取失败: " (.-message error))))))

;; 导出所有函数到 JavaScript
(set! (.-greet js/window) greet)
(set! (.-calculate_sum js/window) calculate-sum)
(set! (.-show_info js/window) show-info)
(set! (.-get_user_info js/window) get-user-info)
(set! (.-get_user_info_callback js/window) get-user-info-callback)
(set! (.-show_user_info js/window) show-user-info)
;; 也导出单独的函数供直接调用
(set! (.-get-plugin-list js/window) get-plugin-list)
(set! (.-get-plugin-by-name js/window) get-plugin-by-name)


;; 日志
(js/console.log "demo.cljs loaded successfully! Plugin API integration enabled.")



