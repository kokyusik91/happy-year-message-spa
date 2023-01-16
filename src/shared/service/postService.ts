import { BASE_URL } from '../../constants/index'
import {
  Code,
  Post,
  PostPreview,
  postRequestModel,
  postsResponseModel,
} from '../../types/index'

import { fetchInstance } from './index'

export const fetchUnsplashImage = async (apikey: string): Promise<any> => {
  return await fetchInstance.get(
    `https://api.unsplash.com/photos/random/?client_id=${apikey}`,
  )
}

const postService = {
  uploadPost: async (
    data: postRequestModel,
    callbackFunc: () => void,
  ): Promise<PostPreview> => {
    return await fetchInstance.post(`${BASE_URL}/post`, data, callbackFunc)
  },

  getPosts: async (): Promise<postsResponseModel> => {
    return await fetchInstance.get(`${BASE_URL}/posts`)
  },

  getPostById: async (postId: number): Promise<Post> => {
    return await fetchInstance.get(`${BASE_URL}/post/${postId}`)
  },

  updatePost: async (
    postId: number,
    data: postRequestModel,
    callbackFunc: () => void,
  ): Promise<PostPreview> => {
    return await fetchInstance.patch(
      `${BASE_URL}/post/${postId}`,
      data,
      callbackFunc,
    )
  },

  deletePost: async (
    postId: number,
    callbackFunc: () => void,
  ): Promise<Code> => {
    return await fetchInstance.delete(
      `${BASE_URL}/post/${postId}`,
      callbackFunc,
    )
  },
}

export default postService
