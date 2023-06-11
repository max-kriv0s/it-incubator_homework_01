import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { container} from "../composition-root";
import { BlogsRepository } from "../infrastructure/repositories/blogs/blogs-repository";
import { PostsRepository } from "../infrastructure/repositories/posts/posts-repository";
import { UsersRepository } from "../infrastructure/repositories/users/users-repository";
import { CommentsRepository } from "../infrastructure/repositories/comments/comments-repository";
import { SecurityDevicesRepository } from "../infrastructure/repositories/security-devices/security-devices-repository";
import { ApiCallsRepository } from "../infrastructure/repositories/api-calls/api-calls-repository";


const blogsRepository = container.resolve(BlogsRepository)
const postsRepository = container.resolve(PostsRepository)
const usersRepository = container.resolve(UsersRepository)
const commentsRepository = container.resolve(CommentsRepository)
const securityDevicesRepository = container.resolve(SecurityDevicesRepository)
const apiCallsRepository = container.resolve(ApiCallsRepository)

export const routerTesting = Router()

routerTesting.delete('/all-data', async (req: Request, res: Response) => {
    try {
        await Promise.all([
            blogsRepository.deleteBlogs(),
            postsRepository.deletePosts(),
            usersRepository.deleteUsers(),
            commentsRepository.deleteComments(),
            securityDevicesRepository.deleteAllDevicesSessions(),
            apiCallsRepository.deleteCalls()
        ])
        return res.sendStatus(StatusCodes.NO_CONTENT)
    } catch (error) {
        return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
    }
})