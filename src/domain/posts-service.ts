import { PostCreateModel } from "../models/posts/PostCreateModel"
import { PostUpdateModel } from "../models/posts/PostUpdateModel"
import { postsRepository } from "../repositories/posts-repository"
import { blogsService } from "./blogs-service"
import { QueryParamsModels } from "../types/QueryParamsModels"
import { BlogPostCreateModel } from "../models/blogs/BlogPostCreateModel"
import { PaginatorPostDbTypes } from "../types/PaginatorType"
import { PostDbModel } from "../models/posts/PostDbModel"

export const postsService = {

    async getPosts(queryParams: QueryParamsModels): Promise<PaginatorPostDbTypes> {
        const pageNumber: number = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize: number = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy: string = queryParams.sortBy ? queryParams.sortBy : 'createdAt'
        const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc'

        const posts = await postsRepository.getPosts(
            pageNumber,
            pageSize,
            sortBy,
            sortDirection)

        return posts
    },

    async findPostById(id: string): Promise<PostDbModel | null> {
        const post = await postsRepository.findPostById(id)
        return post
    },

    async findPostsByBlogId(blogId: string, queryParams: QueryParamsModels): Promise<PaginatorPostDbTypes | null> {
        const pageNumber: number = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize: number = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy: string = queryParams.sortBy ? queryParams.sortBy : 'createdAt'
        const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc'

        const posts = await postsRepository.findPostsByBlogId(blogId, pageNumber, pageSize, sortBy, sortDirection)
        if (!posts) return null

        return posts
    },

    async createPost(body: PostCreateModel): Promise<PostDbModel> {
        const blog = await blogsService.findBlogById(body.blogId)
        const blogName: string = blog ? blog.name : ""

        const createdPost = await postsRepository.createPost(body, blogName)
        return createdPost

    },

    async createPostByBlogId(blogId: string, blogName: string, body: BlogPostCreateModel): Promise<PostDbModel> {
        const createdPost = await postsRepository.createPostByBlogId(blogId, blogName, body)
        return createdPost
    },

    async updatePost(id: string, body: PostUpdateModel): Promise<boolean> {
        const blog = await blogsService.findBlogById(body.blogId)
        if (!blog) return false

        const blogName = blog ? blog.name : ""
        return await postsRepository.updatePost(id, body, blog._id, blogName)
    },

    async deletePostById(id: string): Promise<boolean> {
        return await postsRepository.deletePostById(id)
    }
}