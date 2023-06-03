import { ObjectId } from "mongodb"
import { PostDbModel, PostModel } from "../../models/posts/PostModel"
import { PostUpdateModel } from "../../models/posts/PostUpdateModel"
import { PostCreateModel } from "../../models/posts/PostCreateModel"
import { BlogPostCreateModel } from "../../models/blogs/BlogPostCreateModel"
import { validID } from "../db"


export class PostsRepository {

    async findPostById(id: string): Promise<PostDbModel | null> {
        if (!validID(id)) return null

        return PostModel.findById(id)
    }

    async createPostInDB(newPost: PostDbModel): Promise<PostDbModel> {
        return PostModel.create(newPost)
    }

    async createPost(body: PostCreateModel, blogName: string): Promise<PostDbModel> {

        const newPost: PostDbModel = {
            _id: new ObjectId(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: new ObjectId(body.blogId),
            blogName: blogName,
            createdAt: new Date().toISOString()
        }

        return this.createPostInDB(newPost)
    }

    async createPostByBlogId(blogId: string, blogName: string, body: BlogPostCreateModel): Promise<PostDbModel> {

        const newPost: PostDbModel = {
            _id: new ObjectId(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: new ObjectId(blogId),
            blogName: blogName,
            createdAt: new Date().toISOString()
        }

        return this.createPostInDB(newPost)
    }

    async updatePost(id: string, body: PostUpdateModel, blogId: ObjectId, blogName: string): Promise<boolean> {
        if (!validID(id)) return false

        const result = await PostModel.updateOne(
            { _id: id },
            {
                $set: {
                    title: body.title,
                    shortDescription: body.shortDescription,
                    content: body.content,
                    blogId: blogId,
                    blogName: blogName
                }
            }
        )

        return result.matchedCount === 1
    }

    async deletePostById(id: string): Promise<boolean> {
        if (!validID(id)) return false

        const result = await PostModel.deleteOne({ _id: id })
        return result.deletedCount === 1
    }

    async deletePosts() {
        await PostModel.deleteMany({})
    }
}