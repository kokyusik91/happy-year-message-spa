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

export const changeToLocalTime = (time: string) => {
  return time.split('T')[0]
}
