import mongoose from "mongoose"

export class APICalls {
    constructor(public IP: string,
        public URL: string,
        public date: Date
    ) { }
}

const APICallsSchema = new mongoose.Schema<APICalls>({
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

export const APICallsModel = mongoose.model<APICalls>('apiCalls', APICallsSchema)