import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { LikeStatus } from "./LikeModel";
import { HydratedLikePost, ILikePost, ILikePostMethods, ILikePostStaticMethods } from "./LikePostTypes";


const LikePostSchema = new mongoose.Schema<ILikePost, ILikePostStaticMethods, ILikePostMethods>({
    postId: {
        type: ObjectId,
        required: true
    },
    userId: {
        type: ObjectId,
        required: true
    },
    login: {
        type: String,
        required: true
    },
    addedAt: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: LikeStatus,
        default: LikeStatus.None
    }
})

LikePostSchema.method('setStatus', function setStatus(newStatus: LikeStatus) {
    this.status = newStatus
})
LikePostSchema.method('getStatus', function getStatus(): LikeStatus {
    return this.status
})

LikePostSchema.static('createLike', function createLike(postId: ObjectId, userId: ObjectId,
    login: string, status: LikeStatus): Promise<HydratedLikePost> {

    return this.create({
        postId: postId,
        userId: userId,
        login: login,
        addedAt: new Date().toISOString(),
        status: status
    })
})

export const LikePostModel = mongoose.model<ILikePost, ILikePostStaticMethods>('likesPosts', LikePostSchema)
