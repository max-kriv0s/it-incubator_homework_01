import { ObjectId } from "mongodb";
import { CommentDBModel } from "../models/comments/CommentDBModel";
import { commentsCollection, usersCollection } from "./db";
import { CommentUpdateModel } from "../models/comments/CommentUpdateModel";

export const commentsRepository = {

    async findCommentByID(id: string): Promise<CommentDBModel | null> {
        if (!ObjectId.isValid(id)) return null

        const comment = commentsCollection.findOne({ _id: new ObjectId(id) })
        return comment
    }, 

    async updatedComment(id: string, body: CommentUpdateModel): Promise<boolean> {
        if (!ObjectId.isValid(id)) return false

        const result = await commentsCollection.updateOne(
            { _id: new ObjectId(id) }, 
            {$set: 
                {content: body.content}
            }
        )

        return result.matchedCount === 1
    },

    async deleteCommentByID(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) return false

        const result = await commentsCollection.deleteOne({ _id: new ObjectId(id) })
        return result.deletedCount === 1
    },

    async deleteComments() {
        await usersCollection.deleteMany({})
    }
}