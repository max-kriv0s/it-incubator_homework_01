import { LikeStatus } from "../likes/LikeModel"

export type CommentViewModel = {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: string
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: LikeStatus
    }
}