import { ObjectId } from "mongodb";
import { CommentDBModel, CommentModel } from "../models/comments/CommentModel";
import { CommentInputModel } from "../models/comments/CommentInputModel";
import { PaginatorCommentDBModel } from "../types/PaginatorType";
import { validID } from "./db";

export const commentsRepository = {

    async findCommentByID(id: string): Promise<CommentDBModel | null> {
        if (!validID(id)) return null
        
        try {
            const comment = CommentModel.findById(id).exec()
            return comment
            
        } catch (error) {
            return null
        }
    }, 

    async updatedComment(id: string, body: CommentInputModel): Promise<boolean> {
        if (!validID(id)) return false

        try {
            const result = await CommentModel.updateOne(
                { _id: id}, 
                {content: body.content}
            )
    
            return result.matchedCount === 1
            
        } catch (error) {
            return false
        }
    },

    async deleteCommentByID(id: string): Promise<boolean> {
        if (!validID(id)) return false
        
        try {
            const result = await CommentModel.deleteOne({ _id: id })
            return result.deletedCount === 1
            
        } catch (error) {
            return false
        }
    },

    async deleteComments() {
        await CommentModel.deleteMany({})
    },
    
    async findCommentsByPostId(
        postId: string,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string): Promise<PaginatorCommentDBModel | null> {

            if (!validID(postId)) return null

            try {
                const totalCount: number = await CommentModel.countDocuments({ postId: postId })
    
                const skip = (pageNumber - 1) * pageSize
                const comments = await CommentModel.find({ postId }, null, 
                    {
                        sort: { [sortBy]: sortDirection === 'asc' ? 1 : -1 },
                        skip: skip,
                        limit: pageSize
                    }
                ).exec()
        
                return {
                    pagesCount: Math.ceil(totalCount / pageSize),
                    page: pageNumber,
                    pageSize: pageSize,
                    totalCount: totalCount,
                    items: comments
                }           
                
            } catch (error) {
                return null
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

        const result = await CommentModel.create(newCommetn)
        return newCommetn
    }
}