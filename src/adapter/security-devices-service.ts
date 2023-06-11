import { ObjectId } from "mongodb";
import { SecurityDevicesDBModel } from "../domain/security-devices/SecurityDevicesModel";
import { SecurityDevicesRepository } from "../infrastructure/repositories/security-devices/security-devices-repository";
import { DataTokenModel } from "../domain/token/DataTokenModel";
import { UserDBModel } from "../domain/users/UserModel";
import { UpdateTokenModel } from "../domain/auth/UpdateTokenModel";
import { jwtService } from "../application/jwt-service";
import { userAgentFromRequest } from "../utils/utils";
import { inject, injectable } from "inversify";


@injectable()
export class SecurityDevicesService {
    constructor(
        @inject(SecurityDevicesRepository) protected securityDevicesRepository: SecurityDevicesRepository
    ) { }

    async deleteAllDevicesSessionsByUserID(userId: string, deviceId: string): Promise<boolean> {
        return this.securityDevicesRepository.deleteAllDevicesSessionsByUserID(userId, deviceId)
    }

    async logoutUserSessionByDeviceID(deviceID: string, userId: string): Promise<boolean> {
        return this.securityDevicesRepository.deleteUserSessionByDeviceID(deviceID, userId)
    }

    async deleteUserSessionByDeviceID(deviceID: string, userId: string): Promise<boolean | null> {
        const securitySession = await this.securityDevicesRepository.findSessionByDeviceID(deviceID)
        if (!securitySession) return false

        if (securitySession.userId.toString() !== userId) return null

        return this.securityDevicesRepository.deleteUserSessionByDeviceID(deviceID, userId)
    }

    async getDeviceID(deviceId: string = ''): Promise<ObjectId | null> {
        return this.securityDevicesRepository.getDeviceID(deviceId)
    }

    async createSecurityDeviceSession(securityDevice: SecurityDevicesDBModel): Promise<boolean> {
        return this.securityDevicesRepository.createSecurityDeviceSession(securityDevice)
    }

    async updateSecurityDeviceSession(securityDevice: SecurityDevicesDBModel): Promise<boolean> {
        return this.securityDevicesRepository.updateSecurityDeviceSession(securityDevice)
    }

    async verifySecurityDeviceByToken(dataToken: DataTokenModel): Promise<boolean> {
        const securitySession = await this.securityDevicesRepository.findUserSessionByDeviceID(dataToken.userId, dataToken.deviceId)
        if (!securitySession) return false

        return securitySession.lastActiveDate === dataToken.issuedAd
            && securitySession._id.toString() === dataToken.deviceId
            && securitySession.userId.toString() === dataToken.userId
    }

    async createUserTokens(user: UserDBModel, ip: string, reqUserAgent: string | undefined): Promise<UpdateTokenModel | null> {

        const deviceIdObject = await this.getDeviceID()
        if (!deviceIdObject) return null

        const refreshToken = await jwtService.createJWTRefreshToken(user, deviceIdObject)
        const accessToken = await jwtService.createJWTAccessToken(user)

        const securityDevice = await this.getSecurityDevice(user, deviceIdObject, refreshToken,
            ip, reqUserAgent)
        if (!securityDevice) return null

        const isCreatedSecurityDevice = await this.createSecurityDeviceSession(securityDevice)
        if (!isCreatedSecurityDevice) return null

        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

    async updateUserTokens(user: UserDBModel, deviceId: string, ip: string,
        reqUserAgent: string | undefined): Promise<UpdateTokenModel | null> {

        const deviceIdObject = await this.getDeviceID(deviceId)
        if (!deviceIdObject) return null

        const refreshToken = await jwtService.createJWTRefreshToken(user, deviceIdObject)
        const accessToken = await jwtService.createJWTAccessToken(user)

        const securityDevice = await this.getSecurityDevice(user, deviceIdObject, refreshToken,
            ip, reqUserAgent)
        if (!securityDevice) return null

        const isCreatedSecurityDevice = await this.updateSecurityDeviceSession(securityDevice)
        if (!isCreatedSecurityDevice) return null

        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

    async getSecurityDevice(user: UserDBModel, deviceIdObject: ObjectId, refreshToken: string, ip: string,
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