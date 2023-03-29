import { CreateVideoModel } from "../models/CreateVideoModel"
import { VideoViewModel } from "../models/VideoViewModel"

export enum Resolutions {
    'P144' = 'P144',
    'P240' = 'P240',
    'P360' = 'P360', 
    'P480' = 'P480', 
    'P720' = 'P720', 
    'P1080' = 'P1080', 
    'P1440' = 'P1440', 
    'P2160' = 'P2160'
} 

export type VideoType = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    createdAt: string
    publicationDate: string
    availableResolutions: Resolutions[]
}

const createdAt: Date = new Date();

const video: VideoType = {
    id: 0, 
    title: "new video it-incubator",
    author: 'it-incubator',
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: createdAt.toISOString(),
    publicationDate: publicationDate(createdAt),
    availableResolutions: [Resolutions.P144]
}

export function publicationDate(createdAt: Date): string {
    const newDate = createdAt;
    newDate.setHours(newDate.getHours() + 24);
    return newDate.toISOString();
}

let videos: VideoType[] = [video]

export const videoRepository = {
    getVideo(): VideoType[] {
        return videos
    },
    createProduct(body: CreateVideoModel): VideoType {
        const createdAt: Date = new Date();

        const createVideo: VideoType = {
            id: +(new Date()),
            title: body.title,
            author: body.title,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: createdAt.toISOString(),
            publicationDate: publicationDate(createdAt),
            availableResolutions: []
        }
    
        videos.push(createVideo);
    }, 
}