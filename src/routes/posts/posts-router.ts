import { Router } from "express"
import { BasicAuthValidate } from "../../middlewares/BasicAuth-validation-middleware"
import { ErrorsValidate } from "../../middlewares/Errors-middleware"
import { PostValidate } from "../../middlewares/Post-validation-middleware"
import { BlogIdValidate } from "../../middlewares/Blog-validation-middleware"
import { CommentValidate, CommentsBearerMiddleware } from "../../middlewares/Comment-validate-middleware"
import { BearerAuthMiddleware } from "../../middlewares/BearerAuth-middleware"
import { postsController } from "../../composition-root"


export const routerPosts = Router()

routerPosts.get('/', postsController.getPostsView.bind(postsController))
routerPosts.post('/', BasicAuthValidate, PostValidate, BlogIdValidate, ErrorsValidate, 
    postsController.createPost.bind(postsController)
)
routerPosts.get('/:id', postsController.getPostViewById.bind(postsController))
routerPosts.put('/:id', BasicAuthValidate, PostValidate, BlogIdValidate, ErrorsValidate,
    postsController.updatePost.bind(postsController)
)
routerPosts.delete('/:id', BasicAuthValidate, postsController.deletePost.bind(postsController))
routerPosts.get('/:postId/comments', CommentsBearerMiddleware, postsController.findCommentsByPostId.bind(postsController))
routerPosts.post('/:postId/comments', BearerAuthMiddleware, CommentValidate, ErrorsValidate,
    postsController.createCommentByPostID.bind(postsController)
)
