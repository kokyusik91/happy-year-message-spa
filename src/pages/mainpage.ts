import { routerInstance } from '../index'
import postService from '../shared/service/postService'
import CommonHeader from '../components/CommonHeader'
import { changeToLocalTime, $, stripHTML } from '../shared/utils'
// types
import { Page, ParamObj, PostPreview } from '../types/index'

class MainPage implements Page {
  constructor(private root: HTMLElement, private params?: ParamObj) {
    console.log(params)
  }

  private attchPostPreviews(posts: PostPreview[], parentElement: HTMLElement) {
    const template = posts
      .map((post: PostPreview) => {
        return `
                <li class='post-list-item' data-id=${post.postId}>
                  <div class='post-image'>
                    <img src=${
                      post.image ? post.image : '/assets/images/error.jpg'
                    } alt=${stripHTML(post.title)}'/>
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
              title: 'Happy New Year 2023 🐰',
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

    // 이 시점에 이미 html 요소 렌더링된 후 이므로 as 키워드로 type assertion
    const fabButton = $('.fab-button')! as HTMLButtonElement
    const postListElement = $('.post-list')! as HTMLUListElement

    try {
      const response = await postService.getPosts()
      const { posts } = response.data
      const sortedPosts = posts.sort((a: PostPreview, b: PostPreview) =>
        b.createdAt.localeCompare(a.createdAt),
      )
      this.attchPostPreviews(sortedPosts, postListElement)
    } catch (err) {
      alert(`😵${err}`)
    }
    fabButton?.addEventListener('click', () => {
      routerInstance.navigate('/write')
    })
    // 이벤트 위임 사용
    postListElement.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement

      if (target.nodeName === 'LI') {
        const postId = target.dataset.id
        routerInstance.navigate(`/post/${postId}`)
      }
    })
  }
}

export default MainPage
