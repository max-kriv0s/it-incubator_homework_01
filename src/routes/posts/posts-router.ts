import { Router } from "express"
import { BasicAuthValidate } from "../../middlewares/BasicAuth-validation-middleware"
import { ErrorsValidate } from "../../middlewares/Errors-middleware"
import { PostValidate } from "../../middlewares/Post-validation-middleware"
import { BlogIdValidate } from "../../middlewares/Blog-validation-middleware"
import { CommentValidate } from "../../middlewares/Comment-validate-middleware"
import { BearerAuthMiddleware } from "../../middlewares/BearerAuth-middleware"
import { container } from "../../composition-root"
import { PostsController } from "./posts-controller"
import { LikeValidate } from "../../middlewares/Like-validate"


const postsController = container.resolve(PostsController)

export const routerPosts = Router()

routerPosts
    .get('/', postsController.getPostsView.bind(postsController))

    .post('/', BasicAuthValidate, PostValidate, BlogIdValidate, ErrorsValidate,
        postsController.createPost.bind(postsController))

    .get('/:id', postsController.getPostViewById.bind(postsController))

    .put('/:id', BasicAuthValidate, PostValidate, BlogIdValidate, ErrorsValidate,
        postsController.updatePost.bind(postsController))

    .delete('/:id', BasicAuthValidate, postsController.deletePost.bind(postsController))

    .get('/:postId/comments', postsController.findCommentsByPostId.bind(postsController))

    .post('/:postId/comments', BearerAuthMiddleware, CommentValidate, ErrorsValidate,
        postsController.createCommentByPostID.bind(postsController))

    .put('/:postId/like-status', BearerAuthMiddleware, LikeValidate, ErrorsValidate,
        postsController.likeStatusByPostId.bind(postsController))

