import { injectable } from "inversify";
import { validID } from "../db";
import { MyResult, ResultCode } from "../../../types/types";
import { HydratedLikePost } from "../../../domain/likes/LikePostTypes";
import { getMyResult } from "../../../utils/utils";
import { LikePostModel } from "../../../domain/likes/LikePostSchema";
import { ObjectId } from "mongodb";

@injectable()
export class LikePostRepository {
    async findLikeByPostIdAndUserId(postId: string, userId: string):Promise<HydratedLikePost | null> {
        if (!validID(postId) || !validID(userId)) return null

        return LikePostModel.findOne({
            postId: new ObjectId(postId),
            userId: new ObjectId(userId)
        })
    }

    async save(model: HydratedLikePost) {
        model.save()
    }
}