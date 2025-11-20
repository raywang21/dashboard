(ns main
  (:require [reagent.core :as r]
            [reagent.dom :as dom]
            [clojure.string :as str]
            [clojure.walk :as walk]))

;; 全局数据存储 - 使用Reagent atom管理所有模块数据
(defonce module-data
  (r/atom {:dashboard {:stats []
                       :activities []
                       :projects []}
              :reports {:report-list []
                        :categories []}
              :users {:user-list []
                     :stats {}}
              :settings {:site-name "企业仪表板"
                       :site-description "企业级数据分析和可视化平台"
                       :language "zh-CN"
                       :timezone "Asia/Shanghai"
                       :email-notifications true
                       :push-notifications false
                       :sms-notifications false
                       :weekly-reports true
                       :two-factor-auth false
                       :session-timeout 30
                       :password-expiry 90
                       :theme "light"
                       :primary-color "#1976d2"
                       :font-size "medium"
                       :auto-backup true
                       :log-level "info"
                       :max-file-size 10
                       :cache-timeout 60}
              :analysis {
                       :logs []
                       :isRunning false
                       :currentTask "无"
                       :startTime nil
                       :runningTime "00:00:00"
                       :stockCode ""
                       :queryResult nil
                       :showResult false
                       :loading {:start false
                               :stop false
                               :query false}}
              :workflow {:workflows []
                        :current-workflow nil
                        :execution-history []
                        :node-templates {}
                        :workflow-stats {}}}))

;; 组件加载状态跟踪
(defonce loaded-components
  (r/atom #{}))

;; 数据订阅者列表
(defonce data-subscribers
  (r/atom []))

;; JavaScript对象转换函数 - 保持camelCase命名
(defn js->clj-camelcase [js-obj]
  "将JavaScript对象转换为ClojureScript map，保持camelCase关键字"
  (when js-obj
    (->> (js->clj js-obj :keywordize-keys true) 
         )))

(defn clj->js-camelcase [clj-data]
  "递归将ClojureScript数据转换为JavaScript对象"
  (when clj-data
    (clj->js clj-data :keyword-fn #(name %))))


;; 获取模块数据
(defn get-module-data [module-key]
  ;; 确保module-key是关键字，与update-module-data!保持一致
  (let [keyword-key (if (keyword? module-key)
                      module-key
                      (keyword module-key))
        clj-data (get @module-data keyword-key)]
    (when clj-data
      (clj->js-camelcase clj-data))))



;; 更新模块数据
(defn update-module-data! [module-key data]
  (println "update-module-data! called with:" module-key data)
  (println "Data type:" (type data))

  (let [keyword-key (if (keyword? module-key)
                      module-key
                      (keyword module-key))
        ;; 统一转换，确保所有 JavaScript 对象都被处理
        processed-data (js->clj-camelcase data)]

    (println "Processed data:" processed-data)

    (if (map? processed-data)
      (swap! module-data update-in [keyword-key] merge processed-data)
      (swap! module-data assoc keyword-key processed-data))

    ;; 通知订阅者
    (doseq [callback @data-subscribers]
      (when callback
        (callback keyword-key processed-data)))))


;; 订阅数据变化
(defn subscribe-to-data! [callback]
  (swap! data-subscribers conj callback))

;; 取消订阅
(defn unsubscribe-from-data! [callback]
  (swap! data-subscribers disj callback))

;; 检查组件是否已加载
(defn component-loaded? [component-name]
  (contains? @loaded-components component-name))

;; 标记组件为已加载
(defn mark-component-loaded! [component-name]
  (swap! loaded-components conj component-name))

;; 获取仪表板数据
(defn get-dashboard-data []
  {:stats (get-in @module-data [:dashboard :stats])
   :activities (get-in @module-data [:dashboard :activities])
   :projects (get-in @module-data [:dashboard :projects])})

;; 更新仪表板数据
(defn update-dashboard-data! [key value]
  (let [current-data (get-in @module-data [:dashboard])]
    (update-module-data! :dashboard (assoc current-data key value))))

;; 获取报告数据
(defn get-reports-data []
  {:report-list (get-in @module-data [:reports :report-list])
   :categories (get-in @module-data [:reports :categories])})

;; 更新报告数据
(defn update-reports-data! [key value]
  (let [current-data (get-in @module-data [:reports])]
    (update-module-data! :reports (assoc current-data key value))))

;; 获取用户数据
(defn get-users-data []
  {:user-list (get-in @module-data [:users :user-list])
   :stats (get-in @module-data [:users :stats])})

;; 更新用户数据
(defn update-users-data! [key value]
  (let [current-data (get-in @module-data [:users])]
    (update-module-data! :users (assoc current-data key value))))

;; 获取设置数据
(defn get-settings-data []
  (:settings @module-data))

;; 更新设置数据
(defn update-settings-data! [key value]
  (let [current-settings (get-settings-data)]
    (update-module-data! :settings (assoc current-settings key value))))

;; 获取分析数据
(defn get-analysis-data []
  {:stockData (get-in @module-data [:analysis :stockData])
   :logs (get-in @module-data [:analysis :logs])
   :isRunning (get-in @module-data [:analysis :isRunning])
   :currentTask (get-in @module-data [:analysis :currentTask])
   :startTime (get-in @module-data [:analysis :startTime])
   :runningTime (get-in @module-data [:analysis :runningTime])
   :stockCode (get-in @module-data [:analysis :stockCode])
   :queryResult (get-in @module-data [:analysis :queryResult])
   :showResult (get-in @module-data [:analysis :showResult])
   :loading (get-in @module-data [:analysis :loading])})

;; 更新分析数据
(defn update-analysis-data! [key value]
  (println "update-analysis-data! called with:" key value)
  (let [current-data (get-in @module-data [:analysis])
        ;; 确保key是关键字
        keyword-key (if (keyword? key) key (keyword key))]
    (println "Current analysis data:" current-data)
    (println "Updating key:" keyword-key "with value:" value)
    (update-module-data! :analysis (assoc current-data keyword-key value))
    (println "Updated analysis data:" (get-in @module-data [:analysis]))))

;; 工作流相关函数
;; 获取工作流数据
(defn get-workflow-data []
  {:workflows (get-in @module-data [:workflow :workflows])
   :current-workflow (get-in @module-data [:workflow :current-workflow])
   :execution-history (get-in @module-data [:workflow :execution-history])
   :node-templates (get-in @module-data [:workflow :node-templates])
   :workflow-stats (get-in @module-data [:workflow :workflow-stats])})

;; 更新工作流数据
(defn update-workflow-data! [key value]
  (let [current-data (get-in @module-data [:workflow])]
    (update-module-data! :workflow (assoc current-data key value))))

;; 保存工作流
(defn save-workflow! [workflow-data]
  (let [current-workflows (get-in @module-data [:workflow :workflows])
        updated-workflows (conj current-workflows workflow-data)]
    (update-workflow-data! :workflows updated-workflows)))

;; 获取当前工作流
(defn get-current-workflow []
  (get-in @module-data [:workflow :current-workflow]))

;; 设置当前工作流
(defn set-current-workflow! [workflow]
  (update-workflow-data! :current-workflow workflow))

;; 添加工作流执行历史
(defn add-workflow-execution! [execution-record]
  (let [current-history (get-in @module-data [:workflow :execution-history])
        updated-history (conj current-history execution-record)]
    (update-workflow-data! :execution-history updated-history)))


;; 初始化桥接接口 - 暴露给JavaScript使用
(defn ^:export init-bridge! []
  (set! (.-clojureBridge js/window)
    #js {:getModuleData get-module-data
          :updateModuleData update-module-data!
          :subscribeToData subscribe-to-data!
          }))

;; 初始化默认数据
(defn ^:export init-default-data! []
  ;; 初始化仪表板数据
  (update-dashboard-data! :stats [{:title "总用户数" :value "12,543" :change "+12%" :trend "up"}
                                  {:title "活跃会话" :value "3,421" :change "+5%" :trend "up"}
                                  {:title "转化率" :value "68.2%" :change "-2%" :trend "down"}
                                  {:title "收入" :value "¥89,432" :change "+18%" :trend "up"}])

  (update-dashboard-data! :activities [{:id 1 :user "张三" :action "登录系统" :time "2分钟前" :status "success"}
                                       {:id 2 :user "李四" :action "更新配置" :time "5分钟前" :status "info"}
                                       {:id 3 :user "王五" :action "删除数据" :time "10分钟前" :status "warning"}
                                       {:id 4 :user "赵六" :action "导出报告" :time "15分钟前" :status "success"}])

  (update-dashboard-data! :projects [{:id 1 :name "项目 Alpha" :status "进行中" :progress 75 :owner "张三" :deadline "2024-01-15"}
                                     {:id 2 :name "项目 Beta" :status "已完成" :progress 100 :owner "李四" :deadline "2024-01-10"}
                                     {:id 3 :name "项目 Gamma" :status "待开始" :progress 0 :owner "王五" :deadline "2024-01-20"}
                                     {:id 4 :name "项目 Delta" :status "进行中" :progress 45 :owner "赵六" :deadline "2024-01-25"}])

  ;; 初始化报告数据
  (update-reports-data! :report-list [{:id 1 :name "月度销售报告" :type "销售" :date "2024-01-15" :status "已完成" :author "张三"}
                                      {:id 2 :name "用户活跃度分析" :type "分析" :date "2024-01-14" :status "生成中" :author "李四"}
                                      {:id 3 :name "财务季度报表" :type "财务" :date "2024-01-10" :status "已完成" :author "王五"}
                                      {:id 4 :name "产品性能报告" :type "技术" :date "2024-01-08" :status "待审核" :author "赵六"}])

  (update-reports-data! :categories [{:name "销售报告" :count 15 :icon "trending_up"}
                                     {:name "用户分析" :count 8 :icon "people"}
                                     {:name "财务报表" :count 12 :icon "account_balance"}
                                     {:name "技术报告" :count 6 :icon "code"}])

  ;; 初始化用户数据
  (update-users-data! :user-list [{:id 1 :name "张三" :email "zhangsan@example.com" :role "管理员" :status "活跃" :lastLogin "2024-01-15 14:30" :avatar "Z"}
                                  {:id 2 :name "李四" :email "lisi@example.com" :role "编辑" :status "活跃" :lastLogin "2024-01-15 10:15" :avatar "L"}
                                  {:id 3 :name "王五" :email "wangwu@example.com" :role "用户" :status "离线" :lastLogin "2024-01-14 16:45" :avatar "W"}
                                  {:id 4 :name "赵六" :email "zhaoliu@example.com" :role "编辑" :status "活跃" :lastLogin "2024-01-15 09:20" :avatar "Z"}
                                  {:id 5 :name "钱七" :email "qianqi@example.com" :role "用户" :status "暂停" :lastLogin "2024-01-12 11:30" :avatar "Q"}])

  (update-users-data! :stats [{:label "总用户数" :value "156" :change "+12%" :icon "people"}
                              {:label "活跃用户" :value "89" :change "+5%" :icon "person"}
                              {:label "新用户" :value "23" :change "+18%" :icon "person_add"}
                              {:label "在线用户" :value "34" :change "+8%" :icon "online_prediction"}])

  ;; 初始化分析数据
  ; (add-analysis-log! "系统已就绪，等待操作..." "info")
  )

;; 主应用组件
(defn dashboard-app []
  (let [current-page (r/atom :dashboard)]
    (fn []
      [:div {:style {:min-height "100vh"}}
       ;; 这里可以添加全局UI元素
       ])))


;; 开发环境下的热重载
(when (exists? js/window.location)
  (when (.includes (.-href js/window.location) "localhost")
    (set! (.-onbeforeunload js/window) 
      (fn [event]
        (when (.-returnValue event)
          (set! (.-returnValue event) true))))))

;; 全局导出函数 - 确保JavaScript可以访问
(set! (.-initBridge js/window) init-bridge!)
(set! (.-initDefaultData js/window) init-default-data!)

(println "main.cljs loaded.")

(comment
  @main/module-data
  (:analysis @main/module-data)

  (get-module-data "analysis")

  (update-dashboard-data! :stats [{:title "总用户数" :value "12,543" :change "+12%" :trend "up"}
                                  {:title "活跃会话" :value "3,421" :change "+5%" :trend "up"}
                                  {:title "转化率" :value "68.2%" :change "-2%" :trend "down"}
                                  {:title "收入" :value "¥89,432" :change "+18%" :trend "up"}])
  (keyword "queryResult")

  )
