import { CreateVideoModel } from "../models/CreateVideoModel"
import { UpdateVideoModel } from "../models/UpdateVideoModel"

export type VideoType = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    createdAt: string
    publicationDate: string
    availableResolutions: string[]
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
    availableResolutions: ["P144"]
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

        const availableResolutions: string[] = []
        if (body.availableResolutions) {
            for (const elem of body.availableResolutions) {
                availableResolutions.push(elem)
            }
        }

        const createVideo: VideoType = {
            id: +(new Date()),
            title: body.title,
            author: body.author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: createdAt.toISOString(),
            publicationDate: publicationDate(createdAt),
            availableResolutions: availableResolutions
        }
    
        videos.push(createVideo)

        return createVideo
    }, 
    updateProduct(video: VideoType, body: UpdateVideoModel): void  {
        video.title = body.title
        video.author = body.author

        if (body.availableResolutions) {
            video.availableResolutions = body.availableResolutions;
        }
    
        if (body.canBeDownloaded) {
            video.canBeDownloaded = body.canBeDownloaded
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