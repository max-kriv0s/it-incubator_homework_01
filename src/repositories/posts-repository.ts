import { ObjectId } from "mongodb"
import { PostDbModel, PostModel } from "../models/posts/PostModel"
import { PostUpdateModel } from "../models/posts/PostUpdateModel"
import { PostCreateModel } from "../models/posts/PostCreateModel"
import { BlogPostCreateModel } from "../models/blogs/BlogPostCreateModel"
import { PaginatorPostDbTypes } from "../types/PaginatorType"
import { validID } from "./db"


export const postsRepository = {
    async getPosts(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string): Promise<PaginatorPostDbTypes> {

        const totalCount: number = await PostModel.countDocuments({})

        const skip = (pageNumber - 1) * pageSize
        const posts: PostDbModel[] = await PostModel.find({}, null, 
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
            items: posts
        }
    },

    async findPostById(id: string): Promise<PostDbModel | null> {
        if (!validID(id)) return null

        try {
            const post = await PostModel.findById(id)
            return post
            
        } catch (error) {
            return null
        }
    },

    async findPostsByBlogId(
        blogId: string,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string): Promise<PaginatorPostDbTypes | null> {

        if (!validID(blogId)) return null

        const totalCount: number = await PostModel.countDocuments({ blogId })

        const skip = (pageNumber - 1) * pageSize
        const posts: PostDbModel[] = await PostModel.find({blogId}, null, 
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
            items: posts
        }
    },

    async createPostInDB(newPost: PostDbModel): Promise<PostDbModel> {
        const result = await PostModel.create(newPost)
        return result
    },

    async createPost(body: PostCreateModel, blogName: string): Promise<PostDbModel> {

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

    async createPostByBlogId(blogId: string, blogName: string, body: BlogPostCreateModel): Promise<PostDbModel> {

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

    async updatePost(id: string, body: PostUpdateModel, blogId: ObjectId, blogName: string): Promise<boolean> {
        if (!validID(id)) return false

        const result = await PostModel.updateOne(
            { _id: id },
            {
                $set: {
                    title: body.title,
                    shortDescription: body.shortDescription,
                    content: body.content,
                    blogId: blogId,
                    blogName: blogName
                }
            }
        )

        return result.matchedCount === 1
    },

    async deletePostById(id: string): Promise<boolean> {
        if (!validID(id)) return false

        const result = await PostModel.deleteOne({ _id: id })
        return result.deletedCount === 1
    },

    async deletePosts() {
        await PostModel.deleteMany({})
    }
}