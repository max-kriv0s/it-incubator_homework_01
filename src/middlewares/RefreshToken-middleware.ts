import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { jwtService } from "../application/jwt-service";
import { container } from "../composition-root";
import { SecurityDevicesService } from "../adapter/security-devices-service";


const securityDevicesService = container.resolve(SecurityDevicesService)

export const RefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(StatusCodes.UNAUTHORIZED)

    const dataRefreshToken = await jwtService.ReadAndCheckTokenRefreshToken(refreshToken)
    if (!dataRefreshToken || !dataRefreshToken.userId || !dataRefreshToken.deviceId) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED)
    }

    const isVerify = await securityDevicesService.verifySecurityDeviceByToken(dataRefreshToken)
    if (!isVerify) return res.sendStatus(StatusCodes.UNAUTHORIZED)

    req.userId = dataRefreshToken.userId
    req.deviceId = dataRefreshToken.deviceId

    next()
    
}