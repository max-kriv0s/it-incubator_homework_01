import { Router, Request, Response } from "express"

import { PostViewModel } from "../models/posts/PostViewModel"
import { postsRepository } from "../repositories/posts-repository"
import { PostCreateModel } from "../models/posts/PostCreateModel"
import { BasicAuthValidate } from "../middlewares/BasicAuth-validation-middleware"
import { RequestsWithBody, RequestsWithParamsAndBody } from "../types.ts/types"
import { ErrorsValidate } from "../middlewares/Errors-middleware"
import { PostValidate } from "../middlewares/Post-validation-middleware"
import { StatusCodes } from "http-status-codes"
import { URIParamsIdModel } from "../types.ts/URIParamsIdModel"
import { PostUpdateModel } from "../models/posts/PostUpdateModel"


export const routerPosts = Router()

routerPosts.get('/', 
    async (req: Request, res: Response<PostViewModel[]>) => { 
        const posts = await postsRepository.getPosts()
        res.send(posts)
})

routerPosts.post('/', 
    BasicAuthValidate,
    PostValidate,
    ErrorsValidate,
    async (req: RequestsWithBody<PostCreateModel>, res: Response<PostViewModel>) => {      
        const post = await postsRepository.createPost(req.body)
        res.status(StatusCodes.CREATED).send(post)

})

routerPosts.get('/:id', 
    async (req: Request<URIParamsIdModel>, res: Response<PostViewModel> ) => {
        const post = await postsRepository.findPostById(req.params.id)  
        if (post) {
            res.send(post)
        } else {
            res.sendStatus(StatusCodes.NOT_FOUND)
        } 
})

routerPosts.put('/:id', 
    BasicAuthValidate,
    PostValidate,
    ErrorsValidate,
    async (req:RequestsWithParamsAndBody<URIParamsIdModel, PostUpdateModel>, res: Response) => {
        const isUpdate = await postsRepository.updatePost(req.params.id, req.body)
        if (isUpdate) {
            res.sendStatus(StatusCodes.NO_CONTENT)    
        } else {
            res.sendStatus(StatusCodes.NOT_FOUND)
        }
})

routerPosts.delete('/:id', 
    BasicAuthValidate,
    async (req: Request<URIParamsIdModel>, res: Response) => {
        const isDeleted = await postsRepository.deletePostById(req.params.id)
        if (isDeleted) {
            res.sendStatus(StatusCodes.NO_CONTENT)
        } else {
            res.sendStatus(StatusCodes.NOT_FOUND)
        }

})