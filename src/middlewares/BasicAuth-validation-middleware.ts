import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

const admin = process.env.ADMIN_LOGIN ? process.env.ADMIN_LOGIN : ''

export const BasicAuthValidate = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization && req.headers.authorization === admin) {
        next()
    } else {
        res.sendStatus(StatusCodes.UNAUTHORIZED)
    }
}