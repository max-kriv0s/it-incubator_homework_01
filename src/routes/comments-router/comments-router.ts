import { Router } from "express";
import { BearerAuthMiddleware } from "../../middlewares/BearerAuth-middleware";
import { CommentUserIDMiddleware, CommentValidate } from "../../middlewares/Comment-validate-middleware";
import { ErrorsValidate } from "../../middlewares/Errors-middleware";
import { container } from "../../composition-root";
import { LikeValidate } from "../../middlewares/Like-validate";
import { CommetsController } from "./comments-controller";


const commetsController = container.resolve(CommetsController)

export const commentsRouter = Router({})

commentsRouter.get('/:id', commetsController.findCommentByID.bind(commetsController))
commentsRouter.put('/:commentId', BearerAuthMiddleware, CommentValidate, ErrorsValidate, CommentUserIDMiddleware,
    commetsController.updatedComment.bind(commetsController)
)
commentsRouter.delete('/:commentId', BearerAuthMiddleware, CommentUserIDMiddleware,
    commetsController.deleteCommentByID.bind(commetsController)
)
commentsRouter.put('/:commentId/like-status', BearerAuthMiddleware, LikeValidate, ErrorsValidate,
    commetsController.likeStatusByCommentID.bind(commetsController)
)