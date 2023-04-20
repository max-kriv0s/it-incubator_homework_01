import {Request} from "express"

export type RequestsURIParams<T> = Request<T>
export type RequestsWithBody<T> = Request<{},{},T>
export type RequestsWithParamsAndBody<P, B> = Request<P,{},B>
export type RequestsWithParamsAndQuery<P, Q> = Request<P, {}, {}, Q>
export type RequestsQuery<Q> = Request<{}, {}, {}, Q>
