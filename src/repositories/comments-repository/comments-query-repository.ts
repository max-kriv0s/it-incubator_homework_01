import { ObjectId } from "mongodb"
import { CommentDBModel, CommentModel } from "../../models/comments/CommentModel"
import { CommentViewModel } from "../../models/comments/CommentViewModel"
import { PaginatorCommentDBModel, PaginatorCommentViewModel } from "../../types/PaginatorType"
import { QueryParamsModels } from "../../types/QueryParamsModels"
import { validID } from "../db"

export class CommentsQueryRepository {

    async findCommentsByPostId(postId: string, queryParams: QueryParamsModels): Promise<PaginatorCommentViewModel | null> {

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

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: commentsDB.map(comment => this.commentDBToCommentView(comment))
        }
    }

    async getCommentViewById(id: string | ObjectId): Promise<CommentViewModel | null> {
        if (typeof id === 'string' && !validID(id)) return null

        const commentDB = await CommentModel.findById(id)
        if (!commentDB) return null

        return this.commentDBToCommentView(commentDB)
    }

    commentDBToCommentView(comment: CommentDBModel): CommentViewModel {
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId.toString(),
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt
        }
    }
}