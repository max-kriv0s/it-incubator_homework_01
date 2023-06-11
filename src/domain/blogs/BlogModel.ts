import { ObjectId, WithId } from "mongodb"
import mongoose from "mongoose"

export class BlogDbModel {
    constructor(public _id: ObjectId,
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: string,
        public isMembership: boolean
    ) { }
}

const BlogSchema = new mongoose.Schema<BlogDbModel>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, default: false }
})

export const BlogModel = mongoose.model<BlogDbModel>('blogs', BlogSchema)