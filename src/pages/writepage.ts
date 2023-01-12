import { routerInstance } from '../index'

class WritePage {
  constructor(private root: HTMLElement) {}

  makeTemplate() {
    return `<h1>작성하기 페이지 입니다!</h1>`
  }
  render() {
    this.root.innerHTML = this.makeTemplate()

    const mainButton = document.querySelector('.toMain')
    mainButton?.addEventListener('click', () => {
      routerInstance.navigate('/')
    })
  }
}

export default WritePage
