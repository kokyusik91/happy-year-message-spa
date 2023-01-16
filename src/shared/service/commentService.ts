import { BASE_URL } from '../../constants/index'
import {
  Code,
  CommentResponseModel,
  CommentRequestModel,
} from '../../types/index'

import { fetchInstance } from './index'

const commentService = {
  uploadComment: async (
    postId: number,
    data: CommentRequestModel,
  ): Promise<CommentResponseModel> => {
    return await fetchInstance.post(`${BASE_URL}/comment/${postId}`, data)
  },

  deleteComment: async (commentId: number): Promise<Code> => {
    return await fetchInstance.delete(`${BASE_URL}/comment/${commentId}`)
  },
}

export default commentService
