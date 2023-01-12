import { routerInstance } from '../index'
import { BaseComponent } from '../components/baseComponent'

class MainPage {
  constructor(private root: HTMLElement) {}

  makeTemplate() {
    return `<header class='main-header'>
              <h1>Happy New Year 🎉</h1>
              <div class='main-header-notice'>
                <p>새해 인사를 나눠 보아요 🥳</p>
              </div>
            </header>
            <section class='main-content'>
              <h1 class='visually-hidden'>게시글 목록 리스트</h1>
              <ul class='post-list'>
              </ul>
            </section>
            <footer class='main-footer'>
              <button class='fab-button'>🖊️</button>
            </footer>
          `
  }

  async render() {
    this.root.innerHTML = this.makeTemplate()

    const response = await fetch('http://43.201.103.199/posts').then((res) => {
      if (res.ok) {
        return res.json()
      }
    })

    const { data } = response
    const posts = data.posts

    const template = posts
      .map((post: any) => {
        return `
                <li class='post-list-item' data-id=${post.postId}>
                  <div class='post-image'>
                    <img src=${post.image} alt='포스트 이미지'/>
                  </div>
                  <div class='post-info'>
                    <h2 class='post-info-title'>${post.title}</h2>
                    <p class='post-info-desc'>${post.content}</p>
                  </div>
            
                </li>`
      })
      .join('')

    console.log(template)

    const fabButton = document.querySelector('.fab-button')
    fabButton?.addEventListener('click', () => {
      routerInstance.navigate('/write')
    })

    const ulTag = document.querySelector('.post-list')! as HTMLUListElement
    ulTag.insertAdjacentHTML('beforeend', template)
  }
}

export default MainPage
