import './app'
import './shared/api'
import writePage from './app'

import '../styles/index.scss'

class App {
  private data: any
  constructor(element?: HTMLElement) {
    const buttonTag = document.createElement('button')! as HTMLButtonElement
    buttonTag.innerText = '작성하기'
    element?.insertAdjacentElement('afterend', buttonTag)
    buttonTag.addEventListener('click', () => {
      PageRoute.push({ template: writePage }, '/write')
      this.data = history.state.template
      App.render(this.data)
    })

    const buttonTag2 = document.createElement('button')! as HTMLButtonElement
    buttonTag2.innerText = '수정하기'
    element?.insertAdjacentElement('afterend', buttonTag2)
    buttonTag2.addEventListener('click', () => {
      PageRoute.push({ template: `<h1>디테일 페이지</h1>` }, '/detail')
      this.data = history.state.template
      App.render(this.data)
    })
  }

  // 화면에 템플릿을 그려주는 함수
  static render(template: string) {
    const body = document.querySelector('body')! as HTMLElement
    body.innerHTML = template
  }
}

class PageRoute {
  constructor() {}

  static push(data?: any, url?: string) {
    history.pushState(data, 'null', url)
  }

  static back() {
    history.back()
  }

  static pageStack() {
    return history.length
  }
}

new App(document.getElementById('root')! as HTMLElement)

window.onpopstate = function (event) {
  console.log('스테이트', event.state)
  App.render(`<h1>디테일 페이지</h1>`)
}
