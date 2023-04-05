import {Request} from "express"

export type RequestsURIParams<T> = Request<T>
export type RequestsWithBody<T> = Request<{},{},T>
export type RequestsWithParamsAndBody<P, B> = Request<P,{},B>
