import jwt from 'jsonwebtoken'
import { UserDBModel } from "../models/users/UserDBModel";
import { settings } from '../settings';

const JWT_SECRET_ACCESS_TOKEN = settings.JWT_SECRET_ACCESS_TOKEN
const JWT_SECRET_REFRESH_TOKEN = settings.JWT_SECRET_REFRESH_TOKEN

export const jwtService = {

    async createJWT(user:UserDBModel): Promise<string> {
        const token = jwt.sign({ UserId: user._id }, JWT_SECRET_ACCESS_TOKEN, { expiresIn: '1h' })
        return token 
    },

    async getUserIdByToken(token: string): Promise<string | undefined> {
        try {
            
            const result:any = jwt.verify(token, JWT_SECRET_ACCESS_TOKEN)
            return result.UserId
            
        } catch (error) {
            return undefined
        }
    }
}