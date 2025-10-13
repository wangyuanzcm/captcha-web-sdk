## 1.1.0 (2025-10-13)

Enhancements
- 支持同时通过 NPM 与 CDN 使用：新增多格式构建（UMD/ESM/CJS），并抽取样式至 dist/tac/css/tac.css。
- 安全全局暴露：仅在浏览器环境挂载 window.TAC 与 window.CaptchaConfig。
- 类型声明：新增 types/index.d.ts，为公开 API 提供 TypeScript 支持。
- 文档与示例：更新 README 并新增 public/demo-cdn.html 演示页。
- 开发体验：devServer 提供 /gen 与 /check 的 Mock 接口，便于本地验证。
- CI（可选）：新增最小构建工作流 .github/workflows/build.yml。

Breaking Changes
- 无（与原有 load.js 用法兼容）。

## 1.0.0

- 初始版本：支持基本拖拽验证码功能与演示。