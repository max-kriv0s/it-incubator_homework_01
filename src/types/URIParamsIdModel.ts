type URIParamsModel<T extends string> = {
    [key in T]: string
}

export type URIParamsIdModel = URIParamsModel<'id'>
export type URIParamsCommentIdModel = URIParamsModel<'commentId'>