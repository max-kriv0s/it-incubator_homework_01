import jwt from 'jsonwebtoken'
import { UserDBModel } from "../models/users/UserDBModel";
import { settings } from '../settings';

const JWT_SECRET_ACCESS_TOKEN = settings.JWT_SECRET_ACCESS_TOKEN
const JWT_SECRET_REFRESH_TOKEN = settings.JWT_SECRET_REFRESH_TOKEN

const JWT_ACCESS_TOKEN_EXPIRES_IN = settings.JWT_ACCESS_TOKEN_EXPIRES_IN
const JWT_REFRESH_TOKEN_EXPIRES_IN = settings.JWT_REFRESH_TOKEN_EXPIRES_IN

export const jwtService = {

    async createJWTAccessToken(user:UserDBModel): Promise<string> {
        const token = jwt.sign({ UserId: user._id }, JWT_SECRET_ACCESS_TOKEN, { expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN })
        return token 
    },

    async createJWTRefreshToken(user:UserDBModel): Promise<string> {
        const refreshToken = jwt.sign({ UserId: user._id }, JWT_SECRET_REFRESH_TOKEN, { expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN })
        return refreshToken 
    },

    async findUserIdByAccessToken(token: string): Promise<string | null> {
        return await this.findUserIDByToken(token, JWT_SECRET_ACCESS_TOKEN)
    },

    async  findUserIDByRefreshToken(token: string): Promise<string | null> {
        return await this.findUserIDByToken(token, JWT_SECRET_REFRESH_TOKEN)
    },

    async findUserIDByToken(token: string, jwt_secret: string): Promise<string | null> {
        try {
            
            const result:any = jwt.verify(token, jwt_secret)
            return result.UserId
            
        } catch (error) {
            return null
        }
    }
}