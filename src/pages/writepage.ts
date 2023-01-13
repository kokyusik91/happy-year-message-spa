import { routerInstance } from '../index'
import { $, handleButtonDisabled } from '../shared/utils'
import postService, { fetchUnsplashImage } from '../shared/service/postService'
import { UNSPLAH_ACCESS_KEY } from '../constants/index'
import { ExtraImageInfo, Page } from '../types/index'
import CommonHeader from '../components/Header'

class WritePage implements Page {
  constructor(private root: HTMLElement) {}

  private imageAttach(
    targetElement: HTMLElement,
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
    targetElement.innerHTML = imageContainerTemplate
  }

  makeTemplate() {
    return `
            ${CommonHeader.makeTemplate({
              title: 'Happy New Year 🎉',
              subTitle: '게시글을 작성해 보세요! 🖋️',
              buttonTemplate: '<button class="back-button">👈🏻</button>',
            })}
            <section class='main-content otherpage'>
              <div class='input-container'>
                <label for="title">제목</label>
                <input id='title' class='title' type='text' placeholder='제목을 작성해 주세요!'/>
              </div>
              <div class='input-container last'>
                <label for="content">내용</label>
                <textarea id='content' class='content' cols="100" rows="10" placeholder='내용을 작성해 주세요!'></textarea>
              </div>
              <div class='full-image-container'>
              </div>
              <button class='small-button random-image-trigger'>랜덤이미지 생성기</button>
              <button class='normal-button submit'>제출하기 🚀</button>
            </section>`
  }

  async render() {
    let fetching = false
    let imageUrl: string
    let imageDesc: string = ''
    this.root.innerHTML = this.makeTemplate()

    const imageContainer = $('.full-image-container')! as HTMLElement
    const backButton = $('.back-button')! as HTMLButtonElement
    const input = $('.title')! as HTMLInputElement
    const textField = $('.content')! as HTMLTextAreaElement
    const randomImageTriggerButton = $(
      '.random-image-trigger',
    )! as HTMLButtonElement
    const submitButton = $('.submit')! as HTMLButtonElement

    backButton.addEventListener('click', () => {
      routerInstance.handleNavigateBack()
    })

    randomImageTriggerButton.addEventListener('click', async () => {
      // fetching true 위치 체크!
      fetching = true
      handleButtonDisabled(fetching, randomImageTriggerButton)
      const response = await fetchUnsplashImage(UNSPLAH_ACCESS_KEY)
      imageUrl = response.urls.small
      imageDesc = response.alt_description
      const { downloads, likes, views } = response
      this.imageAttach(imageContainer, imageUrl, {
        imageDesc,
        downloads,
        likes,
        views,
      })
      fetching = false
      handleButtonDisabled(fetching, randomImageTriggerButton)
    })

    submitButton.addEventListener('click', async () => {
      if (!input.value.trim()) {
        alert('제목을 입력해 주세요!')
        return
      }
      if (!textField.value.trim()) {
        alert('내용을 입력해주세요!')
        return
      }
      if (!imageUrl) {
        alert('이미지를 추가해 주세요!')
        return
      }
      const data = {
        title: input.value,
        content: textField.value,
        image: imageUrl,
      }

      try {
        fetching = true
        handleButtonDisabled(fetching, submitButton)
        await postService.uploadPost(data, () => {
          alert('제출에 성공하였습니다!')
          routerInstance.handleNavigateBack()
        })
      } catch (err) {
        alert(err)
      } finally {
        fetching = false
        handleButtonDisabled(fetching, submitButton)
      }
    })
  }
}

export default WritePage
