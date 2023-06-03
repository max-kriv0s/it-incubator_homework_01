import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { apiCallsRepository, blogsRepository, commentsRepository, postsRepository, securityDevicesRepository, usersRepository } from "../composition-root";


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