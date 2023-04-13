import { Router, Request, Response } from "express"

import { blogsRepository } from "../repositories/blogs-repository"
import { BlogViewModel } from "../models/blogs/BlogViewModel"
import { BlogCreateModel } from "../models/blogs/BlogCreateModel"
import { RequestsWithBody, RequestsWithParamsAndBody } from "../types.ts/types"
import { StatusCodes } from "http-status-codes"
import { BasicAuthValidate } from "../middlewares/BasicAuth-validation-middleware"
import { ErrorsValidate } from "../middlewares/Errors-middleware"
import { BlogValidate } from "../middlewares/Blog-validation-middleware"
import { BlogUpdateModel } from "../models/blogs/BlogUpdateModel"
import { URIParamsIdModel } from "../types.ts/URIParamsIdModel"


export const routerBlogs = Router()

routerBlogs.get('/', async (req: Request, res: Response<BlogViewModel[]>) => {
    const blogs: BlogViewModel[] = await blogsRepository.getBlogs()
    res.send(blogs)
})

routerBlogs.post('/',
    BasicAuthValidate,
    BlogValidate,
    ErrorsValidate,
    async (req: RequestsWithBody<BlogCreateModel>, res: Response<BlogViewModel>) => {
        const newBlog = await blogsRepository.createBlog(req.body)
        res.status(StatusCodes.CREATED).send(newBlog)
})

routerBlogs.get('/:id', async (req: Request<URIParamsIdModel>, res: Response<BlogViewModel>) => {
    const blog = await blogsRepository.findBlogById(req.params.id)
    if (blog) {
        res.send(blog)
    } else {
        res.sendStatus(StatusCodes.NOT_FOUND)
    }
})

routerBlogs.put('/:id', 
    BasicAuthValidate,
    BlogValidate,
    ErrorsValidate,
    async (req: RequestsWithParamsAndBody<URIParamsIdModel, BlogUpdateModel>, res: Response) => {
        const isUpdate = await blogsRepository.updateBlog(req.params.id, req.body)
        if (isUpdate) {
            res.sendStatus(StatusCodes.NO_CONTENT)    
        } else {
            res.sendStatus(StatusCodes.NOT_FOUND)
        }
})

routerBlogs.delete('/:id', 
    BasicAuthValidate,
    async (req: Request<URIParamsIdModel>, res: Response) => {
        const isDelete = await blogsRepository.deleteBlog(req.params.id)
        if (isDelete) {            
            res.sendStatus(StatusCodes.NO_CONTENT)      
        } else {
            res.sendStatus(StatusCodes.NOT_FOUND)
        }   
})