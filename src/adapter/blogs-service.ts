import { inject, injectable } from "inversify"
import { BlogCreateModel } from "../domain/blogs/BlogCreateModel"
import { BlogDbModel } from "../domain/blogs/BlogModel"
import { BlogPostCreateModel } from "../domain/blogs/BlogPostCreateModel"
import { BlogUpdateModel } from "../domain/blogs/BlogUpdateModel"
import { PostDbModel } from "../domain/posts/PostModel"
import { BlogsRepository } from "../infrastructure/repositories/blogs/blogs-repository"
import { PostsRepository } from "../infrastructure/repositories/posts/posts-repository"


@injectable()
export class BlogsService {
    constructor(
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
        @inject(PostsRepository) protected postsRepository: PostsRepository
    ) { }

    async findBlogById(id: string): Promise<BlogDbModel | null> {
        return this.blogsRepository.findBlogById(id)
    }

    async createBlog(body: BlogCreateModel): Promise<BlogDbModel> {
        return this.blogsRepository.createBlog(body)
    }

    async updateBlog(id: string, body: BlogUpdateModel): Promise<boolean> {
        return this.blogsRepository.updateBlog(id, body)
    }

    async deleteBlogById(id: string): Promise<boolean> {
        return this.blogsRepository.deleteBlogById(id)
    }

    // async findPostsByBlogId(blogId: string, queryParams: QueryParamsModels): Promise<PaginatorPostDbTypes | null> {
    //     const blog = await this.blogsRepository.findBlogById(blogId)
    //     if (!blog) return null

    //     const posts = await postsService.findPostsByBlogId(blogId, queryParams)
    //     return posts
    // }

    async createPostByBlogId(blogId: string, body: BlogPostCreateModel): Promise<PostDbModel | null> {
        const blog = await this.blogsRepository.findBlogById(blogId)
        if (!blog) return null

        return this.postsRepository.createPostByBlogId(blogId, blog.name, body)
    }
}