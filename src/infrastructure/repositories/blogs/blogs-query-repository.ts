import { ObjectId } from "mongodb"
import { validID } from "../db"
import { injectable } from "inversify"
import { QueryParamsModels } from "../../../types/QueryParamsModels"
import { PaginatorBlogViewTypes } from "../../../types/PaginatorType"
import { BlogDbModel, BlogModel } from "../../../domain/blogs/BlogModel"
import { BlogViewModel } from "../../../domain/blogs/BlogViewModel"


@injectable()
export class BlogsQueryRepository {

    async getBlogsView(queryParams: QueryParamsModels): Promise<PaginatorBlogViewTypes> {

        const searchNameTerm: string | null = queryParams.searchNameTerm ? queryParams.searchNameTerm : null
        const pageNumber: number = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize: number = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy: string = queryParams.sortBy ? queryParams.sortBy : 'createdAt'
        const sortDirection: string = queryParams.sortDirection ? queryParams.sortDirection : 'desc'

        const filter: any = {}
        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' }
        }

        const totalCount: number = await BlogModel.countDocuments(filter)

        const skip = (pageNumber - 1) * pageSize
        const blogsDB: BlogDbModel[] = await BlogModel.find(filter, null, 
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
            items: blogsDB.map(blog => this.blogDBToBlogView(blog))
        }
    }

    async getBlogViewById(id: string | ObjectId): Promise<BlogViewModel | null> {
        if (typeof id === 'string' && !validID(id)) return null
        
        const blogDB = await BlogModel.findById(id).exec()
        if (!blogDB) return null

        return this.blogDBToBlogView(blogDB)
    }

    blogDBToBlogView(blog: BlogDbModel): BlogViewModel {
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    }

}