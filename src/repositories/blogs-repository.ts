import { BlogUpdateModel } from "../models/blogs/BlogUpdateModel"
import { PaginatorBlogDbTypes } from "../types/PaginatorType"
import { BlogDbModel, BlogModel } from "../models/blogs/BlogModel"
import { ObjectId } from "mongodb"
import { BlogCreateModel } from "../models/blogs/BlogCreateModel"


export const blogsRepository = {
    async getBlogs(
        searchNameTerm: string | null,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string): Promise<PaginatorBlogDbTypes> {

        const filter: any = {}
        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' }
        }

        const totalCount: number = await BlogModel.countDocuments(filter)

        const skip = (pageNumber - 1) * pageSize
        const blogs: BlogDbModel[] = await BlogModel.find({filter}, null, 
            {
                sort: { [sortBy]: sortDirection === 'asc' ? 1 : -1 },
                skip: skip,
                limit: pageSize
            }).exec()

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: blogs
        }
    },

    async findBlogById(id: string): Promise<BlogDbModel | null> {
        const blog = await BlogModel.findById(id).exec()
        return blog
    },

    async createBlog(body: BlogCreateModel): Promise<BlogDbModel> {
        const newBlog: BlogDbModel = {
            _id: new ObjectId(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            isMembership: false,
            createdAt: new Date().toISOString()
        }

        const result = await BlogModel.create(newBlog)
        return result
    },

    async updateBlog(id: string, body: BlogUpdateModel): Promise<boolean> {
        const result = await BlogModel.updateOne({ id }, { body })
        return result.matchedCount === 1
    },

    async deleteBlogById(id: string): Promise<boolean> {
        const result = await BlogModel.deleteOne({ id })
        return result.deletedCount === 1
    },

    async deleteBlogs() {
        await BlogModel.deleteMany()
    }
}