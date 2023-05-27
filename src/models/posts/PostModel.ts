import { ObjectId, WithId } from "mongodb"
import mongoose from "mongoose"

export type PostDbModel = WithId<{
    title: string
    shortDescription: string
    content: string
    blogId: ObjectId
    blogName: string
    createdAt: string
}>

const PostSchema = new mongoose.Schema<PostDbModel>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: ObjectId, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true}
})

export const PostModel = mongoose.model<PostDbModel>('posts', PostSchema)