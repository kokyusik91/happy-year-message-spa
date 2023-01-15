type InputProps = {
  value?: string
  placeholder?: string
}

class CommonInput {
  static makeTemplate({
    value = '',
    placeholder = '제목을 작성해 주세요!',
  }: InputProps) {
    return `
        <div class='input-container'>
            <label for="title">제목</label>
            <input id='title' class='title' type='text' placeholder='제목을 작성해 주세요!' value=${value} />
        </div>
    `
  }
}

export default CommonInput
