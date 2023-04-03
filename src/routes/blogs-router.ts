import { Router, Request, Response } from "express"
import { header, CustomValidator, check } from 'express-validator'


import { blogsRepository } from "../repositories/blogs-repository"
import { BlogViewModel } from "../models/BlogViewModel"
import { APIErrorResult } from "../models/APIErrorModels"
import { BlogCreateModel } from "../models/BlogCreateModel"
import { RequestsWithBody } from "../types.ts/types"
import { StatusCodes } from "http-status-codes"
import { BaseAuthPassed } from "../middlewares/BasicAuth-middleware"


export const routerBlogs = Router()

routerBlogs.get('/', (req: Request, res: Response<BlogViewModel[]>) => {
    const blogs: BlogViewModel[] = blogsRepository.getBlogs()
    res.send(blogs)
})
routerBlogs.post('/',
    BaseAuthPassed,
    (req: RequestsWithBody<BlogCreateModel>, res: Response<BlogViewModel | APIErrorResult>) => {
    const newBlog = blogsRepository.createBlog(req.body)

    res.status(StatusCodes.CREATED).send(newBlog)
})