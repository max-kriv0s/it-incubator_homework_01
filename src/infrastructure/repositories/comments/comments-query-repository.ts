import { ObjectId } from "mongodb"
import { validID } from "../db"
import { injectable } from "inversify"
import { QueryParamsModels } from "../../../types/QueryParamsModels"
import { PaginatorCommentViewModel } from "../../../types/PaginatorType"
import { CommentDBModel, CommentModel } from "../../../domain/comments/CommentModel"
import { CommentViewModel } from "../../../domain/comments/CommentViewModel"
import { LikeModel, LikeStatus } from "../../../domain/likes/LikeModel"


@injectable()
export class CommentsQueryRepository {

    async findCommentsByPostId(postId: string, queryParams: QueryParamsModels, userId: string | undefined): Promise<PaginatorCommentViewModel | null> {

        if (!validID(postId)) return null

        const pageNumber: number = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize: number = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy: string = queryParams.sortBy ? queryParams.sortBy : 'createdAt'
        const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc'

        const totalCount: number = await CommentModel.countDocuments({ postId: postId })

        const skip = (pageNumber - 1) * pageSize
        const commentsDB = await CommentModel.find({ postId }, null,
            {
                sort: { [sortBy]: sortDirection === 'asc' ? 1 : -1 },
                skip: skip,
                limit: pageSize
            }
        ).exec()

        const user = null
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: await Promise.all(commentsDB.map(comment => this.commentDBToCommentView(comment, userId)))
        }
    }

    async getCommentViewById(id: string | ObjectId, userId?: string): Promise<CommentViewModel | null> {
        if (typeof id === 'string' && !validID(id)) return null

        const commentDB = await CommentModel.findById(id)
        if (!commentDB) return null

        return await this.commentDBToCommentView(commentDB, userId)
    }

    async commentDBToCommentView(comment: CommentDBModel, userId?: string): Promise<CommentViewModel> {
        let statusMyLike = LikeStatus.None

        if (userId && validID(userId)) {
            // тут лучше через репозиторий или напрямую через LikeModel? Точно через модель
            const myLike = await LikeModel.findOne({ commentId: comment._id, userId: userId}).exec()
            if (myLike) statusMyLike = myLike.status
        }

        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId.toString(),
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: comment.likesCount,
                dislikesCount: comment.dislikesCount,
                myStatus: statusMyLike
            }
        }
    }
}