import { routerInstance } from '../index'
import { $, changeToLocalTime, handleButtonDisabled } from '../shared/utils'

import postService from '../shared/service/postService'
import { PostPreview, Comment } from '../types/index'
import commentService from '../shared/service/commentService'

import CommonHeader from '../components/Header'

class DetailPage {
  constructor(private root: HTMLElement) {}

  attchComment(targetElement: HTMLElement, comments: Comment[]) {
    const commentTemplate = comments
      .map((comment) => {
        return `
            <li class='reply-list-item' data-id=${comment.commentId}>
              <p>${comment.content}</p>
              <button class='delete-button'>댓글 삭제</button>
            </li>`
      })
      .join('')

    targetElement.insertAdjacentHTML('beforeend', commentTemplate)
  }

  makeTemplate(post: PostPreview) {
    const { title, content, image, createdAt } = post
    return `
            ${CommonHeader.makeTemplate({
              title: 'Happy New Year 🎉',
              subTitle: '게시글 상세는 어떤글이 올라왔을까요? 🖋️',
              buttonTemplate: '<button class="back-button">👈🏻</button>',
            })}
            <section class='main-content fixed'>
              <article class='detailpage-content'>
                <div class='detailpage-content-image'>
                  <img src=${image} alt=${title} />
                </div>
                <div class='detailpage-content-header'>
                  <h1>${title}</h1>
                  <time>${changeToLocalTime(createdAt)}</time>
                </div>
                <div class='detailpage-content-body'>
                  <pre>
                    <p class='content'>${content}</p>
                  </pre>
                </div>
                <div class='detailpage-content-footer'>
                  <button class='action-button modify'>수정하기</button>
                  <button class='action-button delete'>삭제하기</button>
                </div>
              </article>
              <article class='reply'>
                <h1 class='reply-count'>댓글 0</h1>
                <ul class='reply-list'>

                </ul>
              </article>
              </section>
              <footer class='detailpage-footer'>
                <h1 class='visually-hidden'>댓글 입력 창</h1>
                <input class='detailpage-footer-input' type='text' placeholder='댓글을 입력해 주세요!' />
                <button class='detailpage-footer-button'>댓글 입력</button>
              </footer>
            `
  }

  async render() {
    let fetching = false
    let post: PostPreview = {
      postId: '',
      title: '',
      content: '',
      createdAt: '',
      image: '',
      updatedAt: '',
    }
    let comments: Comment[] = []

    // 최초 수정 페이지 진입 했을때, params 받아와서 postId에 할당해주는 로직 넣어야함.
    const postId: number = 197
    let commentCount = 0

    try {
      const response = await postService.getPostById(postId)
      const { post: postData, comments: commentsData } = response.data
      post = postData
      comments = commentsData
    } catch (err) {
      alert('없는 게시글을 조회 하였습니다!')
      routerInstance.handleNavigateBack()
    }

    // 상세페이지 렌더링
    this.root.innerHTML = this.makeTemplate(post)
    // 댓글 렌더링

    const backButton = $('.back-button')! as HTMLButtonElement
    const modifyButton = $('.modify')! as HTMLButtonElement
    const deleteButton = $('.delete')! as HTMLButtonElement
    const replyInput = $('.detailpage-footer-input')! as HTMLInputElement
    const replySubmitButton = $(
      '.detailpage-footer-button',
    )! as HTMLButtonElement
    const replayCount = $('.reply-count')! as HTMLHeadingElement
    // 전체 렌더링이 한번 되고 난 시점에 댓글 렌더를 따로 하게 됨 이거 맞나??
    const replyListElement = $('.reply-list')! as HTMLUListElement
    // 댓글 리스트가 렌더링 된다.
    this.attchComment(replyListElement, comments)
    replayCount.innerText = `댓글 ${replyListElement.childElementCount}`

    backButton.addEventListener('click', () => {
      routerInstance.handleNavigateBack()
    })

    modifyButton.addEventListener('click', () => {
      routerInstance.navigate(`/edit/:id`)
    })

    deleteButton.addEventListener('click', async () => {
      if (confirm('게시글을 정말로 삭제하시겠어요? 🤔')) {
        try {
          await postService.deletePost(postId, () => {
            alert('게시글이 성공적으로 삭제 되었습니다!')
            routerInstance.handleNavigateBack()
          })
        } catch (err) {
          alert(err)
        }
      }
    })

    replySubmitButton.addEventListener('click', async () => {
      console.log('눌렸다!')
      if (!replyInput.value.trim()) {
        alert('댓글을 입력해 주세요!')
        return
      }

      try {
        fetching = true
        handleButtonDisabled(fetching, replySubmitButton)
        const response = await commentService.uploadComment(postId, {
          content: replyInput.value,
        })
        replyInput.value = ''
        const { commentId, content } = response.data
        const commentTemplate = `
          <li class='reply-list-item' data-id=${commentId}>
              <p>${content}</p>
              <button class='delete-button'>댓글 삭제</button>
            </li>
        `
        replyListElement.insertAdjacentHTML('beforeend', commentTemplate)
        replayCount.innerText = `댓글 ${replyListElement.childElementCount}`
      } catch (err) {
        alert(err)
      } finally {
        fetching = false
        handleButtonDisabled(fetching, replySubmitButton)
      }
    })

    replyListElement.addEventListener('click', async (e: any) => {
      if (e.target?.nodeName === 'BUTTON') {
        const element = e.target.closest('.reply-list-item')
        const commentId = element.dataset.id
        try {
          await commentService.deleteComment(commentId)
          // 뷰에서 댓글 삭제...
          replyListElement.removeChild(element)
          const count = replyListElement.childElementCount
          replayCount.innerText = `댓글 ${count}`
        } catch (err) {
          alert(err)
        }
      }
    })
  }
}

export default DetailPage

// 클릭 이벤트 타입 지정하기
// 파람스 어떻게 처리할지?
// 댓글 렌더링 어떻게 하는게 최적일지?
// 댓글 갯수 어떻게 렌더링 해야할지 ?
