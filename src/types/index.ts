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
    posts: PostPreview[]
  }
}

export type PostPreview = {
  postId: string
  title: string
  content: string
  image: string
  createdAt: string
  updatedAt: string
}

export type Post = {
  code: number
  data: {
    post: PostPreview
    comments: Comment[]
  }
}

export type Comment = {
  commentId: string
  postId: string
  content: string
}

export interface Page {
  makeTemplate: () => string
  render: () => void
}
