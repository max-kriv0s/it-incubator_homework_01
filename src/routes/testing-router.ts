import { Router, Request, Response } from "express";
import { videoRepository } from "../repositories/videos-repository";
import { blogsRepository } from "../repositories/blogs-repository";
import { postsRepository } from "../repositories/posts-repository";
import { usersRepository } from "../repositories/users-repository";
import { commentsRepository } from "../repositories/comments-repository";
import { devicesRepository } from "../repositories/devices-repository";


export const routerTesting = Router()

routerTesting.delete('/all-data', async (req: Request, res: Response) => {
    await videoRepository.deleteVideos()
    await blogsRepository.deleteBlogs()
    await postsRepository.deletePosts()
    await usersRepository.deleteUsers()
    await commentsRepository.deleteComments()
    await devicesRepository.deleteDevices()

    res.send(204)
})