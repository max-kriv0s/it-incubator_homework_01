import { ObjectId } from "mongodb"
import { PostCreateModel } from "../models/posts/PostCreateModel"
import { PostDbModel } from "../models/posts/PostDbModel"
import { PostUpdateModel } from "../models/posts/PostUpdateModel"
import { PostViewModel } from "../models/posts/PostViewModel"
import { postsRepository } from "../repositories/posts-repository"
import { blogsServise } from "./blogs-service"
import { PaginatorPostDbTypes, PaginatorPostViewTypes, } from "../types.ts/PaginatorType"
import { QueryParamsModels } from "../types.ts/QueryParamsModels"

export const postsService = {

    async getPosts(queryParams: QueryParamsModels): Promise<PaginatorPostViewTypes> {
        const pageNumber:number = +queryParams.pageNumber ?? 1
        const pageSize: number = +queryParams.pageSize ?? 10
        const sortBy:string = queryParams.sortBy ?? 'createdAt'
        const sortDirection: string = queryParams.sortDirection ?? 'desc' 
        
        const postsDb: PaginatorPostDbTypes = await postsRepository.getPosts( 
            pageNumber, 
            pageSize,
            sortBy,
            sortDirection)
        
        return {
            pagesCount: postsDb.pagesCount,
            page: postsDb.page,
            pageSize: postsDb.pageSize,
            totalCount: postsDb.totalCount,
            items: postsDb.items.map(i => ({
                id: i._id.toString(),
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
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt   
        }
    },

    async createPost(body: PostCreateModel): Promise<PostViewModel> {
        const blog = await blogsServise.findBlogById(body.blogId)
 
        const newPost: PostDbModel = {
            _id: new ObjectId(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blog ? blog.name : "",
            createdAt: new Date().toISOString()
        }

        const createdPost = await postsRepository.createPost(newPost)
        return {
            id: createdPost._id.toString(),
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
    },

}