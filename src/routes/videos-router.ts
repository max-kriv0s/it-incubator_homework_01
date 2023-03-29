import { Router, Request, Response } from "express"
import { CreateVideoModel } from "../models/CreateVideoModel"
import { APIErrorResult } from "../models/APIErrorModels"
import { UpdateVideoModel } from "../models/UpdateVideoModel";
import { validateAuthor, validateAvailableResolutions, validateMinAgeRestriction, validateTitle } from "../validate";
import { videoRepository } from "../db/db";

export const routerVideos = Router()

routerVideos.get('/', (req: Request, res: Response) => {
    const videos = videoRepository.getVideo()
    res.send(videos)
})
routerVideos.post('/', (req: Request<{},{}, CreateVideoModel>, res: Response) => {
    const errors: APIErrorResult = {errorsMessages: []}
    const body = req.body;

    validateTitle(body, errors)
    validateAuthor(body, errors)
    validateAvailableResolutions(body, errors)

    if (errors.errorsMessages.length > 0) {
        res.status(400).send(errors);
        return;
    }

    const newVideo = videoRepository.createProduct(body)

    res.status(201).send(newVideo)
})
routerVideos.get('/:id', (req: Request<{id: string}>, res:Response) => {
    const video = videoRepository.getProduct(req.params.id)
    if (video) {
        res.send(video)
    } else {
        res.send(404)
    } 
})
routerVideos.put('/:id', (req: Request<{id: string},{}, UpdateVideoModel>, res: Response) => {
    const errors: APIErrorResult = {errorsMessages: []}
    const body = req.body;

    const video = videoRepository.findVideo(req.params.id)
    if (!video) {
        res.send(404);
        return;
    }

    validateTitle(body, errors)
    validateAuthor(body, errors)
    validateMinAgeRestriction(body, errors)
    validateAvailableResolutions(body, errors)

    if (errors.errorsMessages.length > 0) {
        res.status(400).send(errors);
        return;
    }

    videoRepository.updateProduct(video, body)

    res.send(204);
})
routerVideos.delete('/:id', (req: Request<{id: string}>, res:Response) => {
    const videos = videoRepository.deleteVideo(req.params.id)
    if (videos.length === 0) {
        res.send(404);
    }

    res.send(204);
    
})
