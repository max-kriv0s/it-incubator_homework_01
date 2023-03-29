import { Router, Request, Response } from "express"
import { CreateVideoModel } from "../models/CreateVideoModel"
import { APIErrorResult } from "../models/APIErrorModels"
import { UpdateVideoModel } from "../models/UpdateVideoModel";
import { validateAuthor, validateMinAgeRestriction, validateTitle } from "../validate";
import { videoRepository } from "../db/db";

export const routerVideos = Router()

routerVideos.get('/', (req: Request, res: Response) => {
    const videos = videoRepository.getVideo()
    res.send(videos)
})
routerVideos.post('/', (req: Request<{},{}, CreateVideoModel>, res: Response) => {
    const errorsMessages: APIErrorResult = []
    const body = req.body;

    validateTitle(body, errorsMessages);
    validateAuthor(body, errorsMessages);

    if (errorsMessages.length > 0) {
        res.status(400).send(errorsMessages);
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
    const errorsMessages: APIErrorResult = []
    const body = req.body;

    validateTitle(body, errorsMessages);
    validateAuthor(body, errorsMessages);
    validateMinAgeRestriction(body, errorsMessages);

    if (errorsMessages.length > 0) {
        res.status(400).send(errorsMessages);
        return;
    }

    const video = videoRepository.updateProduct(req.params.id, body)
    if (!video) {
        res.send(404);
        return;
    }

    res.send(204);
})
routerVideos.delete('/:id', (req: Request<{id: string}>, res:Response) => {
    const videos = videoRepository.deleteVideo(req.params.id)
    if (!videos) {
        res.send(404);
    }

    res.send(204);
    
})
