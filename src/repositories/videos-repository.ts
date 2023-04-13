import { CreateVideoModel } from "../models/videos/CreateVideoModel"
import { UpdateVideoModel } from "../models/videos/UpdateVideoModel"
import { VideoViewModel } from "../models/videos/VideoViewModel"
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
    async getVideos(): Promise<VideoViewModel[]> {
        return videos
    },
    async findVideoById(id: string): Promise<VideoViewModel | undefined> {
        return videos.find(v => v.id === +id);
    },
    async createVideo(body: CreateVideoModel): Promise<VideoViewModel> {
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
    async updateVideo(id: number, body: UpdateVideoModel): Promise<boolean>  {
        
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
    async deleteVideo(id: number): Promise<boolean> {
        return deleteValueById(videos, id)
    },
    async deleteVideos() {
        videos = []
    }
}