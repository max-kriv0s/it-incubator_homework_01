import { ObjectId } from "mongodb"
import { SecurityDevicesDBModel, SecurityDevicesModel } from "../models/security-devices/SecurityDevicesModel"
import { getIdDB } from "./db"


export const securityDevicesRepository = {
    async deleteAllDevicesSessions() {
        await SecurityDevicesModel.deleteMany({})
    },

    async getAllDevicesSessionsByUserID(userId: string): Promise<SecurityDevicesDBModel[] | null> {
        try {
            const devices = await SecurityDevicesModel.find({userId: userId}).exec()
            return devices

        } catch (error) {
            return null
        }
    },

    async deleteAllDevicesSessionsByUserID(userId: string, deviceId: string): Promise<boolean> {
        try {
            const result = await SecurityDevicesModel.deleteMany({
                userId: userId, 
                _id: {$ne: deviceId}
            })

            return result.acknowledged

        } catch (error) {
            return false
        }
    },

    async deleteUserSessionByDeviceID(deviceID: string, userId: string): Promise<boolean> {
        try {
            const result = await SecurityDevicesModel.deleteOne({
                _id: deviceID,
                userId: userId
            })

            return result.deletedCount === 1

        } catch (error) {
            return false
        }
    },

    async getDeviceID(deviceId: string): Promise<ObjectId | null> {
        return getIdDB(deviceId)
    },

    async createSecurityDeviceSession(securityDevice: SecurityDevicesDBModel): Promise<boolean> {
        try {
            await SecurityDevicesModel.create(securityDevice)
            return true

        } catch (error) {
            return false
        }
    },

    async updateSecurityDeviceSession(securityDevice: SecurityDevicesDBModel): Promise<boolean> {
        try {
            const {_id, ...rest} = {...securityDevice}
    
            const result = await SecurityDevicesModel.updateOne({_id}, {
                ip: rest.ip,
                title: rest.title,
                lastActiveDate: rest.lastActiveDate,
                expirationTime: rest.expirationTime,
                userId: rest.userId
            })

            return result.matchedCount === 1

        } catch (error) {
            return false
        }
    },

    async findUserSessionByDeviceID(userId: string, deviceId: string): Promise<SecurityDevicesDBModel | null> {
        try {
            const securitySession = await SecurityDevicesModel.findOne({
                _id: deviceId, 
                userId: userId
            }).exec()
            
            return securitySession

        } catch (error) {
            return null
        }
    },

    async findSessionByDeviceID(deviceId: string): Promise<SecurityDevicesDBModel | null> {
        try {
            const securitySession = await SecurityDevicesModel.findOne({
                _id: deviceId
            }).exec()
            
            return securitySession

        } catch (error) {
            return null
        }
    }
}