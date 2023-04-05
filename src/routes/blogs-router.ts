import { Router, Request, Response } from "express"

import { blogsRepository } from "../repositories/blogs-repository"
import { BlogViewModel } from "../models/BlogViewModel"
import { BlogCreateModel } from "../models/BlogCreateModel"
import { RequestsWithBody, RequestsWithParamsAndBody } from "../types.ts/types"
import { StatusCodes } from "http-status-codes"
import { BaseAuthPassed } from "../middlewares/BasicAuth-middleware"
import { ErrorsValidate } from "../middlewares/Errors-middleware"
import { BlogValidate } from "../middlewares/Blog-validation-middleware"
import { UpdateBlogView } from "../models/UpdateBlogModel"
import { APIErrorResult } from "../models/APIErrorModels"
import { URIParamsIdModel } from "../models/URIParamsIdModel"


export const routerBlogs = Router()

routerBlogs.get('/', (req: Request, res: Response<BlogViewModel[]>) => {
    const blogs: BlogViewModel[] = blogsRepository.getBlogs()
    res.send(blogs)
})

routerBlogs.post('/',
    BaseAuthPassed,
    BlogValidate,
    ErrorsValidate,
    (req: RequestsWithBody<BlogCreateModel>, res: Response<BlogViewModel>) => {
    const newBlog = blogsRepository.createBlog(req.body)

    res.status(StatusCodes.CREATED).send(newBlog)
})

routerBlogs.get('/:id', (req: Request<URIParamsIdModel>, res: Response<BlogViewModel>) => {
    const blog = blogsRepository.getBlog(req.params.id)
    if (blog) {
        res.send(blog)
    } else {
        res.sendStatus(StatusCodes.NOT_FOUND)
    }
})

routerBlogs.put('/:id', 
    BaseAuthPassed,
    BlogValidate,
    ErrorsValidate,
    (req: RequestsWithParamsAndBody<URIParamsIdModel, UpdateBlogView>, res: Response<APIErrorResult>) => {

        const isUpdate = blogsRepository.updateBlog(req.params.id, req.body)
        if (isUpdate) {
            res.sendStatus(StatusCodes.NO_CONTENT)    
        } else {
            res.sendStatus(StatusCodes.NOT_FOUND)
        }
})

routerBlogs.delete('/:id', 
    BaseAuthPassed,
    (req: Request<URIParamsIdModel>, res: Response) => {

        const isDelete = blogsRepository.deleteBlog(req.params.id)
        if (isDelete) {            
            res.sendStatus(StatusCodes.NO_CONTENT)      
        } else {
            res.sendStatus(StatusCodes.NOT_FOUND)
        }   
})