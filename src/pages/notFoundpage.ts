import { routerInstance } from '../index'
import { $ } from '../shared/utils'

class NotFoundPage {
  constructor(private root: HTMLElement) {}

  makePageTemplate() {
    return `
    <section class='notfound-page-content'>
      <h1 class='notfound-page-title'>π΅βπ« μ‘΄μ¬νμ§ μλ νμ΄μ§ μλλ€! π΅βπ«</h1>
      <img src='assets/images/error.jpg' class='notfound-image' alt='notfoundpage-image' />
      <div class='button-container'>
        <button class='normal-button'>λ©μΈνμ΄μ§λ‘ μ΄λ</button>
      </div>
    </section>
    `
  }

  render() {
    this.root.innerHTML = this.makePageTemplate()

    const buttonElement = $('.normal-button')! as HTMLButtonElement
    buttonElement.addEventListener('click', () => {
      // λ©μΈνμ΄μ§λ‘ μ΄λν νμ΄μ§ μ€νμ΄ νλ λΉ μ ΈμΌν¨.
      routerInstance.handleNavigateBack()
      routerInstance.navigate('/', { replace: true })
    })
  }
}

export default NotFoundPage
