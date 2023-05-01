import { Router, Request, Response } from "express";
import { videoRepository } from "../repositories/videos-repository";
import { blogsRepository } from "../repositories/blogs-repository";
import { postsRepository } from "../repositories/posts-repository";
import { usersRepository } from "../repositories/users-repository";
import { commentsRepository } from "../repositories/comments-repository";


export const routerTesting = Router()

routerTesting.delete('/all-data', async (req: Request, res: Response) => {
    videoRepository.deleteVideos()
    blogsRepository.deleteBlogs()
    postsRepository.deletePosts()
    usersRepository.deleteUsers()
    commentsRepository.deleteComments()

    res.send(204)
})