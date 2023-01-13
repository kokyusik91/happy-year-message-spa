import { Post, postRequestModel } from '../types/index'
import { BASE_URL } from '../constants/index'

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
