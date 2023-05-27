import { BlogDbModel } from "../models/blogs/BlogModel";
import { BlogViewModel } from "../models/blogs/BlogViewModel";
import { CommentDBModel } from "../models/comments/CommentModel";
import { CommentViewModel } from "../models/comments/CommentViewModel";
import { SecurityDevicesDBModel } from "../models/security-devices/SecurityDevicesModel";
import { SecurityDevicesViewModel } from "../models/security-devices/SecurityDevicesViewModel";
import { PostDbModel } from "../models/posts/PostModel";
import { PostViewModel } from "../models/posts/PostViewModel";
import { UserDBModel } from "../models/users/UserModel";
import { UserViewModel } from "../models/users/UserViewModel";
import { APIErrorResult } from "../types/APIErrorModels";
import { jestCookiesType } from "../types/JestCookiesType";

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
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt
    }
}

export function securityDevicesDBTosecurityDevicesView(device: SecurityDevicesDBModel): SecurityDevicesViewModel {
    return {
        ip: device.ip,
        title: device.title,
        lastActiveDate: device.lastActiveDate,
        deviceId: device._id.toString()
    }
}

export function commentDBToCommentView(comment: CommentDBModel): CommentViewModel {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId.toString(),
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt
    }
}

export function GetDescriptionOfError(message: string, field: string): APIErrorResult {
    return {
        errorsMessages: [
            {
                message: message,
                field: field
            }
        ]
    }
}

export function parseCookie(jestCookies: String[]) {
    const cookies = jestCookies.reduce((acc: jestCookiesType, curr) => {
        const res = curr.split(';', 1)[0].split('=', 2)
        acc[res[0].trim()] = res[1].trim()
        return acc
    }, {})
    return cookies
}

export function userAgentFromRequest(reqUserAgent: string | undefined): string {
    return reqUserAgent ? reqUserAgent : 'Chrome'
}