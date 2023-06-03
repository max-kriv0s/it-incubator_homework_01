import { Request, Response } from 'express'
import { PostsService } from "../../domain/posts-service";
import { PostsQueryRepository } from "../../repositories/posts/posts-query-repository";
import { RequestsQuery, RequestsWithBody, RequestsWithParamsAndBody, RequestsWithParamsAndQuery } from '../../types/types';
import { QueryParamsModels } from '../../types/QueryParamsModels';
import { PaginatorCommentViewModel, PaginatorPostViewTypes } from '../../types/PaginatorType';
import { PostCreateModel } from '../../models/posts/PostCreateModel';
import { PostViewModel } from '../../models/posts/PostViewModel';
import { StatusCodes } from 'http-status-codes';
import { URIParamsIdModel, URIParamsPostIdCommentsModel } from '../../types/URIParamsModel';
import { PostUpdateModel } from '../../models/posts/PostUpdateModel';
import { CommentsQueryRepository } from '../../repositories/comments-repository/comments-query-repository';
import { CommentInputModel } from '../../models/comments/CommentInputModel';
import { CommentViewModel } from '../../models/comments/CommentViewModel';

export class PostsController {
    constructor(protected postsService: PostsService,
                protected postsQueryRepository: PostsQueryRepository,
                protected commentsQueryRepository: CommentsQueryRepository
    ) {}

    async getPostsView(req: RequestsQuery<QueryParamsModels>, res: Response<PaginatorPostViewTypes>) {
        try {
            const posts = await this.postsQueryRepository.getPostsView(req.query)
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
    
            const post = await this.postsQueryRepository.getPostViewById(postDB._id)
            if (!post) return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)

            return res.status(StatusCodes.CREATED).send(post)
        } catch (error) {
            console.error(error)
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR) 
        }
    }

    async getPostViewById(req: Request<URIParamsIdModel>, res: Response<PostViewModel>) {
        try {
            const post = await this.postsQueryRepository.getPostViewById(req.params.id)
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

                const comments = await this.commentsQueryRepository.findCommentsByPostId(req.params.postId, req.query)
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
                    
                const comment = await this.commentsQueryRepository.getCommentViewById(commentDB._id)
                if (!comment) return res.sendStatus(StatusCodes.NOT_FOUND)

                res.status(StatusCodes.CREATED).send(comment)
            } catch (error) {
                console.error(error)
                res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
            }
    }
}