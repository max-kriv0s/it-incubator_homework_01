import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { jwtService } from "../application/jwt-service";

export const BearerAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
  
    if (!token) return res.sendStatus(StatusCodes.UNAUTHORIZED)

    const userId = await jwtService.getUserIdByToken(token)
    if (userId) {
        req.userId = userId.toString()
        next()
    }

    res.sendStatus(StatusCodes.UNAUTHORIZED)    
}