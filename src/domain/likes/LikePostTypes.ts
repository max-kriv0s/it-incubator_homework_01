import { ObjectId } from "mongodb";
import { LikeStatus } from "./LikeModel";
import { HydratedDocument, Model } from "mongoose";


export type HydratedLikePost = HydratedDocument<ILikePost, ILikePostMethods>

export interface ILikePost {
    postId: ObjectId;
    userId: ObjectId;
    login: string;
    addedAt: string;
    status: LikeStatus;
}

export interface ILikePostMethods {
    setStatus(newStatus: LikeStatus): void;
    getStatus(): LikeStatus;
}

export interface ILikePostStaticMethods extends Model<ILikePost, {}, ILikePostMethods> {
    createLike(postId: ObjectId, userId: ObjectId, login: string, status: LikeStatus): Promise<HydratedLikePost>;
}