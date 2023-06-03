import { ObjectId, WithId } from "mongodb"
import mongoose from "mongoose"

export class CommentDBModel {
    constructor(public _id: ObjectId,
        public content: string,
        public commentatorInfo: {
            userId: ObjectId
            userLogin: string
        },
        public createdAt: string,
        public postId: ObjectId
    ) { }
}

const CommentSchema = new mongoose.Schema<CommentDBModel>({
    content: { type: String, required: true },
    commentatorInfo: {
        userId: { type: ObjectId, required: true },
        userLogin: { type: String, required: true }
    },
    createdAt: { type: String, required: true },
    postId: { type: ObjectId, required: true }
})

export const CommentModel = mongoose.model<CommentDBModel>('comments', CommentSchema)