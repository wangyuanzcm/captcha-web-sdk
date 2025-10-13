import {CaptchaConfig, TianAiCaptcha} from "./captcha/captcha";

// 条件挂载到全局（仅在浏览器环境下），用于 CDN 使用方式
if (typeof window !== "undefined") {
  window.TAC = TianAiCaptcha;
  window.CaptchaConfig = CaptchaConfig;
}

// 导出用于 NPM/打包器使用方式
export { TianAiCaptcha, CaptchaConfig };
