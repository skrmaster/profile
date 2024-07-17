### 快速开始
``` 
# 克隆项目到本地
git clone https://github.com/skrMaster/profile.git

# 安装依赖包
npm i

# 运行（占用3000端口）
npm run dev
```

### 介绍

- ###### **项目介绍**
    ***技术栈***
    - nuxtjs3
    - Vue3
    - typescript
    - sass
    - threejs
    - wangeditor
- ###### **目录结构**
```text
  |--.vscode                                      #vscode编辑器的一些配置
  |--api                                          #存放与后端数据交互的接口
    |--address                                     #地址导航接口
    |--...                                         #同上
    |--index.ts                                    #fetch方法封装
    ┖--responseCode.ts                             #http响应状态码
  |--assets                                       #需要在项目中引用的文件
    |--css                                         #样式包括未编译的.sass文件
    |--images                                      #图片
    |--json                                        #绘制canvas中图像的path数据
    |--svg                                         #绘制canvas中的图像
    |--verify                                      #验证码前置验证的图片
  |--components                                   #组件
    |--com-**.vue                                  #公共组件
    |--detail-title.vue                            #详情页面的标题头部组件
    |--index-project.client.vue                    #首页项目路牌
    |--index.skills-small.vue                      #首页技能小型设备展示的组件
    |--index.skills.vue                            #首页技能大型设备展示的组件
    ┖--wang-editor.client.vue                      #富文本编辑器组件
  |--composables                                  #组合式函数
    |--state.ts                                    #主题存储
    |--use-unique-id.ts                            #获取唯一id
    ┖--use-userInfo.ts                             #获取用户信息
  |--layouts                                      #页面布局
    |--default.vue                                 #默认布局
    ┖--header-section-footer.vue                   #头-内容-页脚布局
  |--middleware                                   #中间处理
    ┖--auth.global.ts                              #权限
  |--mocks                                        #模拟数据(未使用)
    ┖--data.json
  |--pages                                        #页面组件
  |--plugins                                      #在项目中使用三方插件的配置
    |--confirm.client.ts                           #自定义确认弹框配置
    |--directive-drag.client.ts                    #拖拽指令
    |--dompurify.ts                                #限制富文本标签的配置
    |--loadding-directive.ts                       #加载动画指令
    |--message.client.ts                           #自定义消息提示配置
    |--uniqueId.ts                                 #全局id生成
    |--worker.ts                                   #worker配置
    ┖--zIndex.ts                                   #全局z-index生成
  |--public                                       #存放一些公共资源
  |--server                                       #集成后端配置
  |--types                                        #类型标注
  |--utils                                        #工具函数
    |--canvas.ts                                   #获取canvas的一些快捷操作
    |--day.ts                                      #计算星座
    |--encrypt.ts                                  #解密内容
    |--eventBus.ts                                 #bus事件总线
    |--html.ts                                     #html一些快捷操作
    |--is.ts                                       #判断是否为什么的工具函数
    |--options.ts                                  #枚举对象
    |--pathMap.ts                                  #页面路径和接口地址配置
    |--regexp.ts                                   #表单的动态验证
    |--setThems.ts                                 #设置页面主题
    |--storage.ts                                  #持久化存储
    |--tool.ts                                     #一些常用函数
    |--type-guard.ts                               #类型守卫
    |--worker.js                                   #编译产物
    ┖--worker.ts                                   #首页动画worker
  |--.babelrc                                     |
  |--.eslintrc.json                               |
  |--.gitignore                                   |--一些配置
  |--.hintrc                                      |
  |--app.vue                                      |
  |--error.vue                                    #错误页面
  |--nuxt.config.ts                               |
  |--package-lock.json                            |
  |--package.json                                 |--一些配置
  |--profile.code-workspace                       |
  |--README.md                                    |
  ┖--tsconfig.json                                |
```
