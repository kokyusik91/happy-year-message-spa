import { routerInstance } from '../index'
import postService from '../shared/service/postService'
import CommonHeader from '../components/CommonHeader'
import CommonInput from '../components/CommonInput'
import {
  $,
  handleButtonDisabled,
  handleClickBackBtn,
  isValid,
} from '../shared/utils'
// types
import { PostPreview } from '../types/index'

class EditPage {
  constructor(private root: HTMLElement, private params: any) {}
  // makeTemplate을 최초의 페이지 렌더링을 하고
  makePageTemplate(post: PostPreview) {
    const { title, content, image } = post
    return `
            ${CommonHeader.makeTemplate({
              title: 'Happy New Year 🎉',
              subTitle: '게시글을 수정해 보세요! 🖋️',
              buttonTemplate: '<button class="back-button">👈🏻</button>',
            })}
            <section class='main-content otherpage'>
              <div class='full-image-container'>
                <img src=${image} alt=${title} />
              </div>
              ${CommonInput.makeTemplate({ value: title })}
              <div class='input-container last'>
                <label for="content">내용</label>
                <textarea id='content' class='content' cols="100" rows="10" placeholder='내용을 작성해 주세요!'>${content}</textarea>
              </div>
              <button class='normal-button submit'>수정하기 🤥</button>
            </section>
    
    `
  }

  // updateTemplate을 해서 두번 페이지 렌더링을 해야하는건가??
  async render() {
    let fetching = false
    const { id } = this.params
    const postId: number = +id

    try {
      const response = await postService.getPostById(postId)
      const { post } = response.data
      this.root.innerHTML = this.makePageTemplate(post)
    } catch (err) {
      alert('존재하지 않는 게시글 입니다!')
      routerInstance.handleNavigateBack()
    }

    const backButton = $('.back-button')! as HTMLButtonElement
    const submitButton = $('.submit')! as HTMLButtonElement
    const input = $('.title')! as HTMLInputElement
    const textField = $('.content')! as HTMLTextAreaElement
    const imageContainer = $('.full-image-container')! as HTMLDivElement
    const imageUrl = imageContainer.querySelector('img')?.getAttribute('src')

    submitButton.addEventListener('click', async () => {
      if (!isValid(input)) {
        alert('제목을 입력해 주세요!')
        return
      }
      if (!isValid(textField)) {
        alert('내용을 입력해주세요!')
        return
      }
      const requestdata = {
        title: input.value,
        content: textField.value,
        image: imageUrl || '',
      }

      try {
        fetching = true
        handleButtonDisabled(fetching, submitButton)
        await postService.updatePost(postId, requestdata, () => {
          alert('수정에 성공하였습니다!')
          routerInstance.handleNavigateBack()
        })
      } catch (err) {
        alert(err)
      } finally {
        fetching = false
        handleButtonDisabled(fetching, submitButton)
      }
    })

    handleClickBackBtn(backButton)
  }
}

export default EditPage
