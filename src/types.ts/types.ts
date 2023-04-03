import {Request} from "express"

export type RequestsWithBody<T> = Request<{},{},T>