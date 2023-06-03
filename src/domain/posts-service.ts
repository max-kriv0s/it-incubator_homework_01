import { PostCreateModel } from "../models/posts/PostCreateModel"
import { PostUpdateModel } from "../models/posts/PostUpdateModel"
import { BlogPostCreateModel } from "../models/blogs/BlogPostCreateModel"
import { PostDbModel } from "../models/posts/PostModel"
import { CommentDBModel } from "../models/comments/CommentModel"
import { CommentInputModel } from "../models/comments/CommentInputModel"
import { PostsRepository } from "../repositories/posts/posts-repository"
import { BlogsRepository } from "../repositories/blogs/blogs-repository"
import { UsersRepository } from "../repositories/users/users-repository"
import { CommentsRepository } from "../repositories/comments-repository/comments-repository"

export class PostsService {
    constructor(protected postsRepository: PostsRepository,
                protected blogsRepository: BlogsRepository,
                protected usersRepository: UsersRepository,
                protected commentsRepository: CommentsRepository
    ) {}

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
}