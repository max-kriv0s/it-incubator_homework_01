import { Router, Request, Response } from "express";
import { videoRepository } from "../repositories/videos-repository";


export const routerTesting = Router()

routerTesting.delete('/all-data', (req: Request, res: Response) => {
    videoRepository.deleteVideos()
    res.send(204)
})