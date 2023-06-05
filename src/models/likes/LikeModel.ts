import { ObjectId } from "mongodb";
import mongoose from "mongoose";

export enum LikeStatus {
    None = 0,
    Like = 1,
    Dislike = -1
}

export class LikeClass {
    constructor(
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
        type: Number,
        enum: LikeStatus, 
        required: true,
        default: LikeStatus.None
    }
})

export const LikeModel = mongoose.model<LikeClass>('likes', LikeShema)