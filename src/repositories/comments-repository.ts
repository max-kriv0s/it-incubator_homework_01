import { ObjectId } from "mongodb";
import { CommentDBModel } from "../models/comments/CommentDBModel";
import { commentsCollection, usersCollection } from "./db";
import { CommentInputModel } from "../models/comments/CommentInputModel";
import { PaginatorCommentDBModel } from "../types/PaginatorType";

export const commentsRepository = {

    async findCommentByID(id: string): Promise<CommentDBModel | null> {
        if (!ObjectId.isValid(id)) return null

        const comment = commentsCollection.findOne({ _id: new ObjectId(id) })
        return comment
    }, 

    async updatedComment(id: string, body: CommentInputModel): Promise<boolean> {
        if (!ObjectId.isValid(id)) return false

        const result = await commentsCollection.updateOne(
            { _id: new ObjectId(id) }, 
            {$set: 
                {content: body.content}
            }
        )

        return result.matchedCount === 1
    },

    async deleteCommentByID(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) return false

        const result = await commentsCollection.deleteOne({ _id: new ObjectId(id) })
        return result.deletedCount === 1
    },

    async deleteComments() {
        await usersCollection.deleteMany({})
    },
    
    async findCommentsByPostId(
        postId: string,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string): Promise<PaginatorCommentDBModel | null> {

            if (!ObjectId.isValid(postId)) return null

            const totalCount: number = await commentsCollection.countDocuments({ postId: new ObjectId(postId) })

            const skip = (pageNumber - 1) * pageSize
            const comments = await commentsCollection.find({ postId: new ObjectId(postId) })
                .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
                .skip(skip)
                .limit(pageSize).toArray()
    
            return {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: comments
            }           
    },

    async createCommentByPostId(postId: string, userId: string, userLogin: string, body: CommentInputModel): Promise<CommentDBModel> {

        const newCommetn: CommentDBModel = {
            _id: new ObjectId(),
            content: body.content,
            commentatorInfo: {
                userId: new ObjectId(userId),
                userLogin: userLogin
            },
            createdAt: new Date().toISOString(),
            postId: new ObjectId(postId)
        } 

        const result = await commentsCollection.insertOne(newCommetn)
        return newCommetn
    }
}