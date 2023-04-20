import { BlogUpdateModel } from "../models/blogs/BlogUpdateModel"
import { blogsCollection } from "./db"
import { PaginatorBlogDbTypes } from "../types.ts/PaginatorType"
import { BlogDbModel } from "../models/blogs/BlogDbModel"
import { ObjectId } from "mongodb"


export const blogsRepository = {
    async getBlogs(searchNameTerm: string | null, 
        pageNumber: number, 
        pageSize: number,
        sortBy: string,
        sortDirection: string): Promise<PaginatorBlogDbTypes> {
            
            const filter: any = {}
            if (searchNameTerm) {
                filter.name = { $regex: searchNameTerm }
            }
            
            const totalCount: number = await blogsCollection.countDocuments(filter)
            
            const skip = (pageNumber - 1) * pageSize
            const blogs: BlogDbModel[] = await blogsCollection.find(filter)
                .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
                .skip(skip)
                .limit(pageSize).toArray()

            return {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: blogs
            }
    },

    async findBlogById(id: string): Promise<BlogDbModel | null> {
        const blog:BlogDbModel | null = await blogsCollection.findOne({ _id: new ObjectId(id)})
        return blog
    },

    async createBlog(newBlog: BlogDbModel): Promise<BlogDbModel> {
        const result = await blogsCollection.insertOne(newBlog)
        return newBlog      
        
    },

    async updateBlog(id: string, body: BlogUpdateModel): Promise<boolean> {
        const result = await blogsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl
            }}
        )

        return result.matchedCount === 1
    },

    async deleteBlogById(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) })
        return result.deletedCount === 1
    }, 

    async deleteBlogs() {
        blogsCollection.deleteMany({})
    }
}