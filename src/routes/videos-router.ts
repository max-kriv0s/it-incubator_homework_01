import { Router, Request, Response } from "express"
import { StatusCodes } from "http-status-codes";

import { CreateVideoModel } from "../models/videos/CreateVideoModel"
import { APIErrorResult } from "../types/APIErrorModels"
import { UpdateVideoModel } from "../models/videos/UpdateVideoModel";
import { VideoCreateValidate, VideoUpdateValidate} from "../middlewares/Video-validation-middleware";
import { videoRepository } from "../repositories/videos-repository";
import { VideoViewModel } from "../models/videos/VideoViewModel";
import { ErrorsValidate } from "../middlewares/Errors-middleware";
import { RequestsURIParams, RequestsWithBody } from "../types/types";
import { URIParamsIdModel } from "../types/URIParamsModel";


export const routerVideos = Router()

routerVideos.get('/', async (req: Request, res: Response) => {
    const videos = await videoRepository.getVideos()
    res.send(videos)
})

routerVideos.post('/', 
    VideoCreateValidate,
    ErrorsValidate,
    async (req: RequestsWithBody<CreateVideoModel>, res: Response<VideoViewModel>) => {
        const newVideo = await videoRepository.createVideo(req.body)
        res.status(StatusCodes.CREATED).send(newVideo)
})

routerVideos.get('/:id', async (req: RequestsURIParams<URIParamsIdModel>, res:Response<VideoViewModel>) => {
    const video = await videoRepository.findVideoById(+req.params.id)
    if (video) {
        res.send(video)
    } else {
        res.sendStatus(StatusCodes.NOT_FOUND)
    } 
})

routerVideos.put('/:id', 
    VideoUpdateValidate,
    ErrorsValidate,
    async (req: Request<{id: string},{}, UpdateVideoModel>, res: Response) => {
        const isUpdate = await videoRepository.updateVideo(+req.params.id, req.body)
        if (isUpdate) {
            res.sendStatus(StatusCodes.NO_CONTENT);    
        } else {
            res.sendStatus(StatusCodes.NOT_FOUND);   
        }
})

routerVideos.delete('/:id', async (req: Request<{id: string}>, res:Response) => {
    const isDeleted = await videoRepository.deleteVideo(+req.params.id)
    if (isDeleted) {
        res.sendStatus(StatusCodes.NO_CONTENT);
    } else {
        res.sendStatus(StatusCodes.NOT_FOUND);
    }   
})
