import { ObjectId } from "mongodb"
import mongoose from "mongoose"

export class CommentDBModel {
    constructor(public _id: ObjectId,
        public content: string,
        public commentatorInfo: {
            userId: ObjectId
            userLogin: string
        },
        public createdAt: string,
        public postId: ObjectId,
        public likesCount: number,
        public dislikesCount: number
    ) { }
}

const CommentSchema = new mongoose.Schema<CommentDBModel>({
    content: { type: String, required: true },
    commentatorInfo: {
        userId: { type: ObjectId, required: true },
        userLogin: { type: String, required: true }
    },
    createdAt: { type: String, required: true },
    postId: { type: ObjectId, required: true },
    likesCount: {type: Number, default: 0},
    dislikesCount: {type: Number, default: 0},
})

export const CommentModel = mongoose.model<CommentDBModel>('comments', CommentSchema)