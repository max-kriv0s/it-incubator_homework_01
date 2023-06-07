import { Router } from "express";
import { BearerAuthMiddleware } from "../../middlewares/BearerAuth-middleware";
import { CommentUserIDMiddleware, CommentValidate, CommentsBearerMiddleware } from "../../middlewares/Comment-validate-middleware";
import { ErrorsValidate } from "../../middlewares/Errors-middleware";
import { commetsController } from "../../composition-root";
import { LikeValidate } from "../../middlewares/Like-validate";


export const commentsRouter = Router({})

commentsRouter.get('/:id', CommentsBearerMiddleware, commetsController.findCommentByID.bind(commetsController))
commentsRouter.put('/:commentId', BearerAuthMiddleware, CommentValidate, ErrorsValidate, CommentUserIDMiddleware,
    commetsController.updatedComment.bind(commetsController)
)
commentsRouter.delete('/:commentId', BearerAuthMiddleware, CommentUserIDMiddleware,
    commetsController.deleteCommentByID.bind(commetsController)
)
commentsRouter.put('/:commentId/like-status', BearerAuthMiddleware, LikeValidate, ErrorsValidate,
    commetsController.likeStatusByCommentID.bind(commetsController)
)