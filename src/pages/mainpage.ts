import { routerInstance } from '../index'
import { BaseComponent } from '../components/baseComponent'

class MainPage {
  constructor(private root: HTMLElement) {}

  makeTemplate() {
    return `<h1>메인페이지 입니다!</h1>
            <button class='htmlbtn'>글쓰기 페이지로 이동!</button>
            <button class='htmlbtn2'>상세 페이지로 이동!</button>
          `
  }

  render() {
    this.root.innerHTML = this.makeTemplate()

    const btn = document.querySelector('.htmlbtn')
    btn?.addEventListener('click', () => {
      routerInstance.navigate('/write')
    })

    const btn2 = document.querySelector('.htmlbtn2')
    btn2?.addEventListener('click', () => {
      routerInstance.navigate('/detail')
    })
  }
}

export default MainPage
