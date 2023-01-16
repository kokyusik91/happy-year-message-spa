import { routerInstance } from '../index'
import { $ } from '../shared/utils'

class notFoundPage {
  constructor(private root: HTMLElement) {}

  makePageTemplate() {
    return `
    <section class='notfound-page-content'>
      <h1>😵‍💫 존재하지 않는 페이지 입니다! 😵‍💫</h1>
      <div class='button-container'>
        <button class='normal-button'>메인페이지로 이동</button>
      </div>
    </section>
    `
  }

  render() {
    this.root.innerHTML = this.makePageTemplate()

    const buttonElement = $('.normal-button')! as HTMLButtonElement
    buttonElement.addEventListener('click', () => {
      // 메인페이지로 이동후 페이지 스택이 하나 빠져야함.
      routerInstance.handleNavigateBack()
      routerInstance.navigate('/', { replace: true })
    })
  }
}

export default notFoundPage
