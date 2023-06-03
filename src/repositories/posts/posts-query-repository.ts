import { ObjectId } from "mongodb";
import { BlogModel } from "../../models/blogs/BlogModel";
import { PostDbModel, PostModel } from "../../models/posts/PostModel";
import { PostViewModel } from "../../models/posts/PostViewModel";
import { PaginatorPostViewTypes } from "../../types/PaginatorType";
import { QueryParamsModels } from "../../types/QueryParamsModels";
import { BlogsRepository } from "../blogs/blogs-repository";
import { validID } from "../db";


export class PostsQueryRepository {

    async getPostsView(queryParams: QueryParamsModels): Promise<PaginatorPostViewTypes> {

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
            items: postsDB.map(post => this.postDBToPostView(post))
        }
    }

    async findPostsByBlogId(blogId: string, queryParams: QueryParamsModels): Promise<PaginatorPostViewTypes | null> {
        const pageNumber: number = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize: number = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy: string = queryParams.sortBy ? queryParams.sortBy : 'createdAt'
        const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc'

        if (!validID(blogId)) return null

        const blog = await BlogModel.findById(blogId)
        if (!blog) return null

        const totalCount: number = await PostModel.countDocuments({ blogId })

        const skip = (pageNumber - 1) * pageSize
        const postsDB: PostDbModel[] = await PostModel.find({blogId}, null, 
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
            items: postsDB.map(post => this.postDBToPostView(post))
        }
    }

    async getPostViewById(id: string | ObjectId): Promise<PostViewModel | null> {
        if (typeof id === 'string' && !validID(id)) return null
        
        const postDB = await PostModel.findById(id).exec()
        if (!postDB) return null
        
        return this.postDBToPostView(postDB)
    }

    postDBToPostView(post: PostDbModel): PostViewModel {
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId.toString(),
            blogName: post.blogName,
            createdAt: post.createdAt
        }
    }
}