import { APICallsModel } from "../models/api-calls/APICallsModel"
import { settings } from "../settings"


const MAX_COUNT_FREQUENT_REQUESTS_FOR_API = settings.MAX_COUNT_FREQUENT_REQUESTS_FOR_API
const QUERY_CHECKING_TIME = settings.QUERY_CHECKING_TIME

export const apiCallsRepository = {
    async addСallRecord(ip: string, url: string): Promise<boolean> {

        try {
            await APICallsModel.create({
                IP: ip,
                URL: url,
                date: new Date()
            })
            return true
        } catch (error) {
            return false
        }
    },

    async requestAllowed(ip: string, url: string): Promise<boolean> {
        
        try {
            const VerificationDate = new Date();
            VerificationDate.setSeconds(VerificationDate.getSeconds() - QUERY_CHECKING_TIME);
    
            const countRequest = await APICallsModel.countDocuments({IP: ip, URL: url, date: {$gte: VerificationDate}})
            return countRequest <= MAX_COUNT_FREQUENT_REQUESTS_FOR_API
        } catch (error) {
            return false
        }
    },

    async deleteCalls() {
        await APICallsModel.deleteMany({})
    }
}