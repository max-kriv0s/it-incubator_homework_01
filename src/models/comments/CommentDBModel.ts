import { ObjectId } from "mongodb"
import { CommentCommentatorInfo } from "./CommentCommentatorInfoModel"

export type CommentDBModel = {
    _id: ObjectId
    content: string
    commentatorInfo: CommentCommentatorInfo
    createdAt: string
}