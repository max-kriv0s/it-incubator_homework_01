import { ObjectId, WithId } from "mongodb"
import mongoose from "mongoose"

export type SecurityDevicesDBModel = WithId<{
    ip: string
    title: string
    lastActiveDate: string
    expirationTime: string
    userId: ObjectId
}>

const SecurityDevicesSchema = new mongoose.Schema<SecurityDevicesDBModel>({
    ip: {type: String, required: true},
    title: {type: String, required: true},
    lastActiveDate: {type: String, required: true},
    expirationTime: {type: String, required: true},
    userId: {type: ObjectId, required: true}
})

export const SecurityDevicesModel = mongoose.model<SecurityDevicesDBModel>('securityDevices', SecurityDevicesSchema)