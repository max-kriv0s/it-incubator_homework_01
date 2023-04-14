import { PostCreateModel } from "../models/posts/PostCreateModel"
import { PostUpdateModel } from "../models/posts/PostUpdateModel"
import { PostViewModel } from "../models/posts/PostViewModel"
import { newStringId } from "../utils/utils"
import { blogsRepository } from "./blogs-repository"
import { postsCollection } from "./db"


export const postsRepository = {
    async getPosts(): Promise<PostViewModel[]> {
        return postsCollection.find({}, {projection: {'_id': 0}}).toArray()
    },

    async findPostById(id: string): Promise<PostViewModel | null> {
        const post:PostViewModel | null = await postsCollection.findOne({ id: id}, {projection: {'_id': 0}})
        return post
    },

    async createPost(body: PostCreateModel): Promise<PostViewModel> {
        const blog = await blogsRepository.findBlogById(body.blogId)
 
        const newPost: PostViewModel = {
            id: newStringId(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blog ? blog.name : ""
        }

        const result = await postsCollection.insertOne({...newPost})
        return newPost
    },

    async updatePost(id: string, body: PostUpdateModel): Promise<boolean> {
        const blog = await blogsRepository.findBlogById(body.blogId)

        const result = await postsCollection.updateOne(
            { id: id},
            { $set: {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId,
                blogName: blog ? blog.name : ""
            }}
        )

        return result.matchedCount === 1
    },
    async deletePostById(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({ id: id})
        return result.deletedCount === 1 
    },
    async deletePosts() {
        postsCollection.deleteMany({})
    }
}