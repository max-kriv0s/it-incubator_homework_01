import { BlogDbModel } from "../domain/blogs/BlogModel"
import { BlogViewModel } from "../domain/blogs/BlogViewModel"
import { CommentDBModel } from "../domain/comments/CommentModel"
import { CommentViewModel } from "../domain/comments/CommentViewModel"
import { PostDbModel } from "../domain/posts/PostModel"
import { PostViewModel } from "../domain/posts/PostViewModel"
import { UserDBModel } from "../domain/users/UserModel"
import { UserViewModel } from "../domain/users/UserViewModel"

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