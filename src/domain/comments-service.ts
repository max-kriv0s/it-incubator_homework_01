import { CommentInputModel } from "../models/comments/CommentInputModel"
import { CommentDBModel } from "../models/comments/CommentModel"
import { CommentsRepository } from "../repositories/comments-repository/comments-repository"
import { UsersRepository } from "../repositories/users/users-repository"

export class CommentsService {
    constructor(protected commentsRepository: CommentsRepository,
                protected usersRepository: UsersRepository
    ) {}

    async findCommentByID(id: string): Promise<CommentDBModel | null> {
        return this.commentsRepository.findCommentByID(id)
    }

    async updatedComment(id: string, body: CommentInputModel): Promise<boolean> {
        return this.commentsRepository.updatedComment(id, body)
    }

    async deleteCommentByID(id: string): Promise<boolean> {
        return this.commentsRepository.deleteCommentByID(id)
    }

    async createCommentByPostId(postId: string, userId: string, body: CommentInputModel): Promise<CommentDBModel | null> {
        const user = await this.usersRepository.findUserById(userId)
        if (!user) return null

        return this.commentsRepository.createCommentByPostId(postId, userId, user.accountData.login, body)
    }
}