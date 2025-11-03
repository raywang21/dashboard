(ns sample-schema)

(def sample-schema
  {"$comment" "this is a mark for our injected plugin schema"
   "properties" {"_meta" {"properties" {"disable" {"type" "boolean"}
                                        "error_response" {"oneOf" [{"type" "string"}
                                                                   {"type" "object"}]}
                                        "filter" {"description" "filter determines whether the plugin needs to be executed at runtime"
                                                  "type" "array"}
                                        "priority" {"description" "priority of plugins by customized order"
                                                    "type" "integer"}}
                          "type" "object"}
                 "auth" {"additionalProperties" false
                         "description" "Authentication configuration for the AI service"
                         "patternProperties" {"header" {"description" "Header-based authentication configuration"
                                                        "patternProperties" {"^[a-zA-Z0-9._-]+$" {"type" "string"}}
                                                        "type" "object"}
                                              "query" {"description" "Query parameter-based authentication configuration"
                                                       "patternProperties" {"^[a-zA-Z0-9._-]+$" {"type" "string"}}
                                                       "type" "object"}}
                         "type" "object"}
                 "keepalive" {"default" true
                              "type" "boolean"}
                 "keepalive_pool" {"default" 30
                                   "minimum" 1
                                   "type" "integer"}
                 "keepalive_timeout" {"default" 60000
                                      "description" "keepalive timeout in milliseconds"
                                      "minimum" 1000
                                      "type" "integer"}
                 "options" {"additionalProperties" true
                            "description" "Key/value settings for the model"
                            "properties" {"model" {"description" "Model to execute."
                                                   "type" "string"}}
                            "type" "object"}
                 "override" {"properties" {"endpoint" {"description" "To be specified to override the endpoint of the AI Instance"
                                                       "type" "string"}}
                             "type" "object"}
                 "provider" {"description" "Type of the AI service instance."
                             "enum" ["openai" "deepseek" "openai-compatible"]
                             "type" "string"}
                 "ssl_verify" {"default" true
                               "type" "boolean"}
                 "timeout" {"default" 30000
                            "description" "timeout in milliseconds"
                            "minimum" 1
                            "type" "integer"}}
   "required" ["provider" "auth"]
   "type" "object"})

(def sample-schema2
  {"$comment" "this is a mark for our injected plugin schema"
   "properties" {"_meta" {"properties" {"disable" {"type" "boolean"}
                                        "error_response" {"oneOf" [{"type" "string"}
                                                                   {"type" "object"}]}
                                        "filter" {"description" "filter determines whether the plugin needs to be executed at runtime"
                                                  "type" "array"}
                                        "priority" {"description" "priority of plugins by customized order"
                                                    "type" "integer"}}
                          "type" "object"}
                 "block_harmful_content" {"default" true
                                          "description" "是否阻止有害内容"
                                          "type" "boolean"}
                 "block_on_check_failure" {"default" false
                                           "description" "检测失败时是否阻止响应"
                                           "type" "boolean"}
                 "content_safety_key" {"description" "内容安全检测API密钥"
                                       "type" "string"}
                 "content_safety_url" {"default" "https://api.deepseek.com/v1/chat/completions"
                                       "description" "内容安全检测API地址"
                                       "type" "string"}
                 "enable_input_check" {"default" true
                                       "description" "是否启用输入内容检测"
                                       "type" "boolean"}
                 "enable_output_check" {"default" true
                                        "description" "是否启用输出内容检测"
                                        "type" "boolean"}
                 "enable_retry" {"default" true
                                 "description" "是否启用检测失败重试"
                                 "type" "boolean"}
                 "mask_sensitive_info" {"default" true
                                        "description" "是否对敏感信息进行脱敏"
                                        "type" "boolean"}
                 "max_retry_count" {"default" 2
                                    "description" "最大重试次数"
                                    "maximum" 5
                                    "minimum" 0
                                    "type" "integer"}
                 "provider" {"default" "deepseek"
                             "description" "AI服务提供商"
                             "type" "string"}
                 "retry_delay_ms" {"default" 1000
                                   "description" "重试延迟时间（毫秒）"
                                   "maximum" 10000
                                   "minimum" 100
                                   "type" "integer"}
                 "sensitive_types" {"default" ["email" "id_card" "phone" "bank_card" "address" "name"]
                                    "description" "需要检测的敏感信息类型"
                                    "items" {"type" "string"}
                                    "type" "array"}
                 "timeout" {"default" 60000
                            "description" "API调用超时时间（毫秒）"
                            "maximum" 300000
                            "minimum" 1000
                            "type" "integer"}}
   "required" ["content_safety_key" "provider"]
   "type" "object"})


(def sample-schema3
  {"$comment" "this is a mark for our injected plugin schema"
   "properties" {"_meta" {"properties" {"disable" {"type" "boolean"}
                                        "error_response" {"oneOf" [{"type" "string"}
                                                                   {"type" "object"}]}
                                        "filter" {"description" "filter determines whether the plugin needs to be executed at runtime"
                                                  "type" "array"}
                                        "priority" {"description" "priority of plugins by customized order"
                                                    "type" "integer"}}
                          "type" "object"}
                 "allow_patterns" {"default" []
                                   "items" {"type" "string"}
                                   "type" "array"}
                 "content_categories" {"default" {"drugs" ["毒品" "dupin" "drugs"]
                                                  "gambling" ["赌博" "dubo" "gambling"]
                                                  "hate" ["仇恨" "歧视" "chouhen" "qishi" "hate" "discrimination"]
                                                  "illegal" ["违法信息" "weifa" "illegal"]
                                                  "political" ["政治敏感" "zhengzhi" "political"]
                                                  "porn" ["色情" "seqing" "porn" "sex"]
                                                  "self_harm" ["自残" "自杀" "zican" "zisha" "suicide" "self harm"]
                                                  "sensitive_info" ["密码" "账号" "银行卡号" "身份证号" "mima" "zhanghao" "yinhangka" "shenfenzheng" "password" "pwd" "passwd" "admin" "root" "system" "bank card" "credit card" "card number" "account number" "card details" "银行卡" "信用卡" "借记卡" "储蓄卡" "支付宝" "微信支付" "paypal" "stripe" "银行账号" "银行密码" "支付密码" "交易密码" "取款密码" "身份证" "护照" "驾照" "军官证" "学生证" "工作证" "社保卡" "医保卡" "id card" "passport" "driver license" "military id" "student id" "work id" "身份证号" "护照号" "驾照号" "军官证号" "学生证号" "工作证号" "手机号" "电话号码" "座机号" "传真号" "邮箱" "邮箱地址" "email" "phone" "tel" "fax" "手机密码" "sim卡密码" "pin码" "puk码" "手机解锁" "手机root" "phone password" "sim password" "pin code" "puk code" "家庭地址" "工作地址" "学校地址" "详细地址" "门牌号" "楼层" "房间号" "home address" "work address" "school address" "detailed address" "指纹" "虹膜" "面部识别" "声纹" "dna" "基因" "生物特征" "fingerprint" "iris" "face recognition" "voice print" "dna" "gene" "biometric" "病历" "诊断" "处方" "检查报告" "化验单" "体检报告" "健康档案" "medical record" "diagnosis" "prescription" "test report" "health record" "疾病" "症状" "用药" "治疗" "手术" "住院" "门诊" "disease" "symptom" "medication" "treatment" "surgery" "hospitalization" "学籍" "成绩" "考试" "录取" "毕业" "学位" "证书" "文凭" "academic record" "grade" "exam" "admission" "graduation" "degree" "certificate" "diploma" "工资" "薪资" "奖金" "绩效" "考核" "升职" "离职" "裁员" "salary" "wage" "bonus" "performance" "promotion" "resignation" "layoff" "劳动合同" "保密协议" "竞业限制" "知识产权" "专利" "商标" "版权" "employment contract" "nda" "non compete" "intellectual property" "patent" "trademark" "copyright" "犯罪" "违法" "违规" "处罚" "罚款" "拘留" "逮捕" "判刑" "监狱" "crime" "illegal" "violation" "penalty" "fine" "detention" "arrest" "sentence" "prison" "诉讼" "起诉" "被告" "原告" "律师" "法官" "法院" "检察院" "lawsuit" "prosecution" "defendant" "plaintiff" "lawyer" "judge" "court" "prosecutor"]
                                                  "terrorism" ["恐怖主义" "kongbu" "terrorism"]
                                                  "violence" ["暴力" "baoli" "violence" "bomb" "explosive" "gun" "ammo" "pistol" "rifle" "machine gun" "sniper" "grenade" "mine" "missile" "rocket" "tank" "fighter" "warship"]}
                                       "type" "object"}
                 "deny_patterns" {"default" []
                                  "items" {"type" "string"}
                                  "type" "array"}
                 "enable_content_category" {"default" true
                                            "type" "boolean"}
                 "match_all_conversation_history" {"default" false
                                                   "type" "boolean"}
                 "match_all_roles" {"default" false
                                    "type" "boolean"}}
   "type" "object"})

