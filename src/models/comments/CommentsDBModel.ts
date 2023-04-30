import { CommentatorInfo } from "./CommentsCommentatorInfoModel"

export type CommentsDBModel = {
    _id: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
}