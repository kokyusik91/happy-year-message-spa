import { routerInstance } from '../index'
import postService from '../shared/service/postService'
import { changeToLocalTime, $ } from '../shared/utils'
import { Page } from '../types/index'

import CommonHeader from '../components/CommonHeader'

class MainPage implements Page {
  constructor(private root: HTMLElement, private params: any) {
    console.log(this.params)
  }

  makeTemplate() {
    return `
            ${CommonHeader.makeTemplate({
              title: 'Happy New Year 2013 🐰',
              subTitle: '무슨 인사들이 올라왔을까요? 😊',
            })}
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

    const fabButton = $('.fab-button')
    const ulElement = $('.post-list')! as HTMLUListElement

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

    fabButton?.addEventListener('click', () => {
      routerInstance.navigate('/write')
    })

    ulElement.insertAdjacentHTML('beforeend', template)

    ulElement.addEventListener('click', (e: any) => {
      if (e.target.nodeName === 'LI') {
        const postId = e.target.dataset.id
        routerInstance.navigate(`/post/${postId}`)
      }
    })
  }
}

export default MainPage
