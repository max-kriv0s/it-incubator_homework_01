import { ObjectId } from "mongodb"
import { SecurityDevicesDBModel } from "../models/devices/SecurityDevicesDBModel"
import { securityDevicesCollection } from "./db"


export const securityDevicesRepository = {
    async deleteDevicesAllUsers() {
        await securityDevicesCollection.deleteMany({})
    },

    async getAllUserDevices(userId: string): Promise<SecurityDevicesDBModel[] | null> {
        if (!ObjectId.isValid(userId)) return null

        const devices = await securityDevicesCollection.find({userId: new ObjectId(userId)}).toArray()
        return devices
    },

    async deleteAllUserDevices(userId: string): Promise<boolean> {
        if (!ObjectId.isValid(userId)) return false
        
        const result = await securityDevicesCollection.deleteMany({userId: new ObjectId(userId)})
        return result.deletedCount > 0
    },

    async deleteUserDevice(deviceID: string): Promise<boolean> {
        if (!ObjectId.isValid(deviceID)) return false

        const result = securityDevicesCollection.deleteOne({_id: new ObjectId(deviceID)})
        return (await result).deletedCount === 1
    },

    async findDeviceByID(deviceID: string): Promise<SecurityDevicesDBModel | null> {
        if (!ObjectId.isValid(deviceID)) return null

        const device = securityDevicesCollection.findOne({_id: new ObjectId(deviceID)})
        return device
    },

    async getDeviceID(): Promise<ObjectId> {
        return new ObjectId()
    }
}