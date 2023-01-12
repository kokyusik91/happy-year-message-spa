class DetailPage {
  constructor(private root: HTMLElement) {}

  makeTemplate() {
    return `<h1>디테일 페이지 입니다!</h1>`
  }

  render() {
    this.root.innerHTML = this.makeTemplate()
  }
}

export default DetailPage
