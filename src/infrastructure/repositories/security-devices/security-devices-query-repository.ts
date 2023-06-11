import { SecurityDevicesDBModel, SecurityDevicesModel } from "../../../domain/security-devices/SecurityDevicesModel";
import { SecurityDevicesViewModel } from "../../../domain/security-devices/SecurityDevicesViewModel";
import { validID } from "../db";
import { injectable } from "inversify";


@injectable()
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