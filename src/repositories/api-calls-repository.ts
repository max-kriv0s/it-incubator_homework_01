import { settings } from "../settings"
import { apiCallsCollection } from "./db"


const MAX_COUNT_FREQUENT_REQUESTS_FOR_API = settings.MAX_COUNT_FREQUENT_REQUESTS_FOR_API
const QUERY_CHECKING_TIME = settings.QUERY_CHECKING_TIME

export const apiCallsRepository = {
    async addСallRecord(ip: string, url: string): Promise<boolean> {

        const result = await apiCallsCollection.insertOne({
            IP: ip,
            URL: url,
            date: new Date()
        })

        return result.acknowledged
    },

    async requestAllowed(ip: string, url: string): Promise<boolean> {
        const VerificationDate = new Date();
        VerificationDate.setSeconds(VerificationDate.getSeconds() - QUERY_CHECKING_TIME);

        const countRequest = await apiCallsCollection.countDocuments({IP: ip, URL: url, date: {$gte: VerificationDate}})
        return countRequest <= MAX_COUNT_FREQUENT_REQUESTS_FOR_API
    },

    async deleteCalls() {
        await apiCallsCollection.deleteMany({})
    },
}