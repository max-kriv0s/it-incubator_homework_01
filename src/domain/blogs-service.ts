import { BlogCreateModel } from "../models/blogs/BlogCreateModel"
import { BlogDbModel } from "../models/blogs/BlogDbModel"
import { BlogUpdateModel } from "../models/blogs/BlogUpdateModel"
import { BlogViewModel } from "../models/blogs/BlogViewModel"
import { blogsRepository } from "../repositories/blogs-repository"
import { PaginatorBlogDbTypes } from "../types/PaginatorType"
import { QueryParamsModels } from "../types/QueryParamsModels"
import { postsService } from "./posts-service"


export const blogsServise = {

    async getBlogs(queryParams: QueryParamsModels): Promise<PaginatorBlogDbTypes> {
        const searchNameTerm: string | null = queryParams.searchNameTerm ? queryParams.searchNameTerm : null
        const pageNumber: number = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize: number = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy: string = queryParams.sortBy ? queryParams.sortBy : 'createdAt'
        const sortDirection: string = queryParams.sortDirection ? queryParams.sortDirection : 'desc'

        const blogs =  await blogsRepository.getBlogs(
            searchNameTerm,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection)

        return blogs

    },

    async findBlogById(id: string): Promise<BlogViewModel | null> {
        
        const blog = await blogsRepository.findBlogById(id)
        if (!blog) return null
        
        return {
            id: blog.id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
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

    async findPostsByBlogId(blogId: string, queryParams: QueryParamsModels): Promise<PaginatorPostViewTypes | null> {
        const blog = await blogsRepository.findBlogById(blogId)
        if (!blog) return null    
        
        const posts = await postsService.findPostsByBlogId(blogId, queryParams)
        if (!posts) return null

        return {
            pagesCount: posts.pagesCount,
            page: posts.page,
            pageSize: posts.pageSize,
            totalCount: posts.totalCount,
            items: posts.items.map(i => ({
                id: i.id,
                title: i.title,
                shortDescription: i.shortDescription,
                content: i.content,
                blogId: i.blogId,
                blogName: i.blogName,
                createdAt: i.createdAt
            }))
        }
    },

    async createPostByBlogId(blogId: string, body: BlogPostCreateModel): Promise<PostViewModel | null> {
        const blog = await blogsRepository.findBlogById(blogId)
        if (!blog) return null    

        const createdPost = await postsService.createPostByBlogId(blogId, blog.name, body)

        return {
            id: createdPost.id,
            title: createdPost.title,
            shortDescription: createdPost.shortDescription,
            content: createdPost.content,
            blogId: createdPost.blogId,
            blogName: createdPost.blogName,
            createdAt: createdPost.createdAt
        }
    }
}