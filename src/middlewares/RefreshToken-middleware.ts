import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { jwtService } from "../application/jwt-service";
import { usersService } from "../domain/users-service";

export const RefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(StatusCodes.UNAUTHORIZED)

    const userId = await jwtService.findUserIDByRefreshToken(refreshToken)
    if (!userId) return res.sendStatus(StatusCodes.UNAUTHORIZED)

    const user = await usersService.findUserById(userId)
    if (!user || user.refreshToken !== refreshToken) return res.sendStatus(StatusCodes.UNAUTHORIZED)

    req.userId = userId
    next()
    
}