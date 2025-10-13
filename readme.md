# 						(captcha-web-sdk) 

# ([TIANAI-CAPTCHA)](https://gitee.com/tianai/tianai-captcha)验证码前端SDK



| 条目     |                                                              |
| -------- | ------------------------------------------------------------ |
| 兼容性   | Chrome、Firefox、Safari、Opera、主流手机浏览器、iOS 及 Android上的内嵌Webview |
| 框架支持 | H5、Angular、React、Vue2、Vue3                               |



## 安装与使用（支持 NPM 与 CDN）

### 方式一：NPM 包（推荐）

1) 安装

```bash
npm install captcha-web-sdk
```

2) 在项目中使用（以 React/Vue 为例）

```js
import { TianAiCaptcha, CaptchaConfig } from 'captcha-web-sdk';
import 'captcha-web-sdk/dist/tac/css/tac.css';

const config = new CaptchaConfig({
  bindEl: '#captcha-box',
  requestCaptchaDataUrl: '/gen?type=',
  validCaptchaUrl: '/check',
  validSuccess: (res, c, tac) => {
    tac.destroyWindow();
    console.log('验证成功', res);
  },
  validFail: (res, c, tac) => {
    console.log('验证失败', res);
    tac.reloadCaptcha();
  },
});

const style = { logoUrl: null };

const tac = new TianAiCaptcha(config, style);
tac.init();
```

### 方式二：CDN/浏览器直接引入

两种使用方式：

- A. 使用本项目提供的 UMD 构建（无需 load.js）：

```html
<link rel="stylesheet" href="/tac/css/tac.css">
<script src="/tac.min.js"></script>
<script>
  const config = new window.CaptchaConfig({
    bindEl: '#captcha-box',
    requestCaptchaDataUrl: '/gen?type=',
    validCaptchaUrl: '/check',
    validSuccess: (res, c, tac) => { tac.destroyWindow(); },
    validFail: (res, c, tac) => { tac.reloadCaptcha(); },
  });
  const style = { logoUrl: null };
  const tac = new window.TAC(config, style);
  tac.init();
</script>
```

- B. 沿用原作者的 load.js（保持旧版用法）：

```html
<script src="load.min.js"></script>
<script>
  window.initTAC('./tac', config, style).then(tac => tac.init());
</script>
```

注：如果通过公共 CDN（如 unpkg/jsDelivr），可参考：

```html
<link rel="stylesheet" href="https://unpkg.com/captcha-web-sdk/dist/tac/css/tac.css">
<script src="https://unpkg.com/captcha-web-sdk/dist/tac.min.js"></script>
```

发布后也可使用 jsDelivr：

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/captcha-web-sdk/dist/tac/css/tac.css">
<script src="https://cdn.jsdelivr.net/npm/captcha-web-sdk/dist/tac.min.js"></script>
```

## 使用方法（示例）

2. 创建一个div块用于渲染验证码， 该div用于装载验证码

   ```html
    <div id="captcha-box"></div>
   ```

3. 在需要调用验证码的时候执行加载验证码方法

   ```js
   function login() {
       // config 对象为TAC验证码的一些配置和验证的回调
       const config = {
           // 生成接口 (必选项,必须配置, 要符合tianai-captcha默认验证码生成接口规范)
           requestCaptchaDataUrl: "/gen",
           // 验证接口 (必选项,必须配置, 要符合tianai-captcha默认验证码校验接口规范)
           validCaptchaUrl: "/check",
           // 验证码绑定的div块 (必选项,必须配置)
           bindEl: "#captcha-box",
           // 验证成功回调函数(必选项,必须配置)
           validSuccess: (res, c, tac) => {
                // 销毁验证码服务
               tac.destroyWindow();
               console.log("验证成功，后端返回的数据为", res);
   			// 调用具体的login方法
               login(res.data.token)
           },
           // 验证失败的回调函数(可忽略，如果不自定义 validFail 方法时，会使用默认的)
           validFail: (res, c, tac) => {
               console.log("验证码验证失败回调...")
               // 验证失败后重新拉取验证码
               tac.reloadCaptcha();
           },
           // 刷新按钮回调事件
           btnRefreshFun: (el, tac) => {
               console.log("刷新按钮触发事件...")
               tac.reloadCaptcha();
           },
           // 关闭按钮回调事件
           btnCloseFun: (el, tac) => {
               console.log("关闭按钮触发事件...")
               tac.destroyWindow();
           }
       }
       // 一些样式配置， 可不传
       let style = {
           logoUrl: null;// 去除logo    
           // logoUrl: "/xx/xx/xxx.png" // 替换成自定义的logo   
       }
       // 参数1 为 tac文件是目录地址， 目录里包含 tac的js和css等文件
       // 参数2 为 tac验证码相关配置
       // 参数3 为 tac窗口一些样式配置
       // 方式一：CDN UMD 构建（不使用 load.js）
       const cfg = new window.CaptchaConfig(config);
       const tac = new window.TAC(cfg, style);
       tac.init();

       // 方式二：沿用原 load.js
       // window.initTAC("./tac", config, style).then(tac => {
       //     tac.init();
       // }).catch(e => console.log("初始化tac失败", e))
   }
   ```

### 对滑块的按钮和背景设置为自定义的一些样式

```js
// 这里分享一些作者自己调的样式供参考
const style =    {
    	// 按钮样式
        btnUrl: "https://minio.tianai.cloud/public/captcha-btn/btn3.png",
    	// 背景样式
        bgUrl: "https://minio.tianai.cloud/public/captcha-btn/btn3-bg.jpg",
    	// logo地址
        logoUrl: "https://minio.tianai.cloud/public/static/captcha/images/logo.png",
 		// 滑动边框样式
    	moveTrackMaskBgColor: "#f7b645",
        moveTrackMaskBorderColor: "#ef9c0d"
    }
 window.initTAC("./tac", config, style).then(tac => {
     tac.init(); // 调用init则显示验证码
 }).catch(e => {
     console.log("初始化tac失败", e);
 })
```

