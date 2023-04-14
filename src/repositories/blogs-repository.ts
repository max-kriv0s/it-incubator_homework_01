import { BlogCreateModel } from "../models/blogs/BlogCreateModel"
import { BlogViewModel } from "../models/blogs/BlogViewModel"
import { BlogUpdateModel } from "../models/blogs/BlogUpdateModel"
import { newStringId } from "../utils/utils"
import { blogsCollection } from "./db"


export const blogsRepository = {
    async getBlogs(): Promise<BlogViewModel[]> {
        return blogsCollection.find({}, {projection: {'_id': 0}}).toArray()
    },

    async findBlogById(id: string): Promise<BlogViewModel | null> {
        const blog:BlogViewModel | null = await blogsCollection.findOne({ id: id}, {projection: {'_id': 0}})
        return blog
    },

    async createBlog(body: BlogCreateModel): Promise<BlogViewModel> {
        const newBlog: BlogViewModel = {
            id: newStringId(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            isMembership: false,
            createdAt: new Date().toISOString()
        }

        const result = await blogsCollection.insertOne({...newBlog})
        return newBlog
    },

    async updateBlog(id: string, body: BlogUpdateModel): Promise<boolean> {
        const result = await blogsCollection.updateOne(
            { id: id},
            { $set: {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl
            }}
        )

        return result.matchedCount === 1
    },

    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({ id: id})
        return result.deletedCount === 1
    }, 
    async deleteBlogs() {
        blogsCollection.deleteMany({})
    }
}