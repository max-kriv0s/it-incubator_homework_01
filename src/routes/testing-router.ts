import { Router, Request, Response } from "express";
import { videoRepository } from "../repositories/videos-repository";
import { blogsRepository } from "../repositories/blogs-repository";
import { postsRepository } from "../repositories/posts-repository";


export const routerTesting = Router()

routerTesting.delete('/all-data', async (req: Request, res: Response) => {
    await videoRepository.deleteVideos()
    await blogsRepository.deleteBlogs()
    await postsRepository.deletePosts()

    res.send(204)
})