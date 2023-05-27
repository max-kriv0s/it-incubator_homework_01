import { WithId } from "mongodb"
import mongoose from "mongoose"

export type BlogDbModel = WithId<{
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}>

const BlogSchema = new mongoose.Schema<BlogDbModel>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true},
    isMembership: {type: Boolean, default: false}
})

export const BlogModel = mongoose.model<BlogDbModel>('blogs', BlogSchema)