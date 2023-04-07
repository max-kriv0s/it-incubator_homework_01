import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"


const admin = 'Basic YWRtaW46cXdlcnR5'

export const BasicAuthValidate = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization && req.headers.authorization === admin) {
        next()
    } else {
        res.sendStatus(StatusCodes.UNAUTHORIZED)
    }
}