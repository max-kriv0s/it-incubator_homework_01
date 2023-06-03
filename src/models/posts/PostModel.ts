import { ObjectId, WithId } from "mongodb"
import mongoose from "mongoose"

export class PostDbModel {
    constructor(public _id: ObjectId,
                public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: ObjectId,
                public blogName: string,
                public createdAt: string,
    ) {}
}

const PostSchema = new mongoose.Schema<PostDbModel>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: ObjectId, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true}
})

export const PostModel = mongoose.model<PostDbModel>('posts', PostSchema)