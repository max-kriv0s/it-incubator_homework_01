import { Request, Response, NextFunction } from "express";
import { URIParamsCommentIdModel } from "../types/URIParamsModel";
import { StatusCodes } from "http-status-codes";
import { body } from "express-validator";
import { container } from "../composition-root";
import { jwtService } from "../application/jwt-service";
import { CommentsService } from "../adapter/comments-service";


const commentsService = container.resolve(CommentsService)

export const CommentUserIDMiddleware = async (req: Request<URIParamsCommentIdModel>, res: Response, next: NextFunction) => {
    const comment = await commentsService.findCommentByID(req.params.commentId)
    if (!comment) {
        res.sendStatus(StatusCodes.NOT_FOUND)
        return
    } else if (comment.commentatorInfo.userId.toString() !== req.userId) {
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
        .withMessage('must be between 20 and 300 characters')
    
]