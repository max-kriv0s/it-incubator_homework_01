import { Router, Request, Response } from "express"

import { blogsRepository } from "../repositories/blogs-repository"
import { BlogViewModel } from "../models/BlogViewModel"
import { BlogCreateModel } from "../models/BlogCreateModel"
import { RequestsWithBody } from "../types.ts/types"
import { StatusCodes } from "http-status-codes"
import { BaseAuthPassed } from "../middlewares/BasicAuth-middleware"
import { ErrorsValidate } from "../middlewares/Errors-middleware"
import { BlogCreateValidate } from "../middlewares/Blog-validation-middleware"


export const routerBlogs = Router()

routerBlogs.get('/', (req: Request, res: Response<BlogViewModel[]>) => {
    const blogs: BlogViewModel[] = blogsRepository.getBlogs()
    res.send(blogs)
})

routerBlogs.post('/',
    BaseAuthPassed,
    BlogCreateValidate,
    ErrorsValidate,
    (req: RequestsWithBody<BlogCreateModel>, res: Response<BlogViewModel>) => {
    const newBlog = blogsRepository.createBlog(req.body)

    res.status(StatusCodes.CREATED).send(newBlog)
})