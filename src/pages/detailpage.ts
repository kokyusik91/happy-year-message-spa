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

import { PostPreview, Comment } from '../types/index'

class DetailPage {
  constructor(private root: HTMLElement, private params: any) {}

  attchComment(parentElement: HTMLElement, comments: Comment[]) {
    const commentTemplate = comments
      .map((comment) => {
        return `
            <li class='reply-list-item' data-id=${comment.commentId}>
              <p>${stripHTML(comment.content)}</p>
              <button class='delete-button submit'>댓글 삭제</button>
            </li>`
      })
      .join('')
    parentElement.insertAdjacentHTML('beforeend', commentTemplate)
  }

  makePageTemplate(post: PostPreview) {
    const { title, content, image, createdAt } = post
    return `
            ${CommonHeader.makeTemplate({
              title: 'Happy New Year 🎉',
              subTitle: '게시글 상세는 어떤글이 올라왔을까요? 🖋️',
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
                  <button class='action-button modify'>수정하기</button>
                  <button class='action-button delete'>삭제하기</button>
                </div>
              </article>
              <article class='reply'>
                <h1 class='reply-count'>댓글 0</h1>
                <ul class='reply-list'></ul>
              </article>
              </section>
              <footer class='detailpage-footer'>
                <h1 class='visually-hidden'>댓글 입력 창</h1>
                <input class='detailpage-footer-input' type='text' placeholder='댓글을 입력해 주세요!' />
                <button class='detailpage-footer-button submit'>댓글 입력</button>
              </footer>
            `
  }

  async render() {
    let fetching = false
    let comments: Comment[] = []

    const { id } = this.params
    const postId: number = +id

    try {
      const response = await postService.getPostById(postId)
      const { post, comments: commentsData } = response.data
      this.root.innerHTML = this.makePageTemplate(post)
      comments = commentsData
    } catch (err) {
      alert('없는 게시글을 조회 하였습니다!')
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
    // 전체 렌더링이 한번 되고 난 시점에 댓글 렌더를 따로 하게 됨 이거 맞나??
    const commentListElement = $('.reply-list')! as HTMLUListElement
    // 댓글 리스트가 렌더링 된다.
    this.attchComment(commentListElement, comments)
    commentCount.innerText = `댓글 ${commentListElement.childElementCount}`

    modifyButton.addEventListener('click', () => {
      routerInstance.navigate(`/edit/${postId}`)
    })

    deleteButton.addEventListener('click', async () => {
      if (confirm('게시글을 정말로 삭제하시겠어요? 🤔')) {
        try {
          fetching = true
          handleButtonDisabled(fetching, deleteButton)
          await postService.deletePost(postId, () => {
            alert('게시글이 성공적으로 삭제 되었습니다!')
            routerInstance.handleNavigateBack()
          })
        } catch (err) {
          alert(err)
        } finally {
          fetching = false
          handleButtonDisabled(fetching, deleteButton)
        }
      }
    })

    commentSubmitButton.addEventListener('click', async () => {
      if (!isValid(commentInput)) {
        alert('댓글을 입력해 주세요!')
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
        // 메서드 재사용하기 위해 comment(1개)를 배열에 담아서 인자로 넘김
        this.attchComment(commentListElement, [comment])
        commentCount.innerText = `댓글 ${commentListElement.childElementCount}`
      } catch (err) {
        alert('중복 댓글은 작성할 수 없습니다.')
      } finally {
        fetching = false
        handleButtonDisabled(fetching, commentSubmitButton)
      }
    })
    // 이벤트 위임 사용
    commentListElement.addEventListener('click', async (e: Event) => {
      const target = e.target as HTMLElement
      if (target?.nodeName === 'BUTTON') {
        const element = target.closest('.reply-list-item')! as HTMLElement
        const commentId = element.dataset.id
        // 선택된 요소의 삭제버튼을 찾아야함!
        const commentDeleteButton = element.querySelector(
          '.delete-button',
        )! as HTMLButtonElement
        try {
          fetching = true
          handleButtonDisabled(fetching, commentDeleteButton)
          await commentService.deleteComment(+commentId!)
          // 뷰에서 댓글 삭제...
          commentListElement.removeChild(element)
          commentCount.innerText = `댓글 ${commentListElement.childElementCount}`
        } catch (err) {
          alert(err)
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
