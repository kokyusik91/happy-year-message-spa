import { routerInstance } from '../index'
import postService from '../shared/service/postService'
import CommonHeader from '../components/CommonHeader'
import { changeToLocalTime, $, stripHTML } from '../shared/utils'
// types
import { Page, PostPreview } from '../types/index'

class MainPage implements Page {
  constructor(private root: HTMLElement, private params?: any) {}

  private attchPostPreviews(posts: PostPreview[], parentElement: HTMLElement) {
    const template = posts
      .map((post: PostPreview) => {
        return `
                <li class='post-list-item' data-id=${post.postId}>
                  <div class='post-image'>
                    <img src=${post.image} alt='포스트 이미지'/>
                  </div>
                  <div class='post-info'>
                    <h2 class='post-info-title'>${stripHTML(post.title)}</h2>
                    <p class='post-info-desc'>${stripHTML(post.content)}</p>
                    <time>${changeToLocalTime(post.createdAt)}</time>
                  </div>
                </li>`
      })
      .join('')

    parentElement.insertAdjacentHTML('beforeend', template)
  }

  makePageTemplate() {
    return `
            ${CommonHeader.makeTemplate({
              title: 'Happy New Year 2013 🐰',
              subTitle: '무슨 인사들이 올라왔을까요? 😊',
            })}
            <section class='main-content'>
              <h1 class='visually-hidden'>게시글 목록 리스트</h1>
              <ul class='post-list'></ul>
            </section>
            <footer class='main-footer'>
              <button class='fab-button'>
                <i class='icon-pencil'></i>
              </button>
            </footer>
          `
  }

  async render() {
    this.root.innerHTML = this.makePageTemplate()

    // 이 시점에 이미 html 요소 렌더링된 후 이므로 as 키워드로 강제 캐스팅하였음.
    const fabButton = $('.fab-button')! as HTMLButtonElement
    const postListElement = $('.post-list')! as HTMLUListElement

    try {
      const response = await postService.getPosts()
      const { posts } = response.data
      this.attchPostPreviews(posts, postListElement)
    } catch (err) {
      alert(err)
    }

    fabButton?.addEventListener('click', () => {
      routerInstance.navigate('/write')
    })
    // 이벤트 위임 사용
    postListElement.addEventListener('click', (e: any) => {
      if (e.target.nodeName === 'LI') {
        const postId = e.target.dataset.id
        routerInstance.navigate(`/post/${postId}`)
      }
    })
  }
}

export default MainPage
