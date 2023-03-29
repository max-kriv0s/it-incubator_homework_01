import { CreateVideoModel } from "../models/CreateVideoModel"
import { UpdateVideoModel } from "../models/UpdateVideoModel"

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

const createdAt: Date = new Date()

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
    const newDate = createdAt
    newDate.setHours(newDate.getHours() + 24)
    return newDate.toISOString()
}

let videos: VideoType[] = [video]

export const videoRepository = {
    getVideo(): VideoType[] {
        return videos
    },
    getProduct(id: string): VideoType | null {
        return videoRepository.findVideo(id)
    },
    createProduct(body: CreateVideoModel): VideoType {
        const createdAt: Date = new Date()

        const availableResolutions = []
        if (body.availableResolutions) {
            for (const elem of body.availableResolutions) {
                availableResolutions.push(Resolutions[elem])
            }
        }

        const createVideo: VideoType = {
            id: +(new Date()),
            title: body.title,
            author: body.title,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: createdAt.toISOString(),
            publicationDate: publicationDate(createdAt),
            availableResolutions: availableResolutions
        }
    
        videos.push(createVideo)

        return createVideo
    }, 
    updateProduct(id: string, body: UpdateVideoModel): void | null  {
        const video = videoRepository.findVideo(id)
        if (!video) {
            return null
        }

        video.title = body.title
        video.author = body.author

        if (body.availableResolutions) {
            video.availableResolutions = body.availableResolutions;
        }
    
        if (body.minAgeRestriction) {
            video.minAgeRestriction = body.minAgeRestriction;
        }
    
        if (body.publicationDate){
            video.publicationDate = body.publicationDate;
        }
    },
    findVideo(id: string): VideoType | null {
        const video = videos.find(v => v.id === +id);
        if (video) {
            return video
        } else {
            return null
        }
    },
    deleteVideo(id: string): VideoType[] {
        for (let i = 0; i < videos.length; i++) {
            if (videos[i].id === +id){
                const deleteVideos = videos.splice(i, 1);              
                return deleteVideos;
            }
        }  
        return []
    },
    deleteVideos(): void {
        videos = []
    }
}