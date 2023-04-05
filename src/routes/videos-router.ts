import { Router, Request, Response } from "express"
import { StatusCodes } from "http-status-codes";

import { CreateVideoModel } from "../models/CreateVideoModel"
import { APIErrorResult } from "../models/APIErrorModels"
import { UpdateVideoModel } from "../models/UpdateVideoModel";
import { VideoCreateValidate, VideoUpdateValidate} from "../middlewares/Video-validation-middleware";
import { videoRepository } from "../repositories/videos-repository";
import { VideoViewModel } from "../models/VideoViewModel";
import { ErrorsValidate } from "../middlewares/Errors-middleware";
import { RequestsURIParams, RequestsWithBody } from "../types.ts/types";
import { URIParamsIdModel } from "../models/URIParamsIdModel";


export const routerVideos = Router()

routerVideos.get('/', (req: Request, res: Response) => {
    const videos = videoRepository.getVideos()
    res.send(videos)
})

routerVideos.post('/', 
    VideoCreateValidate,
    ErrorsValidate,
    (req: RequestsWithBody<CreateVideoModel>, res: Response<VideoViewModel>) => {
        const newVideo = videoRepository.createVideo(req.body)
        res.status(StatusCodes.CREATED).send(newVideo)
})

routerVideos.get('/:id', (req: RequestsURIParams<URIParamsIdModel>, res:Response<VideoViewModel>) => {
    const video = videoRepository.findVideoById(req.params.id)
    if (video) {
        res.send(video)
    } else {
        res.sendStatus(StatusCodes.NOT_FOUND)
    } 
})

routerVideos.put('/:id', 
    VideoUpdateValidate,
    ErrorsValidate,
    (req: Request<{id: string},{}, UpdateVideoModel>, res: Response) => {
        const isUpdate = videoRepository.updateVideo(+req.params.id, req.body)
        if (isUpdate) {
            res.sendStatus(StatusCodes.NO_CONTENT);    
        } else {
            res.sendStatus(StatusCodes.NOT_FOUND);   
        }
})

routerVideos.delete('/:id', (req: Request<{id: string}>, res:Response) => {
    const isDeleted = videoRepository.deleteVideo(+req.params.id)
    if (isDeleted) {
        res.sendStatus(StatusCodes.NO_CONTENT);
    } else {
        res.sendStatus(StatusCodes.NOT_FOUND);
    }   
})
