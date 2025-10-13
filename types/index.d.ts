export interface CaptchaRequestHeaders {
  [key: string]: string;
}

export interface CaptchaStyle {
  bgUrl?: string | null;
  logoUrl?: string | null;
  i18n?: Record<string, any>;
  [key: string]: any;
}

export interface CaptchaConfigOptions {
  bindEl: string;
  requestCaptchaDataUrl: string;
  validCaptchaUrl: string;
  requestHeaders?: CaptchaRequestHeaders;
  validSuccess?: (res: any, c: any, tac: TianAiCaptcha) => void;
  validFail?: (res: any, c: any, tac: TianAiCaptcha) => void;
  btnCloseFun?: (el: any, tac: TianAiCaptcha) => void;
  btnRefreshFun?: (el: any, tac: TianAiCaptcha) => void;
  timeToTimestamp?: boolean;
}

export class CaptchaConfig {
  constructor(options: CaptchaConfigOptions);
  requestCaptchaData(): Promise<any>;
  validCaptcha(currentCaptchaId: string, data: any, c?: any, tac?: TianAiCaptcha): Promise<any>;
  validSuccess(res: any, c: any, tac: TianAiCaptcha): void;
  validFail(res: any, c: any, tac: TianAiCaptcha): void;
}

export class TianAiCaptcha {
  constructor(config: CaptchaConfig | CaptchaConfigOptions, style?: CaptchaStyle);
  init(): this;
  destroyWindow(): void;
  reloadCaptcha(): void;
}

export default TianAiCaptcha;
export { TianAiCaptcha, CaptchaConfig };