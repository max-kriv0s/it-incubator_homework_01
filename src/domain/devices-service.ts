import { DeviceDBModel } from "../models/devices/DeviceDBModel";
import { devicesRepository } from "../repositories/devices-repository";


export const devicesService = {

    async getAllUserDevices(userId: string): Promise<DeviceDBModel[]> {
        return await devicesRepository.getAllUserDevices(userId)
    }

}