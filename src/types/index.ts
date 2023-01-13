export type Route = {
  path: string
  page: any
}

export type Replace = {
  replace: boolean
}

export type postRequestModel = {
  title: string
  content: string
  image: string
}

export type postsResponseModel = {
  code: number
  data: {
    posts: Post[]
  }
}

export type Post = {
  postId: number
  title: string
  content: string
  image: string
  createdAt: string
  updatedAt: string
}
