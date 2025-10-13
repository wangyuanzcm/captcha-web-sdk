import { createApp, h } from 'vue'
import { TianAiCaptcha, CaptchaConfig } from 'captcha-web-sdk'
import 'captcha-web-sdk/dist/tac/css/tac.css'

const App = {
  setup() {
    const showCaptcha = () => {
      const cfg = new CaptchaConfig({
        bindEl: '#captcha-box',
        requestCaptchaDataUrl: 'http://localhost:3000/gen?type=',
        validCaptchaUrl: 'http://localhost:3000/check',
        validSuccess: (res, c, tac) => { tac.destroyWindow(); alert('验证成功') },
        validFail: (res, c, tac) => { console.log('验证失败', res); tac.reloadCaptcha(); },
      })
      const tac = new TianAiCaptcha(cfg, { logoUrl: null })
      tac.init()
    }
    return () => h('div', { style: 'padding:20px;font-family:system-ui,Arial' }, [
      h('h2', 'Vue + NPM 使用示例'),
      h('div', { id: 'captcha-box', style: 'width:360px;margin:16px auto;' }),
      h('div', { style: 'text-align:center;' }, [
        h('button', { onClick: showCaptcha }, '显示验证码')
      ])
    ])
  }
}

createApp(App).mount('#app')