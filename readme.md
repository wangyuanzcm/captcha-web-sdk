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
<!-- UMD 构建已移动到 dist/umd 下，开发服务静态目录映射为 /umd -->
<script src="/umd/tac.min.js"></script>
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
<!-- 注意：UMD Bundle 路径为 dist/umd/tac.min.js -->
<script src="https://unpkg.com/captcha-web-sdk/dist/umd/tac.min.js"></script>
```

发布后也可使用 jsDelivr：

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/captcha-web-sdk/dist/tac/css/tac.css">
<script src="https://cdn.jsdelivr.net/npm/captcha-web-sdk/dist/umd/tac.min.js"></script>
```

## 本仓库示例与本地联调

为便于本地验证，仓库内提供了 React、Vue 以及 CDN 三种示例，以及一个开发用的 webpack devServer（端口 3000），提供 /gen 与 /check 的 Mock 接口。

- 根项目开发服务（提供静态资源与 Mock 接口）
  - 启动：在项目根目录执行
    - `npm run build:lib`（构建产物到 dist/umd、dist/esm、dist/cjs 与共享资源 dist/tac）
    - `npm start`（启动 webpack devServer，端口 3000）
  - 访问：
    - CDN 示例页面：http://localhost:3000/examples/cdn/index.html
    - 也可以访问 `public/demo-cdn.html` 演示页
  - Mock 接口：
    - `POST /gen?type=` 返回示例验证码数据（type=SLIDER 时使用 `src/slider.json`）
    - `POST /check` 始终返回成功 `{ code: 200, msg: 'ok' }`
  - 跨域：已在 devServer 中开启 CORS，并处理了 OPTIONS 预检，可直接被 5173/5174 端口的示例访问。

- React 示例
  - 路径：`examples/react-npm`
  - 启动：
    - `cd examples/react-npm && npm install && npm run dev`
    - 打开 http://localhost:5173/
  - 接口：默认在示例代码中使用 `http://localhost:3000/gen?type=` 与 `http://localhost:3000/check` 指向根服务；如需同源代理，可在 React 项目添加 Vite 代理：
    - 将示例代码改为 `requestCaptchaDataUrl: '/gen?type='`、`validCaptchaUrl: '/check'`
    - 在 `vite.config.js` 中添加：
      ```js
      import { defineConfig } from 'vite'
      export default defineConfig({
        server: {
          proxy: {
            '/gen': 'http://localhost:3000',
            '/check': 'http://localhost:3000'
          }
        }
      })
      ```

- Vue 示例
  - 路径：`examples/vue-npm`
  - 启动：
    - `cd examples/vue-npm && npm install && npm run dev`
    - 打开 http://localhost:5174/
  - 接口：同 React 示例，默认直连 3000；也可添加 Vite 代理实现同源访问。

## 产物结构与入口说明

- 构建产物目录：
  - `dist/umd/`：UMD Bundle（`tac.min.js`、`tac.umd.js`）
  - `dist/esm/`：ESM 入口（`tac.esm.js`）
  - `dist/cjs/`：CJS 入口（`tac.cjs.js`）
  - `dist/tac/`：共享静态资源（`css/tac.css`、`images/icon.png`）
- 包入口（package.json）：
  - `exports`：
    - `"."`：
      - `types`: `./types/index.d.ts`
      - `import`: `./dist/esm/tac.esm.js`
      - `require`: `./dist/cjs/tac.cjs.js`
      - `default`: `./dist/esm/tac.esm.js`
    - 资源：`./dist/tac/css/tac.css`
  - `module`: `dist/esm/tac.esm.js`
  - `main`: `dist/cjs/tac.cjs.js`
  - `unpkg/jsdelivr`: `dist/umd/tac.min.js`

## TypeScript 支持

包内提供类型声明 `types/index.d.ts`，可在 TS 项目中直接：

```ts
import { TianAiCaptcha, CaptchaConfig } from 'captcha-web-sdk'
import 'captcha-web-sdk/dist/tac/css/tac.css'

const cfg = new CaptchaConfig({
  bindEl: '#captcha-box',
  requestCaptchaDataUrl: '/gen?type=',
  validCaptchaUrl: '/check',
})
const tac = new TianAiCaptcha(cfg, { logoUrl: null })
tac.init()
```

## 构建与发布

- 开发/本地验证：
  - `npm start`（端口 3000），含 /gen 与 /check 的 Mock
- 构建库：
  - `npm run build:lib`（会清理 dist 并依次生成 UMD/ESM/CJS 产物）
  - 单独构建：
    - `npm run build:lib:umd:dev`
    - `npm run build:lib:umd`
    - `npm run build:lib:esm`
    - `npm run build:lib:cjs`
- 预发布钩子：
  - `prepublishOnly` 会触发 `npm run build:lib`

## 环境与依赖说明

- Node.js >= 18
- Sass 构建已经切换至 Embedded Sass，`sass-loader@^15` 并启用 `api: 'modern'`；构建过程中不会再出现旧版 JS API 弃用警告。

## 常见问题排查（FAQ）

- Vite 报错 “Failed to resolve entry for package 'captcha-web-sdk'”：
  - 请确认根项目已执行 `npm run build:lib`，并且示例项目重新执行了 `npm install` 以更新本地依赖（确保 `node_modules/captcha-web-sdk/dist` 下有产物）。
- 跨域错误（CORS）：
  - 根 devServer 已开启 CORS；若仍需同源访问，请在示例项目添加上文所述 Vite 代理。
- 资源 404：
  - UMD 路径为 `/umd/tac.min.js`，CSS 路径为 `/tac/css/tac.css`；公共 CDN 路径为 `dist/umd/tac.min.js` 与 `dist/tac/css/tac.css`。

---

备注：本仓库默认不提供旧版 `load.min.js`，如需沿用原作者的加载方式，请参考原项目的说明或在自己的项目中引入相应脚本。

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

