import { ObjectId } from "mongodb";
import { validID } from "../db";
import { injectable } from "inversify";
import { LikeClass, LikeModel, LikeStatus } from "../../../domain/likes/LikeModel";
import { MyResult, ResultCode } from "../../../types/types";
import { getMyResult } from "../../../utils/utils";


@injectable()
export class LikeRepository {

    async findLike(commentId: string, userId: string): Promise<MyResult<LikeClass>> {
        if (!validID(commentId) || !validID(userId)) return getMyResult<LikeClass>(ResultCode.notFound)
        
        const like = await LikeModel.findOne({commentId, userId}).exec()
        if (!like) return getMyResult<LikeClass>(ResultCode.notFound)

        return getMyResult<LikeClass>(ResultCode.success, like)
    }

    async createLike(commentId: string, userId: string, status: LikeStatus): Promise<MyResult<LikeClass>> {
        if (!validID(commentId) || !validID(userId)) return getMyResult<LikeClass>(ResultCode.notFound)
        
        const newLike = await LikeModel.create({
            commentId,
            userId,
            status
        })

        return getMyResult<LikeClass>(ResultCode.success, newLike)
    }

    async updateLike(id: ObjectId, status: string): Promise<MyResult<LikeClass>> {
        const result = await LikeModel.updateOne({_id: id}, {status})
        if (result.matchedCount !== 1) return getMyResult(ResultCode.ServerError)

        return getMyResult<LikeClass>(ResultCode.success)
    }

    async deleteLike(id: ObjectId): Promise<MyResult<LikeClass>> {
        const result = await LikeModel.deleteOne({_id: id})
        if (result.deletedCount !== 1) return getMyResult<LikeClass>(ResultCode.notFound)

        return getMyResult<LikeClass>(ResultCode.success)
    }
}