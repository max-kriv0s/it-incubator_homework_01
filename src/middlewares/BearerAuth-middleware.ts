import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { jwtService } from "../application/jwt-service";

export const BearerAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
  
    if (!token) return res.sendStatus(StatusCodes.UNAUTHORIZED)

    const dataToken = await jwtService.ReadAndCheckTokenAccessToken(token)
    if (dataToken && dataToken.userId) {
        req.userId = dataToken.userId
        next()
    } else {
        res.sendStatus(StatusCodes.UNAUTHORIZED)
    }
}

export const BearerMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
  
    if (!token) return next()

    const dataToken = await jwtService.ReadAndCheckTokenAccessToken(token)
    if (dataToken && dataToken.userId) {
        req.userId = dataToken.userId
    }
        
    next()
}