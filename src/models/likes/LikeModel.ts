import { ObjectId } from "mongodb";
import mongoose from "mongoose";

export type LikeInputModel = {
    likeStatus: LikeStatus
}

export enum LikeStatus {
    None = "None",
    Like = "Like",
    Dislike = "Dislike"
}

export class LikeClass {
    constructor(
        public _id: ObjectId,
        public commentId: ObjectId,
        public userId: ObjectId,
        public status: LikeStatus
    ) {}
}

const LikeShema = new mongoose.Schema<LikeClass>({
    commentId: {
        type: ObjectId, 
        required: true
    },
    userId: {
        type: ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: LikeStatus, 
        required: true,
        default: LikeStatus.None
    }
})

export const LikeModel = mongoose.model<LikeClass>('likes', LikeShema)