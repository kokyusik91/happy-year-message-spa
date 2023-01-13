class notFoundPage {
  constructor(private root: HTMLElement) {}

  makeTemplate() {
    return `<h1>없는 페이지 입니다!</h1>
      <button class='toMain'>메인페이지로 이동</button>
`
  }

  render() {
    this.root.innerHTML = this.makeTemplate()
  }
}

export default notFoundPage
