import { routerInstance } from '../index'
import {
  $,
  handleButtonDisabled,
  handleClickBackBtn,
  isValid,
} from '../shared/utils'
import postService, { fetchUnsplashImage } from '../shared/service/postService'
import { UNSPLAH_ACCESS_KEY } from '../constants/index'
import { ExtraImageInfo, Page, ParamObj } from '../types/index'
import CommonHeader from '../components/CommonHeader'
import CommonInput from '../components/CommonInput'

class WritePage implements Page {
  constructor(private root: HTMLElement, private params: ParamObj) {}

  private attachPreviewImage(
    parentElement: HTMLElement,
    imageUrl: string,
    args: ExtraImageInfo,
  ) {
    const { imageDesc, downloads, likes, views } = args
    const imageContainerTemplate = `
                <h3>🎨 미리보기 이미지</h3>
                <img src=${imageUrl} alt=${imageDesc}/>   
                <dl>
                    <div class='data-wrapper'>
                      <dt>🌁 제목</dt>
                      <dd>${imageDesc}</dd>
                    </div>
                    <div class='data-wrapper'>
                      <dt>👀 조회 수</dt>
                      <dd>${views.toLocaleString('ko-KR')} 개</dd>
                    </div>
                    <div class='data-wrapper'>
                      <dt>💾 다운로드 수</dt>
                      <dd>${downloads.toLocaleString('ko-KR')} 개</dd>
                    </div>
                    <div class='data-wrapper'>
                      <dt>💕 좋아요 수</dt>
                      <dd>${likes} 개</dd>
                    </div>
                </dl>          
    `
    parentElement.innerHTML = imageContainerTemplate
  }

  makePageTemplate() {
    return `
            ${CommonHeader.makeTemplate({
              title: 'Happy New Year 🎉',
              subTitle: '게시글을 작성해 보세요! 🖋️',
              buttonTemplate:
                '<button class="back-button" aria-label="back-handle-button"><i class="icon-arrow-left2"></i></button>',
            })}
            <section class='main-content otherpage'>
              ${CommonInput.makeTemplate({})}
              <div class='input-container last'>
                <label for="content">내용</label>
                <textarea id='content' class='content' cols="100" rows="10" placeholder='내용을 작성해 주세요!'></textarea>
              </div>
              <div class='full-image-container'>
              </div>
              <button class='small-button random-image-trigger'><span>랜덤이미지 생성</span>  <i class='icon-image'></i></button>
              <button class='normal-button submit'>제출하기 🚀</button>
            </section>`
  }

  async render() {
    let fetching = false
    let imageUrl: string
    let imageDesc: string
    this.root.innerHTML = this.makePageTemplate()

    const imageContainer = $('.full-image-container')! as HTMLElement
    const backButton = $('.back-button')! as HTMLButtonElement
    const input = $('.title')! as HTMLInputElement
    const textField = $('.content')! as HTMLTextAreaElement
    const randomImageTriggerButton = $(
      '.random-image-trigger',
    )! as HTMLButtonElement
    const submitButton = $('.submit')! as HTMLButtonElement

    // 이미지 미리보기 렌더링
    randomImageTriggerButton.addEventListener('click', async () => {
      try {
        fetching = true
        handleButtonDisabled(fetching, randomImageTriggerButton)
        const response = await fetchUnsplashImage(UNSPLAH_ACCESS_KEY || '')
        imageUrl = response.urls.small
        imageDesc = response.alt_description
        const { downloads, likes, views } = response
        this.attachPreviewImage(imageContainer, imageUrl, {
          imageDesc,
          downloads,
          likes,
          views,
        })
        imageContainer.classList.add('attached')
      } catch (err) {
        alert(`😵${err}`)
      } finally {
        fetching = false
        handleButtonDisabled(fetching, randomImageTriggerButton)
      }
    })
    // 게시글 제출하기
    submitButton.addEventListener('click', async () => {
      if (!isValid(input)) {
        alert('제목을 입력해 주세요!')
        return
      }
      if (!isValid(textField)) {
        alert('내용을 입력해주세요!')
        return
      }
      if (!imageUrl) {
        alert('이미지를 추가해 주세요!')
        return
      }

      const requestData = {
        title: input.value,
        content: textField.value,
        image: imageUrl,
      }

      try {
        fetching = true
        handleButtonDisabled(fetching, submitButton)
        await postService.uploadPost(requestData, () => {
          alert('제출에 성공하였습니다!')
          routerInstance.handleNavigateBack()
        })
      } catch (err) {
        console.log(typeof err)

        alert(`😵${err}`)
      } finally {
        fetching = false
        handleButtonDisabled(fetching, submitButton)
      }
    })

    handleClickBackBtn(backButton)
  }
}

export default WritePage
