import { ObjectId } from "mongodb"

export type CommentDBModel = {
    _id: ObjectId
    content: string
    commentatorInfo: {
        userId: ObjectId
        userLogin: string
    }
    createdAt: string,
    postId: ObjectId
}