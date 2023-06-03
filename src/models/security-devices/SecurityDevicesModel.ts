import { ObjectId } from "mongodb"
import mongoose from "mongoose"

export class SecurityDevicesDBModel {
    constructor(public _id: ObjectId,
                public ip: string,
                public title: string,
                public lastActiveDate: string,
                public expirationTime: string,
                public userId: ObjectId
    ) {}
}

const SecurityDevicesSchema = new mongoose.Schema<SecurityDevicesDBModel>({
    ip: { type: String, required: true },
    title: { type: String, required: true },
    lastActiveDate: { type: String, required: true },
    expirationTime: { type: String, required: true },
    userId: { type: ObjectId, required: true }
})

export const SecurityDevicesModel = mongoose.model<SecurityDevicesDBModel>('securityDevices', SecurityDevicesSchema)