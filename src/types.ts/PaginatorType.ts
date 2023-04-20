import { BlogDbModel } from "../models/blogs/BlogDbModel"
import { BlogViewModel } from "../models/blogs/BlogViewModel"
import { PostDbModel } from "../models/posts/PostDbModel"
import { PostViewModel } from "../models/posts/PostViewModel"

export type PaginatorTypes<T> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: T[]
}

export type PaginatorBlogViewTypes = PaginatorTypes<BlogViewModel>
export type PaginatorBlogDbTypes = PaginatorTypes<BlogDbModel>
export type PaginatorPostViewTypes = PaginatorTypes<PostViewModel>
export type PaginatorPostDbTypes = PaginatorTypes<PostDbModel>