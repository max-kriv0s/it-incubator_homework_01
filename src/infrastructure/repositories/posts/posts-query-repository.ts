import { ObjectId } from "mongodb";
import { validID } from "../db";
import { injectable } from "inversify";
import { QueryParamsModels } from "../../../types/QueryParamsModels";
import { PaginatorPostViewTypes } from "../../../types/PaginatorType";
import { PostDbModel, PostModel } from "../../../domain/posts/PostModel";
import { BlogModel } from "../../../domain/blogs/BlogModel";
import { PostViewModel } from "../../../domain/posts/PostViewModel";
import { LikeStatus } from "../../../domain/likes/LikeModel";
import { LikePostModel } from "../../../domain/likes/LikePostSchema";
import { LikeDetailsViewModel } from "../../../domain/likes/LikeDetailsViewModel";


@injectable()
export class PostsQueryRepository {

    async getPostsView(queryParams: QueryParamsModels, userId?: string): Promise<PaginatorPostViewTypes> {

        const pageNumber: number = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize: number = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy: string = queryParams.sortBy ? queryParams.sortBy : 'createdAt'
        const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc'

        const totalCount: number = await PostModel.countDocuments({})

        const skip = (pageNumber - 1) * pageSize
        const postsDB: PostDbModel[] = await PostModel.find({}, null,
            {
                sort: { [sortBy]: sortDirection === 'asc' ? 1 : -1 },
                skip: skip,
                limit: pageSize
            }).exec()

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: await Promise.all(postsDB.map(post => this.postDBToPostView(post, userId)))
        }
    }

    async findPostsByBlogId(blogId: string, queryParams: QueryParamsModels, userId?: string): Promise<PaginatorPostViewTypes | null> {
        const pageNumber: number = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize: number = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy: string = queryParams.sortBy ? queryParams.sortBy : 'createdAt'
        const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc'

        if (!validID(blogId)) return null

        const blog = await BlogModel.findById(blogId)
        if (!blog) return null

        const totalCount: number = await PostModel.countDocuments({ blogId })

        const skip = (pageNumber - 1) * pageSize
        const postsDB: PostDbModel[] = await PostModel.find({ blogId }, null,
            {
                sort: { [sortBy]: sortDirection === 'asc' ? 1 : -1 },
                skip: skip,
                limit: pageSize
            }).exec()

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: await Promise.all(postsDB.map(post => this.postDBToPostView(post, userId)))
        }
    }

    async getPostViewById(id: string | ObjectId, userId?: string): Promise<PostViewModel | null> {
        if (typeof id === 'string' && !validID(id)) return null

        const postDB = await PostModel.findById(id).exec()
        if (!postDB) return null

        return this.postDBToPostView(postDB, userId)
    }

    async postDBToPostView(post: PostDbModel, userId?: string): Promise<PostViewModel> {
        let statusMyLike = LikeStatus.None

        if (userId && validID(userId)) {
            // тут лучше через репозиторий или напрямую через LikeModel? Точно через модель
            const myLike = await LikePostModel.findOne({ postId: post._id, userId: userId }).exec()
            if (myLike) statusMyLike = myLike.status
        }

        const newestLikes: LikeDetailsViewModel[] = await LikePostModel.find({ postId: post._id, status: LikeStatus.Like },
            ['addedAt', 'userId', 'login', '-_id'],
            {
                sort: { addedAt: -1 },
                limit: 3
            }
        ).lean()

        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId.toString(),
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: post.likesCount,
                dislikesCount: post.dislikesCount,
                myStatus: statusMyLike,
                newestLikes: newestLikes
            }
        }
    }
}