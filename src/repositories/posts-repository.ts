import { ObjectId } from "mongodb"
import { PostDbModel } from "../models/posts/PostDbModel"
import { PostUpdateModel } from "../models/posts/PostUpdateModel"
import { PaginatorPostDbTypes } from "../types.ts/PaginatorType"
import { postsCollection } from "./db"


export const postsRepository = {
    async getPosts(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string): Promise<PaginatorPostDbTypes> { 
        
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
            items: posts
        }
    },

    async findPostById(id: string): Promise<PostDbModel | null> {
        const post: PostDbModel | null = await postsCollection.findOne({ _id: new ObjectId(id) })
        return post
    },

    async createPost(newPost: PostDbModel): Promise<PostDbModel> {
        const result = await postsCollection.insertOne(newPost)
        return newPost
    },

    async updatePost(id: string, body: PostUpdateModel, blogId: string, blogName: string): Promise<boolean> {
        const result = await postsCollection.updateOne(
            { _id: new ObjectId(id) },
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
        const result = await postsCollection.deleteOne({ _id: new ObjectId(id) })
        return result.deletedCount === 1
    },

    async deletePosts() {
        postsCollection.deleteMany({})
    }
}