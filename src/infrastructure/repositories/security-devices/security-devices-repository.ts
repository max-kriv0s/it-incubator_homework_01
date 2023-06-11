import { ObjectId } from "mongodb"
import { getIdDB, validID } from "../db"
import { injectable } from "inversify"
import { SecurityDevicesDBModel, SecurityDevicesModel } from "../../../domain/security-devices/SecurityDevicesModel"


@injectable()
export class SecurityDevicesRepository {
    
    async deleteAllDevicesSessions() {
        await SecurityDevicesModel.deleteMany({})
    }

    async deleteAllDevicesSessionsByUserID(userId: string, deviceId: string): Promise<boolean> {
        if (!validID(userId) || !validID(deviceId)) return false

        const result = await SecurityDevicesModel.deleteMany({
            userId,
            _id: { $ne: deviceId }
        })

        return result.acknowledged
    }

    async deleteUserSessionByDeviceID(deviceID: string, userId: string): Promise<boolean> {
        if (!validID(deviceID) || !validID(userId)) return false

        const result = await SecurityDevicesModel.deleteOne({
            _id: deviceID,
            userId
        })

        return result.deletedCount === 1
    }

    async getDeviceID(deviceId: string): Promise<ObjectId | null> {
        return getIdDB(deviceId)
    }

    async createSecurityDeviceSession(securityDevice: SecurityDevicesDBModel): Promise<boolean> {
            await SecurityDevicesModel.create(securityDevice)
            return true
    }

    async updateSecurityDeviceSession(securityDevice: SecurityDevicesDBModel): Promise<boolean> {
            const { _id, ...rest } = { ...securityDevice }

            const result = await SecurityDevicesModel.updateOne({ _id }, {
                ip: rest.ip,
                title: rest.title,
                lastActiveDate: rest.lastActiveDate,
                expirationTime: rest.expirationTime,
                userId: rest.userId
            })

            return result.matchedCount === 1
    }

    async findUserSessionByDeviceID(userId: string, deviceId: string): Promise<SecurityDevicesDBModel | null> {
        if (!validID(userId) || !validID(deviceId)) return null

            return SecurityDevicesModel.findOne({_id: deviceId, userId})
    }

    async findSessionByDeviceID(deviceId: string): Promise<SecurityDevicesDBModel | null> {
        if (!validID(deviceId)) return null

            return SecurityDevicesModel.findOne({ _id: deviceId})
    }
}