import { CommentatorInfo } from "./CommentsCommentatorInfoModel"

export type CommentsViewModel = {
    _id: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
}