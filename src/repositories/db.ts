import { MongoClient } from "mongodb"
import { VideoViewModel } from "../models/videos/VideoViewModel"
import { BlogViewModel } from "../models/blogs/BlogViewModel"
import { PostViewModel } from "../models/posts/PostViewModel"

const MONGO_URI = process.env.MONGO_URI
if (!MONGO_URI) {
    throw new Error('Don\'t found url')
}

const client = new MongoClient(MONGO_URI)

export const videoCollection = client.db().collection<VideoViewModel>('videos')
export const blogsCollection = client.db().collection<BlogViewModel>('blogs')
export const postCollection = client.db().collection<PostViewModel>('posts')

export const runDB = async () => {
    try {
        await client.connect()
        console.log('Connect to successfully to server')
    } catch (e) {
        console.log('Don\'t connected successfully to server')
        await client.close()
    }
}