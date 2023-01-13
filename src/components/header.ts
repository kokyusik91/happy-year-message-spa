import { HeaderProps } from '../types/index'

class CommonHeader {
  static makeTemplate({
    title = '제목',
    subTitle = '소제목',
    buttonTemplate,
  }: HeaderProps) {
    return `
      <header class='main-header'>
        <nav>
          ${buttonTemplate ? buttonTemplate : '<button></button>'}
          <h1>${title}</h1>
        </nav>
        <div class='main-header-notice'>
          <p class='sub-title'>${subTitle}</p>
        </div>
      </header>
    `
  }
}

export default CommonHeader
