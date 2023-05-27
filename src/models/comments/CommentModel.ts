import { ObjectId, WithId } from "mongodb"
import mongoose from "mongoose"

export type CommentDBModel = WithId<{
    content: string
    commentatorInfo: {
        userId: ObjectId
        userLogin: string
    }
    createdAt: string,
    postId: ObjectId
}>

const CommentSchema = new mongoose.Schema<CommentDBModel>({
    content: {type: String, required: true},
    commentatorInfo: {
        userId: {type: ObjectId, required: true},
        userLogin: {type: String, required: true}
    },
    createdAt: {type: String, required: true},
    postId: {type: ObjectId, required: true}
})

export const CommentModel = mongoose.model<CommentDBModel>('comments', CommentSchema)