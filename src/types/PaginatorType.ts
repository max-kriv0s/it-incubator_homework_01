import { BlogDbModel } from "../models/blogs/BlogModel"
import { BlogViewModel } from "../models/blogs/BlogViewModel"
import { CommentDBModel } from "../models/comments/CommentModel"
import { CommentViewModel } from "../models/comments/CommentViewModel"
import { PostDbModel } from "../models/posts/PostModel"
import { PostViewModel } from "../models/posts/PostViewModel"
import { UserDBModel } from "../models/users/UserModel"
import { UserViewModel } from "../models/users/UserViewModel"

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

export type PaginatorUserViewModel = PaginatorTypes<UserViewModel>
export type PaginatorUserDBModel = PaginatorTypes<UserDBModel>

export type PaginatorCommentViewModel = PaginatorTypes<CommentViewModel>
export type PaginatorCommentDBModel = PaginatorTypes<CommentDBModel>