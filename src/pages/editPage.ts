import { routerInstance } from '../index'
import postService from '../shared/service/postService'
import { $, handleButtonDisabled } from '../shared/utils'
import { PostPreview } from '../types/index'

import CommonHeader from '../components/CommonHeader'
import CommonInput from '../components/CommonInput'

class EditPage {
  constructor(private root: HTMLElement, private params: any) {
    console.log(this.params)
  }
  // makeTemplate을 최초의 페이지 렌더링을 하고
  makeTemplate(post: PostPreview) {
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
    let post
    const { id } = this.params
    // 최초 수정 페이지 진입 했을때, params 받아와서 postId에 할당해주는 로직 넣어야함.
    const postId: number = +id

    try {
      const response = await postService.getPostById(postId)
      const { post: postData } = response.data
      post = postData
    } catch (err) {
      alert('없는 게시글을 조회 하였습니다!')
      routerInstance.handleNavigateBack()
    }
    // fetch후 post가 있으면 render
    if (post) {
      this.root.innerHTML = this.makeTemplate(post)
    }

    const backButton = $('.back-button')! as HTMLButtonElement
    const submitButton = $('.submit')! as HTMLButtonElement
    const input = $('.title')! as HTMLInputElement
    const textField = $('.content')! as HTMLTextAreaElement
    const imageContainer = $('.full-image-container')! as HTMLDivElement
    const imageUrl = imageContainer.querySelector('img')?.getAttribute('src')

    submitButton.addEventListener('click', async () => {
      if (!input.value.trim()) {
        alert('제목을 입력해 주세요!')
        return
      }
      if (!textField.value.trim()) {
        alert('내용을 입력해주세요!')
        return
      }
      const data = {
        title: input.value,
        content: textField.value,
        image: imageUrl || '',
      }

      try {
        fetching = true
        handleButtonDisabled(fetching, submitButton)
        await postService.updatePost(postId, data, () => {
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

    backButton.addEventListener('click', () => {
      routerInstance.handleNavigateBack()
    })
  }
}

export default EditPage
