import { CreateVideoModel } from "../models/CreateVideoModel"
import { UpdateVideoModel } from "../models/UpdateVideoModel"
import { VideoViewModel } from "../models/VideoViewModel"
import { publicationDate } from "../utils/utils"


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
    getVideo(id: string): VideoViewModel | undefined {
        return videos.find(v => v.id === +id);
    },
    createVideo(body: CreateVideoModel): VideoViewModel {
        const createdAt: Date = new Date()

        const availableResolutions: string[] = body.availableResolutions ? [...body.availableResolutions] : []

        const createVideo: VideoViewModel = {
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
    updateVideo(video: VideoViewModel, body: UpdateVideoModel): void  {
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
    deleteVideo(id: string): boolean {
        for (let i = 0; i < videos.length; i++) {
            if (videos[i].id === +id){
                const deleteVideos = videos.splice(i, 1);              
                return true;
            }
        }  
        return false
    },
    deleteVideos(): void {
        videos = []
    }
}