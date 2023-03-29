import { Router, Request, Response } from "express"
import { CreateVideoModel } from "../models/CreateVideoModel"
import { APIErrorResult, FieldError } from "../models/APIErrorModels"
import { VideoViewModel } from "../models/VideoViewModel"
import { UpdateVideoModel } from "../models/UpdateVideoModel";
import { validateAuthor, validateMinAgeRestriction, validateTitle } from "../validate";
import { publicationDate, videoRepository } from "../db/db";

export const routerVideos = Router()

routerVideos.get('/', (req: Request, res: Response) => {
    res.send(videos);
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
    // const createdAt: Date = new Date();

    // const createVideo: VideoViewModel = {
    //     id: +(new Date()),
    //     title: body.title,
    //     author: body.title,
    //     canBeDownloaded: false,
    //     minAgeRestriction: null,
    //     createdAt: createdAt.toISOString(),
    //     publicationDate: publicationDate(createdAt),
    //     availableResolutions: []
    // }

    // videos.push(createVideo);

    res.status(201).send(newVideo)
})
routerVideos.get('/:id', (req: Request<{id: string}>, res:Response) => {
    const video = videos.find(v => v.id === +req.params.id)
    if (video) {
        res.send(video)
    } else {
        res.send(404);
    } 
})
routerVideos.put('/:id', (req: Request<{id: string},{}, UpdateVideoModel>, res: Response) => {
    const video = videos.find(v => v.id === +req.params.id);
    if (!video) {
        res.send(404);
        return;
    }

    const errorsMessages: APIErrorResult = []
    const body = req.body;

    validateTitle(body, errorsMessages);
    validateAuthor(body, errorsMessages);
    validateMinAgeRestriction(body, errorsMessages);

    if (errorsMessages.length > 0) {
        res.status(400).send(errorsMessages);
        return;
    }

    const createdAt: Date = new Date();

    let availableResolutions: Resolutions[] = video.availableResolutions;
    if (body.availableResolutions) {
        availableResolutions = body.availableResolutions;
    }

    let minAgeRestriction: number | null = video.minAgeRestriction;
    if (body.minAgeRestriction) {
        minAgeRestriction = body.minAgeRestriction;
    }

    let publicationDate: string = video.publicationDate;
    if (body.publicationDate){
        publicationDate = body.publicationDate;
    }

    const createVideo: VideoViewModel = {
        ...video,
        title: body.title,
        author: body.title,
        availableResolutions: availableResolutions,
        minAgeRestriction: minAgeRestriction,
        publicationDate: publicationDate
    }

    res.send(204);
})
routerVideos.delete('/:id', (req: Request<{id: string}>, res:Response) => {
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id){
            videos.splice(i, 1);
            res.send(204);
            return;
        }
    }

    res.send(404);
})
