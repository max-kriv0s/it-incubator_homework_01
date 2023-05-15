import { ObjectId } from "mongodb"
import { DeviceDBModel } from "../models/devices/DeviceDBModel"
import { devicesCollection } from "./db"


export const devicesRepository = {
    async deleteDevices() {
        await devicesCollection.deleteMany({})
    },

    async getAllUserDevices(userId: string): Promise<DeviceDBModel[]> {
        if (!ObjectId.isValid(userId)) return []

        const devices = await devicesCollection.find({userId: new ObjectId(userId)}).toArray()
        return devices
    },

    async deleteAllUserDevices() {

    },

    async deleteUserDevice() {

    }

}