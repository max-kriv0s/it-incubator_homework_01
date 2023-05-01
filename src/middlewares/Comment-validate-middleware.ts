import { Request, Response, NextFunction } from "express";
import { commentsService } from "../domain/comments-service";
import { URIParamsCommentIdModel } from "../types/URIParamsIdModel";
import { StatusCodes } from "http-status-codes";
import { body } from "express-validator";

export const CommentUserIDMiddleware = async (req: Request<URIParamsCommentIdModel>, res: Response, next: NextFunction) => {
    const comment = await commentsService.findCommentByID(req.params.commentId)
    if (!comment) {
        res.sendStatus(StatusCodes.NOT_FOUND)
        return
    } else if (comment.commentatorInfo.userId !== req.userId) {
        res.sendStatus(StatusCodes.FORBIDDEN)
        return
    }
    
    next()
}

export const CommentValidate = [
    body('content')
        .trim()
        .exists({ checkFalsy: true })
        .isString()
        .isLength({ min: 20, max: 300 })
        .withMessage('must be between 6 and 20 characters')
    
]