import { BlogUpdateModel } from "../../models/blogs/BlogUpdateModel"
import { BlogDbModel, BlogModel } from "../../models/blogs/BlogModel"
import { ObjectId } from "mongodb"
import { BlogCreateModel } from "../../models/blogs/BlogCreateModel"
import { validID } from "../db"


export class BlogsRepository {

    async findBlogById(id: string): Promise<BlogDbModel | null> {
        if (!validID(id)) return null
        
        return BlogModel.findById(id)
    }

    async createBlog(body: BlogCreateModel): Promise<BlogDbModel> {
        const newBlog: BlogDbModel = {
            _id: new ObjectId(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            isMembership: false,
            createdAt: new Date().toISOString()
        }

        return BlogModel.create(newBlog)
    }

    async updateBlog(id: string, body: BlogUpdateModel): Promise<boolean> {
        if (!validID(id)) return false

        const result = await BlogModel.updateOne({ _id: id }, {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        })
        return result.matchedCount === 1
    }

    async deleteBlogById(id: string): Promise<boolean> {
        if (!validID(id)) return false 
        
        const result = await BlogModel.deleteOne({ _id: id })
        return result.deletedCount === 1
    }

    async deleteBlogs() {
        await BlogModel.deleteMany()
    }
}