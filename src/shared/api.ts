import { BASE_URL } from '../constants/index'
import {
  Post,
  PostPreview,
  postRequestModel,
  postsResponseModel,
} from '../types/index'

export const fetchUnsplashImage = async (apikey: string): Promise<any> => {
  return await fetch(
    `https://api.unsplash.com/photos/random/?client_id=${apikey}`,
  ).then((res) => {
    if (res.ok) {
      return res.json()
    } else throw new Error('Network has problems..... ☹️')
  })
}

const postService = {
  uploadPost: async (
    data: postRequestModel,
    callbackFunc: () => void,
  ): Promise<PostPreview> => {
    return await fetch(`${BASE_URL}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.ok) {
        callbackFunc()
        return res.json()
      } else throw new Error('Network has problems..... ☹️')
    })
  },

  getPosts: async (): Promise<postsResponseModel> => {
    return await fetch(`${BASE_URL}/posts`).then((res) => {
      if (res.ok) {
        return res.json()
      } else throw new Error('There is something wrong...')
    })
  },

  getPostById: async (postId: number): Promise<Post> => {
    return await fetch(`${BASE_URL}/post/${postId}`).then((res) => {
      if (res.ok) {
        return res.json()
      } else throw new Error('There is something wrong....')
    })
  },

  updatePost: async (
    postId: number,
    data: postRequestModel,
    callbackFunc: () => void,
  ): Promise<PostPreview> => {
    return await fetch(`${BASE_URL}/post/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.ok) {
        callbackFunc()
        return res.json()
      } else throw new Error('There is something wrong....')
    })
  },
}

export default postService
