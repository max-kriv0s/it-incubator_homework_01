import { ObjectId } from "mongodb";
import { SecurityDevicesDBModel, SecurityDevicesModel } from "../../models/security-devices/SecurityDevicesModel";
import { SecurityDevicesViewModel } from "../../models/security-devices/SecurityDevicesViewModel";
import { validID } from "../db";

export class SecurityDevicesQueryRepository {

    async getAllDevicesSessionsByUserID(userId: string): Promise<SecurityDevicesViewModel[] | null> {
        if (!validID(userId)) return null
        const devicesDB = await SecurityDevicesModel.find({ userId }).exec()
        if (!devicesDB) return null

        return devicesDB.map(device => this.securityDevicesDBTosecurityDevicesView(device))
    }

    securityDevicesDBTosecurityDevicesView(device: SecurityDevicesDBModel): SecurityDevicesViewModel {
        return {
            ip: device.ip,
            title: device.title,
            lastActiveDate: device.lastActiveDate,
            deviceId: device._id.toString()
        }
    }
}