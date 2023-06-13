import { LikeDetailsViewModel } from "../likes/LikeDetailsViewModel"
import { LikeStatus } from "../likes/LikeModel"

export type ExtendedLikesInfoViewModel = {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus
    newestLikes: LikeDetailsViewModel[]
}

export type PostViewModel = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    extendedLikesInfo: ExtendedLikesInfoViewModel
}
