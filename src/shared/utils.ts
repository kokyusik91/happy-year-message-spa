import { routerInstance } from '../index'

export function $(elementString: string) {
  return document.querySelector(elementString)
}

export const handleButtonDisabled = (
  state: boolean,
  buttonElement: HTMLButtonElement,
): void => {
  if (state) {
    buttonElement.disabled = true
  } else buttonElement.disabled = false
}

export const changeToLocalTime = (time: string): string => {
  return time.split('T')[0]
}

export const stripHTML = (text: string): string => {
  const regexForStripHTML = /(<([^>]+)>)/gi
  return text.replace(regexForStripHTML, '')
}

export const handleClickBackBtn = (buttonElement: HTMLButtonElement): void => {
  buttonElement.addEventListener('click', () => {
    routerInstance.handleNavigateBack()
  })
}

export const isValid = (
  inputElement: HTMLInputElement | HTMLTextAreaElement,
): boolean => {
  return inputElement.value.trim() ? true : false
}
