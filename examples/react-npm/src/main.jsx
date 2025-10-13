import React from 'react'
import ReactDOM from 'react-dom/client'
import { TianAiCaptcha, CaptchaConfig } from 'captcha-web-sdk'
import 'captcha-web-sdk/dist/tac/css/tac.css'

function App() {
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

  return (
    <div style={{ padding: 20, fontFamily: 'system-ui, Arial' }}>
      <h2>React + NPM 使用示例</h2>
      <div id="captcha-box" style={{ width: 360, margin: '16px auto' }}></div>
      <div style={{ textAlign: 'center' }}>
        <button onClick={showCaptcha}>显示验证码</button>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />)