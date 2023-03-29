import { Router, Request, Response } from "express"

enum Resolutions {
    'P144',
    'P240',
    'P360', 
    'P480', 
    'P720', 
    'P1080', 
    'P1440', 
    'P2160'
} 

type Video = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    createdAt: string
    publicationDate: string
    availableResolutions: Resolutions
}

const video: Video = {
    id: 1, 
    title: "new video it-incubator",
    author: 'it-incubator',
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: (new Date().toISOString()),
    publicationDate: (new Date().toISOString()),
    availableResolutions: Resolutions.P144   
}

const videos: Video[] = [video]

export const routerVideos = Router()

routerVideos.get('/', (req: Request, res: Response) => {
    res.send(videos);
})