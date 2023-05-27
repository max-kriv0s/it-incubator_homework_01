import { Router, Request, Response } from "express";
import { videoRepository } from "../repositories/videos-repository";
import { blogsRepository } from "../repositories/blogs-repository";
import { postsRepository } from "../repositories/posts-repository";
import { usersRepository } from "../repositories/users-repository";
import { commentsRepository } from "../repositories/comments-repository";
import { securityDevicesRepository } from "../repositories/security-devices-repository";
import { apiCallsRepository } from "../repositories/api-calls-repository";
import { StatusCodes } from "http-status-codes";


export const routerTesting = Router()

routerTesting.delete('/all-data', async (req: Request, res: Response) => {
    // await videoRepository.deleteVideos()
    // await blogsRepository.deleteBlogs()
    // await postsRepository.deletePosts()
    // await usersRepository.deleteUsers()
    // await commentsRepository.deleteComments()
    // await securityDevicesRepository.deleteAllDevicesSessions()
    // await apiCallsRepository.deleteCalls()

// можно написать так
    try {
        await Promise.all([
            videoRepository.deleteVideos(),
            blogsRepository.deleteBlogs(),
            postsRepository.deletePosts(),
            usersRepository.deleteUsers(),
            commentsRepository.deleteComments(),
            securityDevicesRepository.deleteAllDevicesSessions(),
            apiCallsRepository.deleteCalls()
        ])
        return res.send(StatusCodes.NO_CONTENT)
    } catch (error) {
        return res.send(StatusCodes.INTERNAL_SERVER_ERROR)
    }

})