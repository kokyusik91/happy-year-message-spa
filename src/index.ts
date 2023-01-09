import './app'
import './shared/api'

class App {
  constructor(element: HTMLElement) {
    const h1Tag = document.createElement('h1')
    h1Tag.innerText = '제목입니다!'
    element.insertAdjacentElement('afterend', h1Tag)
  }
}

new App(document.getElementById('root')! as HTMLElement)
