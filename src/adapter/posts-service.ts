import { PostCreateModel } from "../domain/posts/PostCreateModel"
import { PostUpdateModel } from "../domain/posts/PostUpdateModel"
import { BlogPostCreateModel } from "../domain/blogs/BlogPostCreateModel"
import { PostDbModel, PostModel } from "../domain/posts/PostModel"
import { PostsRepository } from "../infrastructure/repositories/posts/posts-repository"
import { BlogsRepository } from "../infrastructure/repositories/blogs/blogs-repository"
import { UsersRepository } from "../infrastructure/repositories/users/users-repository"
import { CommentsRepository } from "../infrastructure/repositories/comments/comments-repository"
import { inject, injectable } from "inversify"
import { CommentDBModel } from "../domain/comments/CommentModel"
import { CommentInputModel } from "../domain/comments/CommentInputModel"
import { LikeStatus } from "../domain/likes/LikeModel"
import { MyResult, ResultCode } from "../types/types"
import { getMyResult } from "../utils/utils"
import { HydratedLikePost, ILikePost } from "../domain/likes/LikePostTypes"
import { LikePostRepository } from "../infrastructure/repositories/likes/likes-posts-repository"
import { LikePostModel } from "../domain/likes/LikePostSchema"
import { HydratedDocument } from "mongoose"


@injectable()
export class PostsService {
    constructor(
        @inject(PostsRepository) protected postsRepository: PostsRepository,
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(CommentsRepository) protected commentsRepository: CommentsRepository,
        @inject(LikePostRepository) protected likePostRepository: LikePostRepository
    ) { }

    async findPostById(id: string): Promise<PostDbModel | null> {
        return this.postsRepository.findPostById(id)
    }

    async createPost(body: PostCreateModel): Promise<PostDbModel | null> {
        const blog = await this.blogsRepository.findBlogById(body.blogId)
        if (!blog) return null

        return this.postsRepository.createPost(body, blog.name)
    }

    async createPostByBlogId(blogId: string, blogName: string, body: BlogPostCreateModel): Promise<PostDbModel> {
        return this.postsRepository.createPostByBlogId(blogId, blogName, body)
    }

    async updatePost(id: string, body: PostUpdateModel): Promise<boolean> {
        const blog = await this.blogsRepository.findBlogById(body.blogId)
        if (!blog) return false

        return this.postsRepository.updatePost(id, body, blog._id, blog.name)
    }

    async deletePostById(id: string): Promise<boolean> {
        return this.postsRepository.deletePostById(id)
    }

    async createCommentByPostID(postId: string, userId: string, body: CommentInputModel): Promise<CommentDBModel | null> {
        const post = await this.findPostById(postId)
        if (!post) return null

        const user = await this.usersRepository.findUserById(userId)
        if (!user) return null

        return this.commentsRepository.createCommentByPostId(postId, userId, user.accountData.login, body)
    }

    async likeStatusByPostID(postId: string, userId: string, likeStatus: LikeStatus): Promise<MyResult<null>> {
        
        const post = await this.postsRepository.findPostModelById(postId)
        if (!post) return getMyResult(ResultCode.notFound)

        const like = await this.likePostRepository.findLikeByPostIdAndUserId(postId, userId)
        if (like) {
            await this.updateLikeByPost(post, like, likeStatus)
        } else {
            await this.createLikeByPost(post, userId, likeStatus)
        }

        await this.postsRepository.save(post)
        return getMyResult(ResultCode.success)
    }

    async createLikeByPost(post: HydratedDocument<PostDbModel>, userId: string, likeStatus: LikeStatus) {
        const user = await this.usersRepository.findUserById(userId)
        if (!user) return getMyResult(ResultCode.notFound)

        const like = await LikePostModel.createLike(post._id, user._id, user.accountData.login, likeStatus) 
        
        if (likeStatus === LikeStatus.Like) post.likesCount += 1
        
        if (likeStatus === LikeStatus.Dislike) post.dislikesCount += 1
    }

    async updateLikeByPost(post: HydratedDocument<PostDbModel>, like: HydratedLikePost, likeStatus: LikeStatus) {
        
        const oldStatus = like.getStatus()
        if (likeStatus === oldStatus) return

        like.setStatus(likeStatus)
        await this.likePostRepository.save(like)

        const fromLikeToNone = oldStatus === LikeStatus.None && likeStatus === LikeStatus.Like
        if (fromLikeToNone) post.likesCount -= 1

        const fromDislikeToNone = oldStatus === LikeStatus.None && likeStatus === LikeStatus.Dislike
        if (fromDislikeToNone) post.dislikesCount -= 1

        const fromLikeToDislike = oldStatus === LikeStatus.Like && likeStatus === LikeStatus.Dislike
        if (fromLikeToDislike) {
            post.likesCount -= 1
            post.dislikesCount += 1
        }

        const fromDislikeToLike = oldStatus === LikeStatus.Dislike && likeStatus === LikeStatus.Like
        if (fromDislikeToLike) {
            post.dislikesCount -= 1
            post.likesCount += 1
        }
    }
}