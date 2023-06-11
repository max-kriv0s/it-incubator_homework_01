import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'
import { settings } from '../../settings'


const MONGO_URI = settings.MONGO_URI
const DB_NAME = settings.DB_NAME

export const runDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {dbName: DB_NAME})
        console.log('Connect to successfully to server')
    } catch (e) {
        console.log('Don\'t connected successfully to server')
        await mongoose.disconnect()
    }
}

export function validID(id: string): boolean {
    return ObjectId.isValid(id)
}

export function getIdDB(id: string): ObjectId | null {
    if (!id) return new ObjectId()

    if (!validID(id)) return null

    return new ObjectId(id)
}