import { Router, Request, Response } from "express"
import { StatusCodes } from "http-status-codes";

import { CreateVideoModel } from "../models/CreateVideoModel"
import { APIErrorResult } from "../models/APIErrorModels"
import { UpdateVideoModel } from "../models/UpdateVideoModel";
import { validateAuthor, validateAvailableResolutions, validateCanBeDownloaded, validateMinAgeRestriction, validatePublicationDate, validateTitle } from "../middlewares/Video-validation-middleware";
import { videoRepository } from "../repositories/videos-repository";
import { VideoViewModel } from "../models/VideoViewModel";


export const routerVideos = Router()

routerVideos.get('/', (req: Request, res: Response) => {
    const videos = videoRepository.getVideo()
    res.send(videos)
})
routerVideos.post('/', (req: Request<{},{}, CreateVideoModel>, res: Response<VideoViewModel | APIErrorResult>) => {
    const errors: APIErrorResult = {errorsMessages: []}
    const body = req.body;

    validateTitle(body, errors)
    validateAuthor(body, errors)
    validateAvailableResolutions(body, errors)

    if (errors.errorsMessages.length > 0) {
        res.status(StatusCodes.BAD_REQUEST).send(errors);
        return;
    }

    const newVideo = videoRepository.createProduct(body)

    res.status(StatusCodes.CREATED).send(newVideo)
})
routerVideos.get('/:id', (req: Request<{id: string}>, res:Response<VideoViewModel>) => {
    const video = videoRepository.getProduct(req.params.id)
    if (video) {
        res.send(video)
    } else {
        res.sendStatus(StatusCodes.NOT_FOUND)
    } 
})
routerVideos.put('/:id', (req: Request<{id: string},{}, UpdateVideoModel>, res: Response<APIErrorResult>) => {
    const errors: APIErrorResult = {errorsMessages: []}
    const body = req.body;

    const video = videoRepository.getProduct(req.params.id)
    if (!video) {
        res.sendStatus(StatusCodes.NOT_FOUND);
        return;
    }

    validateTitle(body, errors)
    validateAuthor(body, errors)
    validateMinAgeRestriction(body, errors)
    validateAvailableResolutions(body, errors)
    validateCanBeDownloaded(body, errors)
    validatePublicationDate(body, errors)

    if (errors.errorsMessages.length > 0) {
        res.status(StatusCodes.BAD_REQUEST).send(errors);
        return;
    }

    videoRepository.updateProduct(video, body)

    res.sendStatus(StatusCodes.NO_CONTENT);
})
routerVideos.delete('/:id', (req: Request<{id: string}>, res:Response) => {
    const isDeleted = videoRepository.deleteVideo(req.params.id)
    if (isDeleted) {
        res.sendStatus(StatusCodes.NO_CONTENT);
    } else {
        res.sendStatus(StatusCodes.NOT_FOUND);
    } 
    
})
