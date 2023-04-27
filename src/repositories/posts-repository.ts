import { ObjectId } from "mongodb"
import { PostDbModel } from "../models/posts/PostDbModel"
import { PostUpdateModel } from "../models/posts/PostUpdateModel"
import { postsCollection } from "./db"
import { PostViewModel } from "../models/posts/PostViewModel"
import { PostCreateModel } from "../models/posts/PostCreateModel"
import { BlogPostCreateModel } from "../models/blogs/BlogPostCreateModel"
import { PaginatorPostViewTypes } from "../types/PaginatorType"


export const postsRepository = {
    async getPosts(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string): Promise<PaginatorPostViewTypes> { 
        
        const totalCount: number = await postsCollection.countDocuments({})
        
        const skip = (pageNumber - 1) * pageSize
        const posts: PostDbModel[] = await postsCollection.find({})
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })    
            .skip(skip)
            .limit(pageSize).toArray()

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: posts.map(i => ({
                id: i._id.toString(),
                title: i.title,
                shortDescription: i.shortDescription,
                content: i.content,
                blogId: i.blogId.toString(),
                blogName: i.blogName,
                createdAt: i.createdAt
            }))
        }
    },

    async findPostById(id: string): Promise<PostViewModel | null> {
        
        if (!ObjectId.isValid(id)) return null

        const post = await postsCollection.findOne({ _id: new ObjectId(id) })
        if (!post) return null

        const {_id, ...findPost} = post
        return {
            ...findPost,
            id: _id.toString(),
            blogId: findPost.blogId.toString()
        }
    },

    async findPostsByBlogId(
        blogId: string,        
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string): Promise<PaginatorPostViewTypes | null> {
            
            if (!ObjectId.isValid(blogId)) return null

            const totalCount: number = await postsCollection.countDocuments({ blogId: new ObjectId(blogId)})
        
            const skip = (pageNumber - 1) * pageSize
            const posts: PostDbModel[] = await postsCollection.find({ blogId: new ObjectId(blogId) })
                .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })    
                .skip(skip)
                .limit(pageSize).toArray()
    
            return {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: posts.map(i => ({
                    id: i._id.toString(),
                    title: i.title,
                    shortDescription: i.shortDescription,
                    content: i.content,
                    blogId: i.blogId.toString(),
                    blogName: i.blogName,
                    createdAt: i.createdAt
                }))
            }
    },

    async createPostInDB(newPost: PostDbModel): Promise<PostViewModel> {

        const result = await postsCollection.insertOne(newPost)
        
        const {_id, ...createdPost} = newPost
        return {
            ...createdPost,
            id: _id.toString(),
            blogId: createdPost.blogId.toString(),
        }
    },

    async createPost(body: PostCreateModel, blogName: string): Promise<PostViewModel> {
        
        const newPost: PostDbModel = {
            _id: new ObjectId(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: new ObjectId(body.blogId),
            blogName: blogName,
            createdAt: new Date().toISOString()
        } 
        
        return await this.createPostInDB(newPost)
    },

    async createPostByBlogId(blogId: string, blogName: string, body: BlogPostCreateModel): Promise<PostViewModel> {
        
        const newPost: PostDbModel = {
            _id: new ObjectId(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: new ObjectId(blogId),
            blogName: blogName,
            createdAt: new Date().toISOString()
        }

        return await this.createPostInDB(newPost)
    },

    async updatePost(id: string, body: PostUpdateModel, blogId: string, blogName: string): Promise<boolean> {
        
        if (!ObjectId.isValid(id)) return false

        const result = await postsCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    title: body.title,
                    shortDescription: body.shortDescription,
                    content: body.content,
                    blogId: new ObjectId(blogId),
                    blogName: blogName
                }
            }
        )

        return result.matchedCount === 1
    },

    async deletePostById(id: string): Promise<boolean> {
        
        if (!ObjectId.isValid(id)) return false

        const result = await postsCollection.deleteOne({ _id: new ObjectId(id) })
        return result.deletedCount === 1
    },

    async deletePosts() {
        postsCollection.deleteMany({})
    }
}