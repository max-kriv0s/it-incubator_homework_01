import { Router, Request, Response } from "express"
import { BlogViewModel } from "../models/blogs/BlogViewModel"
import { BlogCreateModel } from "../models/blogs/BlogCreateModel"
import { RequestsQuery, RequestsWithBody, RequestsWithParamsAndBody, RequestsWithParamsAndQuery } from "../types/types"
import { StatusCodes } from "http-status-codes"
import { BasicAuthValidate } from "../middlewares/BasicAuth-validation-middleware"
import { ErrorsValidate } from "../middlewares/Errors-middleware"
import { BlogValidate } from "../middlewares/Blog-validation-middleware"
import { BlogUpdateModel } from "../models/blogs/BlogUpdateModel"
import { URIParamsIdModel } from "../types/URIParamsIdModel"
import { PaginatorBlogViewTypes, PaginatorPostViewTypes, PaginatorTypes } from "../types/PaginatorType"
import { QueryParamsModels } from "../types/QueryParamsModels"
import { blogsServise } from "../domain/blogs-service"
import { PostViewModel } from "../models/posts/PostViewModel"
import { BlogPostCreateModel } from "../models/blogs/BlogPostCreateModel"
import { PostValidate } from "../middlewares/Post-validation-middleware"


export const routerBlogs = Router()

routerBlogs.get('/', 
    async (req: RequestsQuery<QueryParamsModels>, res: Response<PaginatorBlogViewTypes>) => {
        const blogs: PaginatorBlogViewTypes = await blogsServise.getBlogs(req.query)
        res.send(blogs)
})

routerBlogs.post('/',
    BasicAuthValidate,
    BlogValidate,
    ErrorsValidate,
    async (req: RequestsWithBody<BlogCreateModel>, res: Response<BlogViewModel>) => {
        const newBlog = await blogsServise.createBlog(req.body)
        res.status(StatusCodes.CREATED).send(newBlog)
})

routerBlogs.post('/:id/posts',
    BasicAuthValidate,
    PostValidate,
    ErrorsValidate,
    async (req: RequestsWithParamsAndBody<URIParamsIdModel, BlogPostCreateModel>, res: Response<PostViewModel>) => {
        const newPost = await blogsServise.createPostByBlogId(req.params.id, req.body)
        if (newPost) {
            res.status(StatusCodes.CREATED).send(newPost)
        } else {
            res.sendStatus(StatusCodes.NOT_FOUND)
        }
    }
)

routerBlogs.get('/:id',
    async (req: Request<URIParamsIdModel>, res: Response<BlogViewModel>) => {
        const blog = await blogsServise.findBlogById(req.params.id)
        if (blog) {
            res.send(blog)
        } else {
            res.sendStatus(StatusCodes.NOT_FOUND)
        }
})

routerBlogs.get('/:id/posts',
    async (req: RequestsWithParamsAndQuery<URIParamsIdModel, QueryParamsModels>, res: Response<PaginatorPostViewTypes>) => {
    const posts = await blogsServise.findPostsByBlogId(req.params.id, req.query)
    if (posts) {
        res.send(posts)
    } else {
        res.sendStatus(StatusCodes.NOT_FOUND)
    }   
})

routerBlogs.put('/:id', 
    BasicAuthValidate,
    BlogValidate,
    ErrorsValidate,
    async (req: RequestsWithParamsAndBody<URIParamsIdModel, BlogUpdateModel>, res: Response) => {
        const isUpdate = await blogsServise.updateBlog(req.params.id, req.body)
        if (isUpdate) {
            res.sendStatus(StatusCodes.NO_CONTENT)    
        } else {
            res.sendStatus(StatusCodes.NOT_FOUND)
        }
})

routerBlogs.delete('/:id', 
    BasicAuthValidate,
    async (req: Request<URIParamsIdModel>, res: Response) => {
        const isDelete = await blogsServise.deleteBlogById(req.params.id)
        if (isDelete) {            
            res.sendStatus(StatusCodes.NO_CONTENT)      
        } else {
            res.sendStatus(StatusCodes.NOT_FOUND)
        }   
})

