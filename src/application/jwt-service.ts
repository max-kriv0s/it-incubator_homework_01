import jwt from 'jsonwebtoken'
import { UserDBModel } from "../domain/users/UserModel";
import { settings } from '../settings';
import { ObjectId } from 'mongodb';
import { DataTokenModel } from '../domain/token/DataTokenModel';

const JWT_SECRET_ACCESS_TOKEN = settings.JWT_SECRET_ACCESS_TOKEN
const JWT_SECRET_REFRESH_TOKEN = settings.JWT_SECRET_REFRESH_TOKEN

const JWT_ACCESS_TOKEN_EXPIRES_IN = settings.JWT_ACCESS_TOKEN_EXPIRES_IN
const JWT_REFRESH_TOKEN_EXPIRES_IN = settings.JWT_REFRESH_TOKEN_EXPIRES_IN

interface DataToken {
    UserId: string;
    deviceId: string;
    iat: number;
    exp: number;
}

export const jwtService = {

    async createJWTAccessToken(user:UserDBModel): Promise<string> {
        const token = jwt.sign({ UserId: user._id }, JWT_SECRET_ACCESS_TOKEN, { expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN })
        return token 
    },

    async createJWTRefreshToken(user:UserDBModel, deviceId: ObjectId): Promise<string> {
        const refreshToken = jwt.sign({ UserId: user._id, deviceId: deviceId}, JWT_SECRET_REFRESH_TOKEN, { expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN })
        return refreshToken 
    },

    async ReadAndCheckTokenAccessToken(token: string): Promise<DataTokenModel | null> {
        return this.ReadAndCheckToken(token, JWT_SECRET_ACCESS_TOKEN)
    },

    async ReadAndCheckTokenRefreshToken(token: string): Promise<DataTokenModel | null> {
        return this.ReadAndCheckToken(token, JWT_SECRET_REFRESH_TOKEN)
    },

    async ReadAndCheckToken(token: string, jwt_secret: string): Promise<DataTokenModel | null> {
        
        
        try {
            const result = jwt.verify(token, jwt_secret) as DataToken

            return {
                userId: result.UserId,
                deviceId: result.deviceId,
                issuedAd: new Date(result.iat * 1000).toISOString(),
                expirationTime: new Date(result.exp * 1000).toISOString()
            }
            
        } catch (error) {
            return null
        }
    },

    // async decodeRefreshToken(token: string): Promise<DecodeTokenModel | null> {
        
    //     try {
    //         const result = jwt.decode(token, { json: true })
    //         if (!result) return null
    //         if (!result.UserId || !result.deviceId || !result.iat || !result.exp) return null
            
    //         if (!validID(result.UserId) || !validID(result.deviceId)) return null
    
    //         return {
    //             userId: new ObjectId(result.UserId),
    //             deviceId: new ObjectId(result.deviceId),
    //             lastActiveDate: new Date(result.iat * 1000).toISOString(),
    //             expirationTime: new Date(result.exp * 1000).toISOString()
    //         }           
    //     } catch (error) {
    //         return null
    //     }

    // },

    async validDebidRefreshToken(debidRefreshToken: DataTokenModel, deviceId: ObjectId, userId: ObjectId): Promise <boolean> {
        return debidRefreshToken.deviceId === deviceId.toString() && debidRefreshToken.userId === userId.toString()
    }
}