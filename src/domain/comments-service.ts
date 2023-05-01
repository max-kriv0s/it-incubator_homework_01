import { CommentUpdateModel } from "../models/comments/CommentUpdateModel"
import { CommentDBModel } from "../models/comments/CommentDBModel"
import { commentsRepository } from "../repositories/comments-repository"

export const commentsService = {

    async findCommentByID(id: string): Promise<CommentDBModel | null> {
        const comment = await commentsRepository.findCommentByID(id)
        return comment
    },

    async updatedComment(id: string, body: CommentUpdateModel): Promise<boolean> {
        return await commentsRepository.updatedComment(id, body)
    },

    async deleteCommentByID(id: string): Promise<boolean> {
        return await commentsRepository.deleteCommentByID(id)
    }
}