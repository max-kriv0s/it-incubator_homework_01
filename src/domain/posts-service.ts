import { PostCreateModel } from "../models/posts/PostCreateModel"
import { PostUpdateModel } from "../models/posts/PostUpdateModel"
import { PostViewModel } from "../models/posts/PostViewModel"
import { postsRepository } from "../repositories/posts-repository"
import { blogsServise } from "./blogs-service"
import { QueryParamsModels } from "../types.ts/QueryParamsModels"
import { BlogPostCreateModel } from "../models/blogs/BlogPostCreateModel"
import { PaginatorPostViewTypes } from "../types.ts/PaginatorType"

export const postsService = {

    async getPosts(queryParams: QueryParamsModels): Promise<PaginatorPostViewTypes> {
        const pageNumber:number = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize: number = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy:string = queryParams.sortBy ? queryParams.sortBy : 'createdAt'
        const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc' 
        
        const posts = await postsRepository.getPosts( 
            pageNumber, 
            pageSize,
            sortBy,
            sortDirection)

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
    
    async findPostById(id: string): Promise<PostViewModel | null> {
        const post = await postsRepository.findPostById(id)
        if (!post) return null
        
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        }
    },

    async findPostsByBlogId(blogId: string, queryParams: QueryParamsModels): Promise<PaginatorPostViewTypes | null> {
        const pageNumber:number = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize: number = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy:string = queryParams.sortBy ? queryParams.sortBy : 'createdAt'
        const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc'

        const posts = await postsRepository.findPostsByBlogId(blogId, pageNumber, pageSize, sortBy, sortDirection)
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

    async createPost(body: PostCreateModel): Promise<PostViewModel> {
        const blog = await blogsServise.findBlogById(body.blogId)
        const blogName: string = blog ? blog.name : ""

        const createdPost = await postsRepository.createPost(body, blogName)

        return {
            id: createdPost.id,
            title: createdPost.title,
            shortDescription: createdPost.shortDescription,
            content: createdPost.content,
            blogId: createdPost.blogId,
            blogName: createdPost.blogName,
            createdAt: createdPost.createdAt
        }

    },

    async createPostByBlogId(blogId: string, blogName: string, body: BlogPostCreateModel): Promise<PostViewModel> {

        const createdPost = await postsRepository.createPostByBlogId(blogId, blogName, body)
        return {
            id: createdPost.id,
            title: createdPost.title,
            shortDescription: createdPost.shortDescription,
            content: createdPost.content,
            blogId: createdPost.blogId,
            blogName: createdPost.blogName,
            createdAt: createdPost.createdAt
        }
    },

    async updatePost(id: string, body: PostUpdateModel): Promise<boolean> {
        const blog = await blogsServise.findBlogById(body.blogId)
        if (!blog) return false

        const blogName = blog ? blog.name : ""
        return await postsRepository.updatePost(id, body, blog.id, blogName)
    },

    async deletePostById(id: string): Promise<boolean> {
        return await postsRepository.deletePostById(id)
    }
}