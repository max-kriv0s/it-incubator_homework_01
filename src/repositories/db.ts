import { MongoClient } from "mongodb"
import { VideoViewModel } from "../models/videos/VideoViewModel"
import { BlogDbModel } from "../models/blogs/BlogDbModel"
import { PostDbModel } from "../models/posts/PostDbModel"

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/"

export const client = new MongoClient(MONGO_URI)
const db = client.db()

export const videosCollection = db.collection<VideoViewModel>('videos')
export const blogsCollection = db.collection<BlogDbModel>('blogs')
export const postsCollection = db.collection<PostDbModel>('posts')

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