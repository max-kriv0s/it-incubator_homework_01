import { injectable } from "inversify"
import { settings } from "../../../settings"
import { APICallsModel } from "../../../domain/api-calls/APICallsModel"


const MAX_COUNT_FREQUENT_REQUESTS_FOR_API = settings.MAX_COUNT_FREQUENT_REQUESTS_FOR_API
const QUERY_CHECKING_TIME = settings.QUERY_CHECKING_TIME

@injectable()
export class ApiCallsRepository {
    async addСallRecord(ip: string, url: string): Promise<boolean> {
        await APICallsModel.create({
            IP: ip,
            URL: url,
            date: new Date()
        })
        return true
    }

    async requestAllowed(ip: string, url: string): Promise<boolean> {

            const VerificationDate = new Date();
            VerificationDate.setSeconds(VerificationDate.getSeconds() - QUERY_CHECKING_TIME);

            const countRequest = await APICallsModel.countDocuments({ IP: ip, URL: url, date: { $gte: VerificationDate } })
            return countRequest <= MAX_COUNT_FREQUENT_REQUESTS_FOR_API

    }

    async deleteCalls() {
        await APICallsModel.deleteMany({})
    }
}