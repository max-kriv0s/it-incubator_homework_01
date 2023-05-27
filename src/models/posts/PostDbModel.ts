import { ObjectId, WithId } from "mongodb"

export type PostDbModel = WithId<{
    title: string
    shortDescription: string
    content: string
    blogId: ObjectId
    blogName: string
    createdAt: string
}>