import { ObjectId } from "mongodb";
import { SecurityDevicesDBModel } from "../models/security-devices/SecurityDevicesDBModel";
import { securityDevicesRepository } from "../repositories/security-devices-repository";
import { DataTokenModel } from "../models/token/DataTokenModel";
import { UserDBModel } from "../models/users/UserDBModel";
import { UpdateTokenModel } from "../models/auth/UpdateTokenModel";
import { jwtService } from "../application/jwt-service";
import { userAgentFromRequest } from "../utils/utils";


export const securityDevicesService = {

    async getAllDevicesSessionsByUserID(userId: string): Promise<SecurityDevicesDBModel[] | null> {
        return await securityDevicesRepository.getAllDevicesSessionsByUserID(userId)
    },

    async deleteAllDevicesSessionsByUserID(userId: string, deviceId: string): Promise<boolean> {
        return await securityDevicesRepository.deleteAllDevicesSessionsByUserID(userId, deviceId)
    },

    async logoutUserSessionByDeviceID(deviceID: string, userId: string): Promise<boolean> {
        const isDeleted = await securityDevicesRepository.deleteUserSessionByDeviceID(deviceID, userId)
        return isDeleted
    },

    async deleteUserSessionByDeviceID(deviceID: string, userId: string): Promise<boolean | null> {
        const securitySession = await securityDevicesRepository.findSessionByDeviceID(deviceID)
        if (!securitySession) return false
        
        if (securitySession.userId.toString() !== userId) return null

        const isDeleted = await securityDevicesRepository.deleteUserSessionByDeviceID(deviceID, userId)
        return isDeleted
    },

    async getDeviceID(deviceId: string = ''): Promise<ObjectId | null> {
        return await securityDevicesRepository.getDeviceID(deviceId)
    },

    async createSecurityDeviceSession(securityDevice: SecurityDevicesDBModel): Promise<boolean> {
        return await securityDevicesRepository.createSecurityDeviceSession(securityDevice)
    },

    async updateSecurityDeviceSession(securityDevice: SecurityDevicesDBModel): Promise<boolean> {
        return await securityDevicesRepository.updateSecurityDeviceSession(securityDevice)
    }, 

    async verifySecurityDeviceByToken(dataToken: DataTokenModel): Promise<boolean> {
        const securitySession = await securityDevicesRepository.findUserSessionByDeviceID(dataToken.userId, dataToken.deviceId)
        if (!securitySession) return false

        return securitySession.lastActiveDate === dataToken.issuedAd 
            && securitySession._id.toString() === dataToken.deviceId 
            && securitySession.userId.toString() === dataToken.userId
    },

    async createUserTokens(user: UserDBModel, ip: string, reqUserAgent: string | undefined):Promise<UpdateTokenModel | null> {
        
        const deviceIdObject = await securityDevicesService.getDeviceID()
        if (!deviceIdObject) return null
        
        const refreshToken = await jwtService.createJWTRefreshToken(user, deviceIdObject)
        const accessToken = await jwtService.createJWTAccessToken(user)

        const securityDevice = await this.getSecurityDevice(user, deviceIdObject, refreshToken, 
                ip, reqUserAgent)
        if (!securityDevice) return null

        const isCreatedSecurityDevice = await securityDevicesService.createSecurityDeviceSession(securityDevice)
        if (!isCreatedSecurityDevice) return null

        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    },

    async updateUserTokens(user: UserDBModel, deviceId: string, ip: string, 
        reqUserAgent: string | undefined): Promise<UpdateTokenModel | null> {

        const deviceIdObject = await securityDevicesService.getDeviceID(deviceId)
        if (!deviceIdObject) return null

        const refreshToken = await jwtService.createJWTRefreshToken(user, deviceIdObject)
        const accessToken = await jwtService.createJWTAccessToken(user)

        const securityDevice = await this.getSecurityDevice(user, deviceIdObject, refreshToken, 
            ip, reqUserAgent)
        if (!securityDevice) return null

        const isCreatedSecurityDevice = await securityDevicesService.updateSecurityDeviceSession(securityDevice)
        if (!isCreatedSecurityDevice) return null

        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    },
    
    async getSecurityDevice(user: UserDBModel, deviceIdObject: ObjectId, refreshToken: string ,ip: string, 
        reqUserAgent: string | undefined): Promise<SecurityDevicesDBModel | null> {

        const decodeRefreshToken = await jwtService.ReadAndCheckTokenRefreshToken(refreshToken)
        if (!decodeRefreshToken) return null

        if (!jwtService.validDebidRefreshToken(decodeRefreshToken, deviceIdObject, user._id)) return null
        
        const userAgent = userAgentFromRequest(reqUserAgent)

        const securityDevice: SecurityDevicesDBModel = ({
            _id: deviceIdObject,
            ip: ip,
            title: userAgent,
            lastActiveDate: decodeRefreshToken.issuedAd,
            expirationTime: decodeRefreshToken.expirationTime,
            userId: user._id
        })

        return securityDevice
    }
}