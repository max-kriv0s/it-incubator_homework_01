import { CreateVideoModel } from "../models/CreateVideoModel"
import { UpdateVideoModel } from "../models/UpdateVideoModel"
import { VideoViewModel } from "../models/VideoViewModel"
import { deleteValueById, newNumberId, publicationDate } from "../utils/utils"


const createdAt: Date = new Date()

const video: VideoViewModel = {
    id: 0, 
    title: "new video it-incubator",
    author: 'it-incubator',
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: createdAt.toISOString(),
    publicationDate: publicationDate(createdAt),
    availableResolutions: ["P144"]
}

let videos: VideoViewModel[] = [video]


export const videoRepository = {
    getVideos(): VideoViewModel[] {
        return videos
    },
    findVideoById(id: string): VideoViewModel | undefined {
        return videos.find(v => v.id === +id);
    },
    createVideo(body: CreateVideoModel): VideoViewModel {
        const createdAt: Date = new Date()

        const availableResolutions: string[] = body.availableResolutions ? [...body.availableResolutions] : []

        const createVideo: VideoViewModel = {
            id: newNumberId(),
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
    updateVideo(id: number, body: UpdateVideoModel): boolean  {
        
        const video = videos.find(v => v.id === id)
        if (!video) { return false }
        
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

        return true

    },
    deleteVideo(id: number): boolean {
        return deleteValueById(videos, id)
    },
    deleteVideos(): void {
        videos = []
    }
}