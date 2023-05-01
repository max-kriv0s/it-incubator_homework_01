import { CommentCommentatorInfo } from "./CommentCommentatorInfoModel"

export type CommentsViewModel = {
    id: string
    content: string
    commentatorInfo: CommentCommentatorInfo
    createdAt: string
}