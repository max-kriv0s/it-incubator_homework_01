import { CommentCommentatorInfo } from "./CommentCommentatorInfoModel"

export type CommentViewModel = {
    id: string
    content: string
    commentatorInfo: CommentCommentatorInfo
    createdAt: string
}