import { BASE_URL } from '../../constants/index'
import { Code, CommentResponseModel } from '../../types/index'

const commentService = {
  uploadComment: async (
    postId: number,
    data: any,
  ): Promise<CommentResponseModel> => {
    return await fetch(`${BASE_URL}/comment/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.ok) {
        return res.json()
      } else throw new Error('Something is wrong.....')
    })
  },

  deleteComment: async (commentId: number): Promise<Code> => {
    return await fetch(`${BASE_URL}/comment/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
    }).then((res) => {
      if (res.ok) {
        return res.json()
      } else throw new Error('Something is wrong...')
    })
  },
}

export default commentService
