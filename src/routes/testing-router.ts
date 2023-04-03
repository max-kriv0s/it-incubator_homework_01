import { Router, Request, Response } from "express";
import { videoRepository } from "../repositories/videos-repository";
import { blogsRepository } from "../repositories/blogs-repository";
import { postsRepository } from "../repositories/posts-repository";


export const routerTesting = Router()

routerTesting.delete('/all-data', (req: Request, res: Response) => {
    videoRepository.deleteVideos()
    blogsRepository.deleteBlogs()
    postsRepository.deletePosts()

    res.send(204)
})