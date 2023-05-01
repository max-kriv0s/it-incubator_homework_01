import { Request, Response, Router } from "express";
import { URIParamsCommentIdModel, URIParamsIdModel, } from "../types/URIParamsModel";
import { StatusCodes } from "http-status-codes";
import { CommentViewModel } from "../models/comments/CommentViewModel";
import { commentsService } from "../domain/comments-service";
import { commentDBToCommentView } from "../utils/utils";
import { BearerAuthMiddleware } from "../middlewares/BearerAuth-middleware";
import { CommentUserIDMiddleware, CommentValidate } from "../middlewares/Comment-validate-middleware";
import { ErrorsValidate } from "../middlewares/Errors-middleware";
import { CommentInputModel } from "../models/comments/CommentInputModel";
import { RequestsWithParamsAndBody } from "../types/types";


export const commentsRouter = Router({})
commentsRouter
    .get('/:id',
    async (req: Request<URIParamsIdModel>, res: Response<CommentViewModel>) => {
        
        const commentDB = await commentsService.findCommentByID(req.params.id)
        if (commentDB) {
            const comment = commentDBToCommentView(commentDB)
            res.send(comment)
        } else {
            res.sendStatus(StatusCodes.NOT_FOUND)
        }
    })

    .put('/:commentId',
    BearerAuthMiddleware,
    CommentValidate,
    ErrorsValidate,
    CommentUserIDMiddleware,
    async (req: RequestsWithParamsAndBody<URIParamsCommentIdModel, CommentInputModel>, res: Response) => {
        
        const isUpdate = await commentsService.updatedComment(req.params.commentId, req.body)
        if (isUpdate) {
            res.sendStatus(StatusCodes.NO_CONTENT)
        } else {
            res.sendStatus(StatusCodes.NOT_FOUND)
        }
    })

    .delete('/:commentId',
    BearerAuthMiddleware,
    CommentUserIDMiddleware,
    async (req: Request<URIParamsCommentIdModel>, res: Response) => {
        
        const isDeleted = await commentsService.deleteCommentByID(req.params.commentId)
        if (isDeleted) {
            res.sendStatus(StatusCodes.NO_CONTENT)
        } else {
            res.sendStatus(StatusCodes.NOT_FOUND)
        }
    })