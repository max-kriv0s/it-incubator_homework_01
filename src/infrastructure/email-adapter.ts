import nodemailer from "nodemailer"
import { settings } from "../settings";

const TECH_EMAIL = settings.TECH_EMAIL
const TECH_EMAIL_PASSWORD = settings.TECH_EMAIL_PASSWORD


export const emailAdapter = {

    async sendEmail(email: string, subject: string, textMessage: string) {

        let transport = nodemailer.createTransport({
            host: "smtp.yandex.ru",
            port: 465,
            secure: true,
            // service: "gmail",
            auth: {
                user: TECH_EMAIL,
                pass: TECH_EMAIL_PASSWORD,
            },
        });
        
        let message = {
            from: `Learning platform <${TECH_EMAIL}>`,
            to: email,
            subject: subject,
            html: textMessage
        }

        // let info = await transport.sendMail(message);
        
        const info = await new Promise((resolve, reject) => {
            transport.sendMail(message, (err, info) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(info)
                }
            })
        })

        return info
    }
}