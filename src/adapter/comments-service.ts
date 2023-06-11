import { inject, injectable } from "inversify"
import { LikeClass, LikeStatus } from "../domain/likes/LikeModel"
import { CommentsRepository } from "../infrastructure/repositories/comments/comments-repository"
import { LikeRepository } from "../infrastructure/repositories/likes/likes-repository"
import { UsersRepository } from "../infrastructure/repositories/users/users-repository"
import { MyResult, ResultCode } from "../types/types"
import { getMyResult } from "../utils/utils"
import { CommentDBModel } from "../domain/comments/CommentModel"
import { CommentInputModel } from "../domain/comments/CommentInputModel"


@injectable()
export class CommentsService {
    constructor(
        @inject(CommentsRepository) protected commentsRepository: CommentsRepository,
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(LikeRepository) protected likeRepository: LikeRepository
    ) { }

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

    async likeStatusByCommentID(commentId: string, userId: string, likeStatus: LikeStatus): Promise<MyResult<LikeClass>> {
        const comment = await this.commentsRepository.findCommentByID(commentId)
        if (!comment) return getMyResult<LikeClass>(ResultCode.notFound)

        // const status = LikeStatus[likeStatus as keyof typeof LikeStatus]
        const status = likeStatus

        const likeResult = await this.likeRepository.findLike(commentId, userId)

        if (likeResult.code === ResultCode.notFound) {
            return this.createLikeByCommentID(commentId, userId, status)
        } else if (likeResult.code === ResultCode.success) {
            return this.updateLikeByCommentID(commentId, userId, status, likeResult.data!)
        }

        return getMyResult<LikeClass>(ResultCode.notFound)
    }

    private async createLikeByCommentID(commentId: string, userId: string, status: LikeStatus): Promise<MyResult<LikeClass>> {
        if (status === LikeStatus.None) return getMyResult<LikeClass>(ResultCode.success)

        // сделать через swich case
        // try {
        if (status === LikeStatus.Like) {
            await this.commentsRepository.incrementLikeOnComment(commentId, 1)
        } else if (status === LikeStatus.Dislike) {
            await this.commentsRepository.incrementDislikeOnComment(commentId, 1)
        } else {
            return getMyResult<LikeClass>(ResultCode.notFound)
        }

        return this.likeRepository.createLike(commentId, userId, status)

        // } catch (error) {
        //     console.error(error)
        //     return getMyResult<LikeClass>(ResultCode.ServerError)
        // }
    }

    private async updateLikeByCommentID(commentId: string, userId: string, status: LikeStatus, like: LikeClass): Promise<MyResult<LikeClass>> {
        // like status === new status
        if (status === like.status) return getMyResult<LikeClass>(ResultCode.success)

        // сделать через swich case
        // условия сделать переменными
        // try {
        if (status === LikeStatus.None) {
            if (like.status === LikeStatus.Like) {
                // like status = Like, new status None
                await this.commentsRepository.incrementLikeOnComment(commentId, -1)
            } else if (like.status === LikeStatus.Dislike) {
                // like status = Dislike, new status None
                await this.commentsRepository.incrementDislikeOnComment(commentId, -1)
            } else {
                return getMyResult<LikeClass>(ResultCode.notFound)
            }

            // обновлять на статус None
            return this.likeRepository.updateLike(like._id, LikeStatus.None)
        }

        if (like.status === LikeStatus.Like && status === LikeStatus.Dislike) {
            // like status = Like, new status Dislike
            await this.commentsRepository.incrementLikeOnComment(commentId, -1)
            await this.commentsRepository.incrementDislikeOnComment(commentId, 1)

        } else if (like.status === LikeStatus.Dislike && status === LikeStatus.Like) {
            // like status = Dislike, new status Like
            await this.commentsRepository.incrementDislikeOnComment(commentId, -1)
            await this.commentsRepository.incrementLikeOnComment(commentId, 1)

        } else {
            return getMyResult<LikeClass>(ResultCode.notFound)
        }

        return this.likeRepository.updateLike(like._id, status)

        // } catch (error) {
        //     console.error(error)
        //     return getMyResult<LikeClass>(ResultCode.ServerError)
        // }
    }
}