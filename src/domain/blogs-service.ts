import { BlogCreateModel } from "../models/blogs/BlogCreateModel"
import { BlogDbModel } from "../models/blogs/BlogModel"
import { BlogPostCreateModel } from "../models/blogs/BlogPostCreateModel"
import { BlogUpdateModel } from "../models/blogs/BlogUpdateModel"
import { PostDbModel } from "../models/posts/PostModel"
import { blogsRepository } from "../repositories/blogs-repository"
import { PaginatorBlogDbTypes, PaginatorPostDbTypes } from "../types/PaginatorType"
import { QueryParamsModels } from "../types/QueryParamsModels"
import { postsService } from "./posts-service"


export const blogsService = {

    async getBlogs(queryParams: QueryParamsModels): Promise<PaginatorBlogDbTypes> {
        const searchNameTerm: string | null = queryParams.searchNameTerm ? queryParams.searchNameTerm : null
        const pageNumber: number = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize: number = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy: string = queryParams.sortBy ? queryParams.sortBy : 'createdAt'
        const sortDirection: string = queryParams.sortDirection ? queryParams.sortDirection : 'desc'

        const blogs = await blogsRepository.getBlogs(
            searchNameTerm,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection)

        return blogs

    },

    async findBlogById(id: string): Promise<BlogDbModel | null> {
        const blog = await blogsRepository.findBlogById(id)
        return blog
    },

    async createBlog(body: BlogCreateModel): Promise<BlogDbModel> {
        const newBlog = await blogsRepository.createBlog(body)
        return newBlog
    },

    async updateBlog(id: string, body: BlogUpdateModel): Promise<boolean> {
        return await blogsRepository.updateBlog(id, body)
    },

    async deleteBlogById(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlogById(id)
    },

    async findPostsByBlogId(blogId: string, queryParams: QueryParamsModels): Promise<PaginatorPostDbTypes | null> {
        const blog = await blogsRepository.findBlogById(blogId)
        if (!blog) return null

        const posts = await postsService.findPostsByBlogId(blogId, queryParams)
        return posts
    },

    async createPostByBlogId(blogId: string, body: BlogPostCreateModel): Promise<PostDbModel | null> {
        const blog = await blogsRepository.findBlogById(blogId)
        if (!blog) return null

        const createdPost = await postsService.createPostByBlogId(blogId, blog.name, body)
        return createdPost
    }
}