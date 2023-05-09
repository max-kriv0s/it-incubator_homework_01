import { CommentInputModel } from "../models/comments/CommentInputModel"
import { CommentDBModel } from "../models/comments/CommentDBModel"
import { commentsRepository } from "../repositories/comments-repository"
import { QueryParamsModels } from "../types/QueryParamsModels"
import { PaginatorCommentDBModel } from "../types/PaginatorType"
import { usersService } from "./users-service"

export const commentsService = {

    async findCommentByID(id: string): Promise<CommentDBModel | null> {
        const comment = await commentsRepository.findCommentByID(id)
        return comment
    },

    async updatedComment(id: string, body: CommentInputModel): Promise<boolean> {
        return await commentsRepository.updatedComment(id, body)
    },

    async deleteCommentByID(id: string): Promise<boolean> {
        return await commentsRepository.deleteCommentByID(id)
    },

    async findCommentsByPostId(postId: string, queryParams: QueryParamsModels): Promise<PaginatorCommentDBModel | null> {
        const pageNumber: number = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize: number = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy: string = queryParams.sortBy ? queryParams.sortBy : 'createdAt'
        const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc'

        const comments = await commentsRepository.findCommentsByPostId(postId, pageNumber, pageSize, sortBy, sortDirection)
        return comments
    },

    async createCommentByPostId(postId: string, userId: string, body: CommentInputModel): Promise<CommentDBModel | null> {
        const user = await usersService.findUserById(userId)
        if (!user) return null

        const comment = await commentsRepository.createCommentByPostId(postId, userId, user.accountData.login, body)
        return comment
    }
}