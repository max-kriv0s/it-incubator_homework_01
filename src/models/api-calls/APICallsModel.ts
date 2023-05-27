import mongoose from "mongoose"

export type APICallsModel = {
    IP: string
    URL: string
    date: Date
}

const APICallsSchema = new mongoose.Schema<APICallsModel>({
    IP: {
        type: String,
        required: true
    },
    URL: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
})

export const APICallsModel = mongoose.model<APICallsModel>('apiCalls', APICallsSchema)