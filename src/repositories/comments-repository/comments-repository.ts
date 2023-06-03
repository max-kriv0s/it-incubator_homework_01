import { ObjectId } from "mongodb";
import { CommentDBModel, CommentModel } from "../../models/comments/CommentModel";
import { CommentInputModel } from "../../models/comments/CommentInputModel";
import { validID } from "../db";

export class CommentsRepository {

    async findCommentByID(id: string): Promise<CommentDBModel | null> {
        if (!validID(id)) return null

        return CommentModel.findById(id)
    }

    async updatedComment(id: string, body: CommentInputModel): Promise<boolean> {
        if (!validID(id)) return false

        const result = await CommentModel.updateOne(
            { _id: id },
            { content: body.content }
        )

        return result.matchedCount === 1
    }

    async deleteCommentByID(id: string): Promise<boolean> {
        if (!validID(id)) return false

        const result = await CommentModel.deleteOne({ _id: id })
        return result.deletedCount === 1
    }

    async deleteComments() {
        await CommentModel.deleteMany({})
    }

    async createCommentByPostId(postId: string, userId: string, userLogin: string, body: CommentInputModel): Promise<CommentDBModel> {

        const newCommetn: CommentDBModel = {
            _id: new ObjectId(),
            content: body.content,
            commentatorInfo: {
                userId: new ObjectId(userId),
                userLogin: userLogin
            },
            createdAt: new Date().toISOString(),
            postId: new ObjectId(postId)
        }

        const result = await CommentModel.create(newCommetn)
        return newCommetn
    }
}