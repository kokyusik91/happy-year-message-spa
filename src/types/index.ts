export type Route = {
  path: string
  page: any
}

export type TargetPage = {
  route: Route
  result: RegExpMatchArray | null
}

export type ParamObj = {
  [k: string]: string | undefined
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

export type CommentResponseModel = {
  code: number
  data: Comment
}

export interface Page {
  makePageTemplate: () => string
  render: () => void
}

export type Code = Pick<CommentResponseModel, 'code'>

export type CommentRequestModel = Pick<Comment, 'content'>

export type ExtraImageInfo = {
  imageDesc: string
  downloads: number
  likes: number
  views: number
}
