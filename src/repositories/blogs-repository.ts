import { BlogUpdateModel } from "../models/blogs/BlogUpdateModel"
import { blogsCollection } from "./db"
import { PaginatorBlogViewTypes } from "../types.ts/PaginatorType"
import { BlogDbModel } from "../models/blogs/BlogDbModel"
import { ObjectId } from "mongodb"
import { BlogCreateModel } from "../models/blogs/BlogCreateModel"
import { BlogViewModel } from "../models/blogs/BlogViewModel"


export const blogsRepository = {
    async getBlogs(
        searchNameTerm: string | null, 
        pageNumber: number, 
        pageSize: number,
        sortBy: string,
        sortDirection: string): Promise<PaginatorBlogViewTypes> {
            
            const filter: any = {}
            if (searchNameTerm) {
                filter.name = { $regex: searchNameTerm,  $options: 'i'}
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
                items: blogs.map(i => ({
                    id: i._id.toString(),
                    name: i.name,
                    description: i.description,
                    websiteUrl: i.websiteUrl,
                    createdAt: i.createdAt,
                    isMembership: i.isMembership
                }))
            }
    },

    async findBlogById(id: string): Promise<BlogViewModel | null> {
        if (!ObjectId.isValid(id)) return null
        
        const blog:BlogDbModel | null = await blogsCollection.findOne({ _id: new ObjectId(id)})
        if (!blog) return null
       
        return {
            ...blog,
            id: blog._id.toString()
        }     
    },

    async createBlog(body: BlogCreateModel): Promise<BlogViewModel> {
        const newBlog: BlogDbModel = {
            _id: new ObjectId(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            isMembership: false,
            createdAt: new Date().toISOString()
        }
        
        const result = await blogsCollection.insertOne(newBlog)

        return {
            ...newBlog,
            id: newBlog._id.toString()
        }    
    },

    async updateBlog(id: string, body: BlogUpdateModel): Promise<boolean> {
        if (!ObjectId.isValid(id)) return false
        
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
        if (!ObjectId.isValid(id)) return false
        
        const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) })
        return result.deletedCount === 1
    }, 

    async deleteBlogs() {
        blogsCollection.deleteMany({})
    }
}