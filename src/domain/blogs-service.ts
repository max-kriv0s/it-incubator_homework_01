import { ObjectId } from "mongodb"
import { BlogDbModel } from "../models/blogs/BlogDbModel"
import { BlogViewModel } from "../models/blogs/BlogViewModel"
import { blogsRepository } from "../repositories/blogs-repository"
import { PaginatorBlogDbTypes, PaginatorBlogViewTypes } from "../types.ts/PaginatorType"
import { QueryParamsModels } from "../types.ts/QueryParamsModels"
import { BlogCreateModel } from "../models/blogs/BlogCreateModel"
import { BlogUpdateModel } from "../models/blogs/BlogUpdateModel"


export const blogsServise = {

    async getBlogs(queryParams: QueryParamsModels): Promise<PaginatorBlogViewTypes> {
        const searchNameTerm: string | null = queryParams.searchNameTerm ?? null
        const pageNumber: number = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize: number = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy: string = queryParams.sortBy ? queryParams.sortBy : 'createdAt'
        const sortDirection: string = queryParams.sortDirection ? queryParams.sortDirection : 'desc'

        const blogsDb: PaginatorBlogDbTypes = await blogsRepository.getBlogs(
            searchNameTerm,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection)

        return {
            pagesCount: blogsDb.pagesCount,
            page: blogsDb.page,
            pageSize: blogsDb.pageSize,
            totalCount: blogsDb.totalCount,
            items: blogsDb.items.map(i => ({
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
        const blogDb = await blogsRepository.findBlogById(id)
        if (!blogDb) return null

        return {
            id: blogDb._id.toString(),
            name: blogDb.name,
            description: blogDb.description,
            websiteUrl: blogDb.websiteUrl,
            createdAt: blogDb.createdAt,
            isMembership: blogDb.isMembership
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

        const createdBlog = await blogsRepository.createBlog(newBlog)

        return {
            id: createdBlog._id.toString(),
            name: createdBlog.name,
            description: createdBlog.description,
            websiteUrl: createdBlog.websiteUrl,
            createdAt: createdBlog.createdAt,
            isMembership: createdBlog.isMembership
        }
    },

    async updateBlog(id: string, body: BlogUpdateModel): Promise<boolean> {
        return await blogsRepository.updateBlog(id, body)
    },

    async deleteBlogById(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlogById(id)
    },


}