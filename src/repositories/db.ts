import mongoose from 'mongoose'
import { MongoClient, ObjectId } from "mongodb"
import { VideoViewModel } from "../models/videos/VideoViewModel"
import { BlogDbModel } from "../models/blogs/BlogDbModel"
import { PostDbModel } from "../models/posts/PostDbModel"
import { UserDBModel } from "../models/users/UserDBModel"
import { settings } from "../settings"
import { CommentDBModel } from "../models/comments/CommentDBModel"
import { SecurityDevicesDBModel } from "../models/security-devices/SecurityDevicesDBModel"
import { APICallsModel } from "../models/APICallsModel"


const MONGO_URI = settings.MONGO_URI
const DB_NAME = settings.DB_NAME

// videos

// blogs
export const BlogSchema = new mongoose.Schema<BlogDbModel>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true},
    isMembership: {type: Boolean, default: false}
})

export const BlogModel = mongoose.model<BlogDbModel>('blogs', BlogSchema)




export const client = new MongoClient(MONGO_URI)
const db = client.db()

export const videosCollection = db.collection<VideoViewModel>('videos')
// export const blogsCollection = db.collection<BlogDbModel>('blogs')
export const postsCollection = db.collection<PostDbModel>('posts')
export const usersCollection = db.collection<UserDBModel>('users')
export const commentsCollection = db.collection<CommentDBModel>('comments')
export const securityDevicesCollection = db.collection<SecurityDevicesDBModel>('securityDevices')
export const apiCallsCollection = db.collection<APICallsModel>('apiCalls') 

export const runDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {dbName: DB_NAME})

        await client.connect()
        await db.command({ ping: 1 });
        console.log('Connect to successfully to server')
    } catch (e) {
        console.log('Don\'t connected successfully to server')
        await client.close()
        await mongoose.disconnect()
    }
}

export function validID(id: string): boolean {
    return ObjectId.isValid(id)
}

export function getIdDB(id: string): ObjectId | null {
    if (!id) return new ObjectId()

    if (!validID(id)) return null

    return new ObjectId(id)
}