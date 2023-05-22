import { ObjectId } from "mongodb"
import { SecurityDevicesDBModel } from "../models/security-devices/SecurityDevicesDBModel"
import { getIdDB, securityDevicesCollection, validID } from "./db"
import { DataTokenModel } from "../models/token/DataTokenModel"


export const securityDevicesRepository = {
    async deleteAllDevicesSessions() {
        await securityDevicesCollection.deleteMany({})
    },

    async getAllDevicesSessionsByUserID(userId: string): Promise<SecurityDevicesDBModel[] | null> {
        if (!ObjectId.isValid(userId)) return null

        const devices = await securityDevicesCollection.find({userId: new ObjectId(userId)}).toArray()
        return devices
    },

    async deleteAllDevicesSessionsByUserID(userId: string, deviceId: string): Promise<boolean> {
        if (!validID(userId) || !validID(deviceId)) return false
        
        const result = await securityDevicesCollection.deleteMany({
            userId: new ObjectId(userId), 
            _id: {$ne: new ObjectId(deviceId)}
        })
        return result.acknowledged
    },

    async deleteUserSessionByDeviceID(deviceID: string, userId: string): Promise<boolean> {
        if (!validID(deviceID) || !validID(userId)) return false

        const result = await securityDevicesCollection.deleteOne({
            _id: new ObjectId(deviceID),
            userId: new ObjectId(userId)
        })
        return result.deletedCount === 1
    },

    async getDeviceID(deviceId: string): Promise<ObjectId | null> {
        return getIdDB(deviceId)
    },

    async createSecurityDeviceSession(securityDevice: SecurityDevicesDBModel): Promise<boolean> {
            const result = await securityDevicesCollection.insertOne(securityDevice)
            return result.acknowledged
    },

    async updateSecurityDeviceSession(securityDevice: SecurityDevicesDBModel): Promise<boolean> {
        const {_id, ...rest} = {...securityDevice}

        const result = await securityDevicesCollection.updateOne({_id}, {$set: {
            ip: rest.ip,
            title: rest.title,
            lastActiveDate: rest.lastActiveDate,
            expirationTime: rest.expirationTime,
            userId: rest.userId
        }})
        return result.matchedCount === 1
    },

    async findUserSessionByDeviceID(userId: string, deviceId: string): Promise<SecurityDevicesDBModel | null> {
        if (!validID(deviceId) || !validID(userId)) return null

        const securitySession = await securityDevicesCollection.findOne({
            _id: new ObjectId(deviceId), 
            userId: new ObjectId(userId)
        })
        
        return securitySession
    },

    async findSessionByDeviceID(deviceId: string): Promise<SecurityDevicesDBModel | null> {
        if (!validID(deviceId)) return null

        const securitySession = await securityDevicesCollection.findOne({
            _id: new ObjectId(deviceId)
        })
        
        return securitySession
    }
}