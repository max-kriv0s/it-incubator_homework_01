import { Request, Response } from 'express'
import { CommentsService } from "../../domain/comments-service";
import { URIParamsCommentIdModel, URIParamsIdModel } from "../../types/URIParamsModel";
import { CommentViewModel } from '../../models/comments/CommentViewModel';
import { CommentsQueryRepository } from '../../repositories/comments/comments-query-repository';
import { StatusCodes } from 'http-status-codes';
import { RequestsWithParamsAndBody, ResultCode } from '../../types/types';
import { CommentInputModel } from '../../models/comments/CommentInputModel';
import { LikeInputModel, LikeStatus } from '../../models/likes/LikeModel';

export class CommetsController {
    constructor(protected commentsService: CommentsService,
                protected commentsQueryRepository: CommentsQueryRepository
    ) {}

    async findCommentByID(req: Request<URIParamsIdModel>, res: Response<CommentViewModel>) {
        try {
            const commentDB = await this.commentsService.findCommentByID(req.params.id)
            if (!commentDB) return res.sendStatus(StatusCodes.NOT_FOUND)

            const userId = req.userId

            const comment = await this.commentsQueryRepository.getCommentViewById(commentDB._id, userId)
            if(!comment) return res.sendStatus(StatusCodes.NOT_FOUND)

            res.send(comment)
        } catch (error) {
            console.error(error)
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async updatedComment(req: RequestsWithParamsAndBody<URIParamsCommentIdModel, CommentInputModel>, res: Response) {
        try {
            const isUpdate = await this.commentsService.updatedComment(req.params.commentId, req.body)
            if (!isUpdate) return res.sendStatus(StatusCodes.NOT_FOUND)
            
            return res.sendStatus(StatusCodes.NO_CONTENT)
        } catch (error) {
            console.error(error)
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async deleteCommentByID(req: Request<URIParamsCommentIdModel>, res: Response) {
        try {
            const isDeleted = await this.commentsService.deleteCommentByID(req.params.commentId)
            if (!isDeleted) return res.sendStatus(StatusCodes.NOT_FOUND)
                
            return res.sendStatus(StatusCodes.NO_CONTENT)
        } catch (error) {
            console.error(error)
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async likeStatusByCommentID(req: RequestsWithParamsAndBody<URIParamsCommentIdModel, LikeInputModel>, res: Response) {
        try {
            const userId = req.userId
            if (!userId) res.sendStatus(StatusCodes.UNAUTHORIZED)

            const result = await this.commentsService.likeStatusByCommentID(req.params.commentId, userId!, req.body.likeStatus)
            if (result.code === ResultCode.success) return res.sendStatus(StatusCodes.NO_CONTENT)
            
            return res.sendStatus(StatusCodes.NOT_FOUND)

        } catch (error) {
            console.error(error)
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }
}