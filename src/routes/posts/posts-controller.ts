import { Request, Response } from 'express'
import { PostsService } from "../../adapter/posts-service";
import { PostsQueryRepository } from "../../infrastructure/repositories/posts/posts-query-repository";
import { RequestsQuery, RequestsWithBody, RequestsWithParamsAndBody, RequestsWithParamsAndQuery, ResultCode } from '../../types/types';
import { QueryParamsModels } from '../../types/QueryParamsModels';
import { PaginatorCommentViewModel, PaginatorPostViewTypes } from '../../types/PaginatorType';
import { PostCreateModel } from '../../domain/posts/PostCreateModel';
import { PostViewModel } from '../../domain/posts/PostViewModel';
import { StatusCodes } from 'http-status-codes';
import { URIParamsIdModel, URIParamsPostIdCommentsModel, URIParamsPostIdModel } from '../../types/URIParamsModel';
import { PostUpdateModel } from '../../domain/posts/PostUpdateModel';
import { CommentsQueryRepository } from '../../infrastructure/repositories/comments/comments-query-repository';
import { inject, injectable } from 'inversify';
import { CommentInputModel } from '../../domain/comments/CommentInputModel';
import { CommentViewModel } from '../../domain/comments/CommentViewModel';
import { LikeInputModel } from '../../domain/likes/LikeModel';


@injectable()
export class PostsController {
    constructor(
        @inject(PostsService) protected postsService: PostsService,
        @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
        @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository
    ) { }

    async getPostsView(req: RequestsQuery<QueryParamsModels>, res: Response<PaginatorPostViewTypes>) {
        try {
            const posts = await this.postsQueryRepository.getPostsView(req.query, req.userId)
            return res.send(posts)
        } catch (error) {
            console.error(error)
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }

    }

    async createPost(req: RequestsWithBody<PostCreateModel>, res: Response<PostViewModel>) {
        try {
            const postDB = await this.postsService.createPost(req.body)
            if (!postDB) return res.sendStatus(StatusCodes.BAD_REQUEST)

            const post = await this.postsQueryRepository.getPostViewById(postDB._id, req.userId)
            if (!post) return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)

            return res.status(StatusCodes.CREATED).send(post)
        } catch (error) {
            console.error(error)
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async getPostViewById(req: Request<URIParamsIdModel>, res: Response<PostViewModel>) {
        try {
            const post = await this.postsQueryRepository.getPostViewById(req.params.id, req.userId)
            if (!post) return res.sendStatus(StatusCodes.NOT_FOUND)

            return res.send(post)
        } catch (error) {
            console.error(error)
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async updatePost(req: RequestsWithParamsAndBody<URIParamsIdModel, PostUpdateModel>, res: Response) {
        try {
            const isUpdate = await this.postsService.updatePost(req.params.id, req.body)
            if (!isUpdate) return res.sendStatus(StatusCodes.NOT_FOUND)

            return res.sendStatus(StatusCodes.NO_CONTENT)
        } catch (error) {
            console.error(error)
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async deletePost(req: Request<URIParamsIdModel>, res: Response) {
        try {
            const isDeleted = await this.postsService.deletePostById(req.params.id)
            if (!isDeleted) return res.sendStatus(StatusCodes.NOT_FOUND)

            return res.sendStatus(StatusCodes.NO_CONTENT)
        } catch (error) {
            console.error(error)
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async findCommentsByPostId(req: RequestsWithParamsAndQuery<URIParamsPostIdCommentsModel, QueryParamsModels>,
        res: Response<PaginatorCommentViewModel>) {

        try {
            const post = await this.postsService.findPostById(req.params.postId)
            if (!post) return res.sendStatus(StatusCodes.NOT_FOUND)

            const userId = req.userId

            const comments = await this.commentsQueryRepository.findCommentsByPostId(req.params.postId, req.query, userId)
            if (!comments) return res.sendStatus(StatusCodes.NOT_FOUND)

            return res.send(comments)
        } catch (error) {
            console.error(error)
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async createCommentByPostID(req: RequestsWithParamsAndBody<URIParamsPostIdCommentsModel, CommentInputModel>,
        res: Response<CommentViewModel>) {

        try {
            const commentDB = await this.postsService.createCommentByPostID(req.params.postId, req.userId!, req.body)
            if (!commentDB) return res.sendStatus(StatusCodes.NOT_FOUND)

            const comment = await this.commentsQueryRepository.getCommentViewById(commentDB._id, req.userId!)
            if (!comment) return res.sendStatus(StatusCodes.NOT_FOUND)

            res.status(StatusCodes.CREATED).send(comment)
        } catch (error) {
            console.error(error)
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async likeStatusByPostId(req: RequestsWithParamsAndBody<URIParamsPostIdModel, LikeInputModel>, res: Response) {
        try {
            const userId = req.userId
            if (!userId) res.sendStatus(StatusCodes.UNAUTHORIZED)

            const result = await this.postsService.likeStatusByPostID(req.params.postId, userId!, req.body.likeStatus)
            if (result.code === ResultCode.success) return res.sendStatus(StatusCodes.NO_CONTENT)

            return res.sendStatus(StatusCodes.NOT_FOUND)

        } catch (error) {
            console.error(error)
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }
}