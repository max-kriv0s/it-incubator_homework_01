import jwt from 'jsonwebtoken'
import { UserDBModel } from "../models/users/UserDBModel";
import { ObjectId } from 'mongodb';
import { settings } from '../settings';

const JWT_SECRET = settings.JWT_SECRET

export const jwtService = {

    async createJWT(user:UserDBModel): Promise<string> {
        const token = jwt.sign({ UserId: user._id }, JWT_SECRET, { expiresIn: '10m' })
        return token 
    },

    async getUserIdByToken(token: string): Promise<ObjectId | null> {
        try {
            
            const result:any = jwt.verify(token, settings.JWT_SECRET)
            return new ObjectId(result.userId)
            
        } catch (error) {
            return null
        }
    }
}