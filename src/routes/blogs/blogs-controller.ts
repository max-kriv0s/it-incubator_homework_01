import { Request, Response } from 'express'
import { BlogsService } from "../../adapter/blogs-service";
import { PaginatorBlogViewTypes, PaginatorPostViewTypes } from "../../types/PaginatorType";
import { QueryParamsModels } from "../../types/QueryParamsModels";
import { RequestsQuery, RequestsWithBody, RequestsWithParamsAndBody, RequestsWithParamsAndQuery } from "../../types/types";
import { BlogsQueryRepository } from '../../infrastructure/repositories/blogs/blogs-query-repository';
import { BlogCreateModel } from '../../domain/blogs/BlogCreateModel';
import { BlogViewModel } from '../../domain/blogs/BlogViewModel';
import { StatusCodes } from 'http-status-codes';
import { URIParamsIdModel } from '../../types/URIParamsModel';
import { BlogPostCreateModel } from '../../domain/blogs/BlogPostCreateModel';
import { PostViewModel } from '../../domain/posts/PostViewModel';
import { PostsQueryRepository } from '../../infrastructure/repositories/posts/posts-query-repository';
import { BlogUpdateModel } from '../../domain/blogs/BlogUpdateModel';
import { inject, injectable } from 'inversify';


@injectable()
export class BlogsController {
    constructor(
        @inject(BlogsService) protected blogsService: BlogsService,
        @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
        @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository
    ) { }

    async getBlogsView(req: RequestsQuery<QueryParamsModels>, res: Response<PaginatorBlogViewTypes>) {
        try {
            const blogs = await this.blogsQueryRepository.getBlogsView(req.query)
            return res.send(blogs)
        } catch (error) {
            console.error(error)
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async createBlog(req: RequestsWithBody<BlogCreateModel>, res: Response<BlogViewModel>) {
        try {
            const newBlogDB = await this.blogsService.createBlog(req.body)
            if (!newBlogDB) return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)

            const newBlog = await this.blogsQueryRepository.getBlogViewById(newBlogDB._id)
            if (!newBlog) return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)

            return res.status(StatusCodes.CREATED).send(newBlog)
        } catch (error) {
            console.error(error)
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async createPostByBlogId(req: RequestsWithParamsAndBody<URIParamsIdModel, BlogPostCreateModel>, res: Response<PostViewModel>) {
        try {
            const newPostDB = await this.blogsService.createPostByBlogId(req.params.id, req.body)
            if (!newPostDB) return res.sendStatus(StatusCodes.NOT_FOUND)

            const newPost = await this.postsQueryRepository.getPostViewById(newPostDB._id, req.userId)
            if (!newPost) return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)

            return res.status(StatusCodes.CREATED).send(newPost)
        } catch (error) {
            console.error(error)
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async getBlogViewById(req: Request<URIParamsIdModel>, res: Response<BlogViewModel>) {
        try {
            const blog = await this.blogsQueryRepository.getBlogViewById(req.params.id)
            if (!blog) return res.sendStatus(StatusCodes.NOT_FOUND)

            return res.send(blog)
        } catch (error) {
            console.error(error)
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async findPostsByBlogId(req: RequestsWithParamsAndQuery<URIParamsIdModel, QueryParamsModels>, res: Response<PaginatorPostViewTypes>) {
        try {
            const posts = await this.postsQueryRepository.findPostsByBlogId(req.params.id, req.query, req.userId)
            if (!posts) return res.sendStatus(StatusCodes.NOT_FOUND)

            return res.send(posts)
        } catch (error) {
            console.error(error)
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async updateBlog(req: RequestsWithParamsAndBody<URIParamsIdModel, BlogUpdateModel>, res: Response) {
        try {
            const isUpdate = await this.blogsService.updateBlog(req.params.id, req.body)
            if (!isUpdate) return res.sendStatus(StatusCodes.NOT_FOUND)
            return res.sendStatus(StatusCodes.NO_CONTENT)
        } catch (error) {
            console.error(error)
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async deleteBlog(req: Request<URIParamsIdModel>, res: Response) {
        try {
            const isDelete = await this.blogsService.deleteBlogById(req.params.id)
            if (!isDelete) return res.sendStatus(StatusCodes.NOT_FOUND)
            return res.sendStatus(StatusCodes.NO_CONTENT)
        } catch (error) {
            console.error(error)
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }
}