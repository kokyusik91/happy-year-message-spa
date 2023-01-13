import { routerInstance } from '../index'
import postService from '../shared/api'

const changeToLocalTime = (time: string) => {
  return time.split('T')[0]
}

class MainPage {
  constructor(private root: HTMLElement) {}

  makeTemplate() {
    return `<header class='main-header'>
              <nav>
                <button></button>
                <h1>Happy New Year 🎉</h1>
              </nav>
              <div class='main-header-notice'>
                <p>무슨 인사들이 올라왔을까요? 😊</p>
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

    const response = await postService.getPosts()
    const { posts } = response.data

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
                    <time>${changeToLocalTime(post.createdAt)}</time>
                  </div>
                </li>`
      })
      .join('')

    const fabButton = document.querySelector('.fab-button')
    fabButton?.addEventListener('click', () => {
      routerInstance.navigate('/write')
    })

    const ulTag = document.querySelector('.post-list')! as HTMLUListElement
    ulTag.insertAdjacentHTML('beforeend', template)
  }
}

export default MainPage
