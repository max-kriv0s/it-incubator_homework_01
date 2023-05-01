import { Router, Request, Response } from "express"
import { PostViewModel } from "../models/posts/PostViewModel"
import { PostCreateModel } from "../models/posts/PostCreateModel"
import { BasicAuthValidate } from "../middlewares/BasicAuth-validation-middleware"
import { RequestsQuery, RequestsWithBody, RequestsWithParamsAndBody } from "../types/types"
import { ErrorsValidate } from "../middlewares/Errors-middleware"
import { PostValidate } from "../middlewares/Post-validation-middleware"
import { StatusCodes } from "http-status-codes"
import { URIParamsIdModel, URIParamsPostIdCommentsModel } from "../types/URIParamsModel"
import { PostUpdateModel } from "../models/posts/PostUpdateModel"
import { postsService } from "../domain/posts-service"
import { BlogIdValidate } from "../middlewares/Blog-validation-middleware"
import { QueryParamsModels } from "../types/QueryParamsModels"
import { PaginatorCommentViewModel, PaginatorPostViewTypes } from "../types/PaginatorType"
import { postDBToPostView } from "../utils/utils"


export const routerPosts = Router()

routerPosts
    .get('/',
        async (req: RequestsQuery<QueryParamsModels>, res: Response<PaginatorPostViewTypes>) => {
            const posts = await postsService.getPosts(req.query)
            res.send({
                pagesCount: posts.pagesCount,
                page: posts.page,
                pageSize: posts.pageSize,
                totalCount: posts.totalCount,
                items: posts.items.map(i => postDBToPostView(i))
            })
        })

    .post('/',
        BasicAuthValidate,
        PostValidate,
        BlogIdValidate,
        ErrorsValidate,
        async (req: RequestsWithBody<PostCreateModel>, res: Response<PostViewModel>) => {
            const postDB = await postsService.createPost(req.body)
            const post = postDBToPostView(postDB)
            res.status(StatusCodes.CREATED).send(post)

        })

    .get('/:id',
        async (req: Request<URIParamsIdModel>, res: Response<PostViewModel>) => {
            const postDB = await postsService.findPostById(req.params.id)
            if (postDB) {
                const post = postDBToPostView(postDB)
                res.send(post)
            } else {
                res.sendStatus(StatusCodes.NOT_FOUND)
            }
        })

    .put('/:id',
        BasicAuthValidate,
        PostValidate,
        BlogIdValidate,
        ErrorsValidate,
        async (req: RequestsWithParamsAndBody<URIParamsIdModel, PostUpdateModel>, res: Response) => {
            const isUpdate = await postsService.updatePost(req.params.id, req.body)
            if (isUpdate) {
                res.sendStatus(StatusCodes.NO_CONTENT)
            } else {
                res.sendStatus(StatusCodes.NOT_FOUND)
            }
        })

    .delete('/:id',
        BasicAuthValidate,
        async (req: Request<URIParamsIdModel>, res: Response) => {
            const isDeleted = await postsService.deletePostById(req.params.id)
            if (isDeleted) {
                res.sendStatus(StatusCodes.NO_CONTENT)
            } else {
                res.sendStatus(StatusCodes.NOT_FOUND)
            }
        })

    .get('/:postId/comments',
        async (req: Request<URIParamsPostIdCommentsModel>, res: Response<PaginatorCommentViewModel>) => {

        })
