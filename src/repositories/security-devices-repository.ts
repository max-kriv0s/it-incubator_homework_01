import { ObjectId } from "mongodb"
import { SecurityDevicesDBModel, SecurityDevicesModel } from "../models/security-devices/SecurityDevicesModel"
import { getIdDB, validID } from "./db"


export const securityDevicesRepository = {
    async deleteAllDevicesSessions() {
        await SecurityDevicesModel.deleteMany({})
    },

    async getAllDevicesSessionsByUserID(userId: string): Promise<SecurityDevicesDBModel[] | null> {
        if (!validID(userId)) return null
        
        try {
            const devices = await SecurityDevicesModel.find({userId}).exec()
            return devices

        } catch (error) {
            return null
        }
    },

    async deleteAllDevicesSessionsByUserID(userId: string, deviceId: string): Promise<boolean> {
        if (!validID(userId) || !validID(deviceId)) return false
        
        try {
            const result = await SecurityDevicesModel.deleteMany({
                userId, 
                _id: {$ne: deviceId}
            })

            return result.acknowledged

        } catch (error) {
            return false
        }
    },

    async deleteUserSessionByDeviceID(deviceID: string, userId: string): Promise<boolean> {
        if (!validID(deviceID) || !validID(userId)) return false

        try {
            const result = await SecurityDevicesModel.deleteOne({
                _id: deviceID,
                userId
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
        if (!validID(userId) || !validID(deviceId)) return null
        
        try {
            const securitySession = await SecurityDevicesModel.findOne({
                _id: deviceId, 
                userId
            }).exec()
            
            return securitySession

        } catch (error) {
            return null
        }
    },

    async findSessionByDeviceID(deviceId: string): Promise<SecurityDevicesDBModel | null> {
        if (!validID(deviceId)) return null
        
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