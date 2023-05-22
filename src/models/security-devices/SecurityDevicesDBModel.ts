import { ObjectId } from "mongodb"

export type SecurityDevicesDBModel = {
    _id: ObjectId
    ip: string
    title: string
    lastActiveDate: string
    expirationTime: string
    userId: ObjectId
}