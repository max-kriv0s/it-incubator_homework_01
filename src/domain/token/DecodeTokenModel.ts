import { ObjectId } from "mongodb"

export type DecodeTokenModel = {
    userId: ObjectId
    deviceId: ObjectId
    lastActiveDate: string
    expirationTime: string
}