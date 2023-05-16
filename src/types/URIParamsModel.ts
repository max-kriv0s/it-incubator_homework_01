type URIParamsModel<T extends string> = {
    [key in T]: string
}

export type URIParamsIdModel = URIParamsModel<'id'>
export type URIParamsCommentIdModel = URIParamsModel<'commentId'>
export type URIParamsPostIdCommentsModel = URIParamsModel<'postId'>
export type URIParamsServiceDeviceIDModel = URIParamsModel<'deviceId'>