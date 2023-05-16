import { ObjectId } from "mongodb";
import { SecurityDevicesDBModel } from "../models/devices/SecurityDevicesDBModel";
import { securityDevicesRepository } from "../repositories/security-devices-repository";


export const securityDevicesService = {

    async getAllUserDevices(userId: string): Promise<SecurityDevicesDBModel[] | null> {
        return await securityDevicesRepository.getAllUserDevices(userId)
    },

    async deleteAllUserDevices(userId: string): Promise<boolean> {
        return await securityDevicesRepository.deleteAllUserDevices(userId)
    },

    async deleteUserDevice(deviceID: string, userId: string): Promise<boolean | null> {
        const device = await securityDevicesRepository.findDeviceByID(deviceID)
        if (!device) return device
        if (device.userId.toString() !== userId) return false
        
        return await securityDevicesRepository.deleteUserDevice(deviceID) 
    },

    async getDeviceID(): Promise<ObjectId> {
        return await securityDevicesRepository.getDeviceID()
    }
}