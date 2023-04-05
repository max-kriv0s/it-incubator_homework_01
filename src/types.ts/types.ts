import {Request} from "express"

export type URIParams<T> = Request<T>
export type RequestsWithBody<T> = Request<{},{},T>
export type RequestsWithParamsAndBody<P, B> = Request<P,{},B>
