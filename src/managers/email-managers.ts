import { emailAdapter } from "../adapter/email-adapter";
import { UserDBModel } from "../models/users/UserDBModel";
import { settings } from "../settings";

const APP_URL = settings.APP_URL


export const emailManager = {

    async sendEmailConfirmationMessage(email: string, confirmationCode: string) {
        const textMessage = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='${APP_URL}/confirm-email?code=${confirmationCode}'>complete registration</a>
        </p>`
        
        const info = await emailAdapter.sendEmail(email, "Email confirmation", textMessage)
        
    },

    async sendPasswordRecoveryMessage(email: string, confirmationCode: string) {
        const textMessage = `<h1>Resending email confirmation</h1>
        <p>To finish registration please follow the link below:
            <a href='${APP_URL}/confirm-email?code=${confirmationCode}'>complete registration</a>
        </p>`
        
        const info = await emailAdapter.sendEmail(email, "Resending email confirmation", textMessage)
        
    }
}