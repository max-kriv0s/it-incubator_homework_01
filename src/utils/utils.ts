import { BlogDbModel } from "../models/blogs/BlogDbModel";
import { BlogViewModel } from "../models/blogs/BlogViewModel";
import { PostDbModel } from "../models/posts/PostDbModel";
import { PostViewModel } from "../models/posts/PostViewModel";
import { UserDBModel } from "../models/users/UserDBModel";
import { UserViewModel } from "../models/users/UserViewModel";
import { DataBaseModel } from "../types/DataBaseMode";

export function randomString(n: number) {
    let rnd = '';
    while (rnd.length < n)
        rnd += Math.random().toString(36).substring(2);
    return rnd.substring(0, n);
}

export function publicationDate(createdAt: Date): string {
    const newDate = createdAt
    newDate.setHours(newDate.getHours() + 24)
    return newDate.toISOString()
}

export function newStringId() {
    return (new Date()).getTime().toString()
}

export function newNumberId() {
    return +(new Date())
}

export function blogDBToBlogView(blog: BlogDbModel): BlogViewModel {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    }
}

export function postDBToPostView(post: PostDbModel): PostViewModel {
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

export function userDBToUserView(user: UserDBModel): UserViewModel {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}