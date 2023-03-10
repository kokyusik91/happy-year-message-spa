import { routerInstance } from '../index'
import postService from '../shared/service/postService'
import commentService from '../shared/service/commentService'
import CommonHeader from '../components/CommonHeader'

import {
  $,
  changeToLocalTime,
  handleButtonDisabled,
  handleClickBackBtn,
  isValid,
  stripHTML,
} from '../shared/utils'

import { PostPreview, Comment, ParamObj } from '../types/index'

class DetailPage {
  constructor(private root: HTMLElement, private params: ParamObj) {}

  attchComment(parentElement: HTMLElement, comments: Comment[]) {
    const commentTemplate = comments
      .map((comment) => {
        return `
            <li class='reply-list-item' data-id=${comment.commentId}>
              <p>${stripHTML(comment.content)}</p>
              <button class='delete-button submit'>λκΈ μ­μ </button>
            </li>`
      })
      .join('')
    parentElement.insertAdjacentHTML('beforeend', commentTemplate)
  }

  makePageTemplate(post: PostPreview) {
    const { title, content, image, createdAt } = post
    return `
            ${CommonHeader.makeTemplate({
              title: 'Happy New Year π',
              subTitle: 'κ²μκΈ μμΈλ μ΄λ€κΈμ΄ μ¬λΌμμκΉμ? ποΈ',
              buttonTemplate:
                '<button class="back-button"><i class="icon-arrow-left2"></i></button>',
            })}
            <section class='main-content fixed'>
              <article class='detailpage-content'>
                <div class='detailpage-content-image'>
                  <img src=${image} alt=${title} />
                </div>
                <div class='detailpage-content-header'>
                  <h1>${stripHTML(title)}</h1>
                  <time>${changeToLocalTime(createdAt)}</time>
                </div>
                <div class='detailpage-content-body'>
                    <p class='content'>${stripHTML(content)}</p>
                </div>
                <div class='detailpage-content-footer'>
                  <button class='action-button modify'>μμ νκΈ°</button>
                  <button class='action-button delete'>μ­μ νκΈ°</button>
                </div>
              </article>
              <article class='reply'>
                <h1 class='reply-count'>λκΈ 0</h1>
                <ul class='reply-list'></ul>
              </article>
              <div class='empty-box'></div>
              </section>
              <footer class='detailpage-footer'>
                <h1 class='visually-hidden'>λκΈ μλ ₯ μ°½</h1>
                <input class='detailpage-footer-input' type='text' placeholder='λκΈμ μλ ₯ν΄ μ£ΌμΈμ!' />
                <button class='detailpage-footer-button submit'>λκΈ μλ ₯</button>
              </footer>
            `
  }

  async render() {
    let fetching = false
    let comments: Comment[] = []

    const { id } = this.params
    const postId: number = +id! as number

    try {
      const response = await postService.getPostById(postId)
      const { post, comments: commentsData } = response.data
      this.root.innerHTML = this.makePageTemplate(post)
      comments = commentsData
    } catch (err) {
      alert(`π΅${err}`)

      routerInstance.handleNavigateBack()
    }

    const backButton = $('.back-button')! as HTMLButtonElement
    const modifyButton = $('.modify')! as HTMLButtonElement
    const deleteButton = $('.delete')! as HTMLButtonElement
    const commentInput = $('.detailpage-footer-input')! as HTMLInputElement
    const commentSubmitButton = $(
      '.detailpage-footer-button',
    )! as HTMLButtonElement
    const commentCount = $('.reply-count')! as HTMLHeadingElement
    // μ μ²΄ λ λλ§μ΄ νλ² λκ³  λ μμ μ λκΈ λ λλ₯Ό λ°λ‘ νκ² λ¨ μ΄κ±° λ§λ??
    const commentListElement = $('.reply-list')! as HTMLUListElement
    // λκΈ λ¦¬μ€νΈκ° λ λλ§ λλ€.
    this.attchComment(commentListElement, comments)
    commentCount.innerText = `λκΈ ${commentListElement.childElementCount}`

    modifyButton.addEventListener('click', () => {
      routerInstance.navigate(`/edit/${postId}`)
    })

    deleteButton.addEventListener('click', async () => {
      if (confirm('κ²μκΈμ μ λ§λ‘ μ­μ νμκ² μ΄μ? π€')) {
        try {
          fetching = true
          handleButtonDisabled(fetching, deleteButton)
          await postService.deletePost(postId, () => {
            alert('κ²μκΈμ΄ μ±κ³΅μ μΌλ‘ μ­μ  λμμ΅λλ€!')
            routerInstance.handleNavigateBack()
          })
        } catch (err) {
          alert(`π΅${err}`)
        } finally {
          fetching = false
          handleButtonDisabled(fetching, deleteButton)
        }
      }
    })

    commentSubmitButton.addEventListener('click', async () => {
      if (!isValid(commentInput)) {
        alert('λκΈμ μλ ₯ν΄ μ£ΌμΈμ!')
        return
      }

      try {
        fetching = true
        handleButtonDisabled(fetching, commentSubmitButton)
        const response = await commentService.uploadComment(postId, {
          content: commentInput.value,
        })
        commentInput.value = ''
        const { data: comment } = response
        // λ©μλ μ¬μ¬μ©νκΈ° μν΄ comment(1κ°)λ₯Ό λ°°μ΄μ λ΄μμ μΈμλ‘ λκΉ
        this.attchComment(commentListElement, [comment])
        commentCount.innerText = `λκΈ ${commentListElement.childElementCount}`
      } catch (err) {
        // μλ²μμ μλ¬ λ©μμ§κ° μ λλ‘ μ λ¬μ΄ μλ¨.. μμλ‘ λμ²΄
        alert(`π΅${err}`)
      } finally {
        fetching = false
        handleButtonDisabled(fetching, commentSubmitButton)
      }
    })
    // μ΄λ²€νΈ μμ μ¬μ©
    commentListElement.addEventListener('click', async (e: Event) => {
      const target = e.target as HTMLElement
      if (target?.nodeName === 'BUTTON') {
        const element = target.closest('.reply-list-item')! as HTMLElement
        const commentId = element.dataset.id
        // μ νλ μμμ μ­μ λ²νΌμ μ°ΎμμΌν¨!
        const commentDeleteButton = element.querySelector(
          '.delete-button',
        )! as HTMLButtonElement
        try {
          fetching = true
          handleButtonDisabled(fetching, commentDeleteButton)
          await commentService.deleteComment(+commentId!)
          // λ·°μμ λκΈ μ­μ ...
          commentListElement.removeChild(element)
          commentCount.innerText = `λκΈ ${commentListElement.childElementCount}`
        } catch (err) {
          alert(`π΅${err}`)
        } finally {
          fetching = false
          handleButtonDisabled(fetching, commentDeleteButton)
        }
      }
    })

    handleClickBackBtn(backButton)
  }
}

export default DetailPage
