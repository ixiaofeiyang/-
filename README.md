# 乐乐购小程序

* 正常页面

```bash
export default class pageName extends wepy.page{}
```

* 必须录入手机号的页面结构

```bash
import auth from '../base/auth'

export default class pageName extends auth{}
```



todo:

1. 组件的引用，wux   weui 
2. navigatestyle = custom, http://www.wetouch.net/touchwx_doc/quickstart/extend/api
3. fontawesome(optional)
4. 授权 (组件)（panel)
5. 授权拒绝的处理
6. error处理
7. 来源的统一处理
8. 文件组织，结构
======
1. 扫描清除缓存
2. 扫描打开调试模式
3. 错误统一收集
4. refresh token处理
5. 加入购物车逻辑统一用event实现

=====
onlaunch里面实现周期性内容
app里面实现onerror的问题
打开调试模式，用长按解决