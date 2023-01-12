import { routerInstance } from '../index'

class WritePage {
  constructor(private root: HTMLElement) {}

  makeTemplate() {
    return `<h1>작성하기 페이지 입니다! ✒️</h1>
    <button class='htmlbtn2'>상세 페이지로 이동!</button>`
  }
  render() {
    this.root.innerHTML = this.makeTemplate()

    const btn2 = document.querySelector('.htmlbtn2')
    btn2?.addEventListener('click', () => {
      routerInstance.navigate('/detail', { replace: true })
    })
  }
}

export default WritePage
