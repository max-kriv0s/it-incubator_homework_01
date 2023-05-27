import { ObjectId, WithId } from "mongodb"

export type BlogDbModel = WithId<{
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}>