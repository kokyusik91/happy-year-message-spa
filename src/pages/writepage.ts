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
                <h3>π¨ λ―Έλ¦¬λ³΄κΈ° μ΄λ―Έμ§</h3>
                <img src=${imageUrl} alt=${imageDesc}/>   
                <dl>
                    <div class='data-wrapper'>
                      <dt>π μ λͺ©</dt>
                      <dd>${imageDesc}</dd>
                    </div>
                    <div class='data-wrapper'>
                      <dt>π μ‘°ν μ</dt>
                      <dd>${views.toLocaleString('ko-KR')} κ°</dd>
                    </div>
                    <div class='data-wrapper'>
                      <dt>πΎ λ€μ΄λ‘λ μ</dt>
                      <dd>${downloads.toLocaleString('ko-KR')} κ°</dd>
                    </div>
                    <div class='data-wrapper'>
                      <dt>π μ’μμ μ</dt>
                      <dd>${likes} κ°</dd>
                    </div>
                </dl>          
    `
    parentElement.innerHTML = imageContainerTemplate
  }

  makePageTemplate() {
    return `
            ${CommonHeader.makeTemplate({
              title: 'Happy New Year π',
              subTitle: 'κ²μκΈμ μμ±ν΄ λ³΄μΈμ! ποΈ',
              buttonTemplate:
                '<button class="back-button" aria-label="back-handle-button"><i class="icon-arrow-left2"></i></button>',
            })}
            <section class='main-content otherpage'>
               <div class='input-container'>
                <label for="title">μ λͺ©</label>
                <input id='title' class='title' type='text' placeholder='μ λͺ©μ μμ±ν΄ μ£ΌμΈμ!'  />
              </div>
              <div class='input-container last'>
                <label for="content">λ΄μ©</label>
                <textarea id='content' class='content' cols="100" rows="10" placeholder='λ΄μ©μ μμ±ν΄ μ£ΌμΈμ!'></textarea>
              </div>
              <div class='full-image-container'>
              </div>
              <button class='small-button random-image-trigger'><span>λλ€μ΄λ―Έμ§ μμ±</span>  <i class='icon-image'></i></button>
              <button class='normal-button submit'>μ μΆνκΈ° π</button>
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

    // μ΄λ―Έμ§ λ―Έλ¦¬λ³΄κΈ° λ λλ§
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
        alert(`π΅${err}`)
      } finally {
        fetching = false
        handleButtonDisabled(fetching, randomImageTriggerButton)
      }
    })
    // κ²μκΈ μ μΆνκΈ°
    submitButton.addEventListener('click', async () => {
      if (!isValid(input)) {
        alert('μ λͺ©μ μλ ₯ν΄ μ£ΌμΈμ!')
        return
      }
      if (!isValid(textField)) {
        alert('λ΄μ©μ μλ ₯ν΄μ£ΌμΈμ!')
        return
      }
      if (!imageUrl) {
        alert('μ΄λ―Έμ§λ₯Ό μΆκ°ν΄ μ£ΌμΈμ!')
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
          alert('μ μΆμ μ±κ³΅νμμ΅λλ€!')
          routerInstance.handleNavigateBack()
        })
      } catch (err) {
        console.log(typeof err)

        alert(`π΅${err}`)
      } finally {
        fetching = false
        handleButtonDisabled(fetching, submitButton)
      }
    })

    handleClickBackBtn(backButton)
  }
}

export default WritePage
