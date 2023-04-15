import { CreateVideoModel } from "../models/videos/CreateVideoModel"
import { UpdateVideoModel } from "../models/videos/UpdateVideoModel"
import { VideoViewModel } from "../models/videos/VideoViewModel"
import { newNumberId, publicationDate } from "../utils/utils"
import { videosCollection } from "./db"


export const videoRepository = {
    async getVideos(): Promise<VideoViewModel[]> {
        return videosCollection.find({}, {projection: {'_id': 0}}).toArray()
    },

    async findVideoById(id: number): Promise<VideoViewModel | null> {
        const video:VideoViewModel | null = await videosCollection.findOne({ id: id}, {projection: {'_id': 0}})
        return video
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
    
        const result = await videosCollection.insertOne({...createVideo})
        return createVideo

    }, 

    async updateVideo(id: number, body: UpdateVideoModel): Promise<boolean>  {
        
        const result = await videosCollection.updateOne(
            { id: id},
            { $set: {
                title: body.title,
                author: body.author,
                availableResolutions: body.availableResolutions ? body.availableResolutions : [],
                canBeDownloaded: body.canBeDownloaded ? body.canBeDownloaded : false,
                minAgeRestriction: body.minAgeRestriction ? body.minAgeRestriction : null,
                publicationDate: body.publicationDate ? body.publicationDate :''
            }}
        )

        return result.matchedCount === 1
    },

    async deleteVideo(id: number): Promise<boolean> {
        const result = await videosCollection.deleteOne({ id: id})
        return result.deletedCount === 1 
    },
    async deleteVideos() {
        videosCollection.deleteMany({})
    }
}