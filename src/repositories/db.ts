import { MongoClient } from "mongodb"
import { VideoViewModel } from "../models/videos/VideoViewModel"
import { BlogDbModel } from "../models/blogs/BlogDbModel"
import { PostDbModel } from "../models/posts/PostDbModel"
import { UserDBModel } from "../models/users/UserDBModel"
import { settings } from "../settings"
import { CommentDBModel } from "../models/comments/CommentDBModel"
import { SecurityDevicesDBModel } from "../models/devices/SecurityDevicesDBModel"

const MONGO_URI = settings.MONGO_URI

export const client = new MongoClient(MONGO_URI)
const db = client.db()

export const videosCollection = db.collection<VideoViewModel>('videos')
export const blogsCollection = db.collection<BlogDbModel>('blogs')
export const postsCollection = db.collection<PostDbModel>('posts')
export const usersCollection = db.collection<UserDBModel>('users')
export const commentsCollection = db.collection<CommentDBModel>('comments')
export const securityDevicesCollection = db.collection<SecurityDevicesDBModel>('securityDevices')

export const runDB = async () => {
    try {
        await client.connect()
        await db.command({ ping: 1 });
        console.log('Connect to successfully to server')
    } catch (e) {
        console.log('Don\'t connected successfully to server')
        await client.close()
    }
}