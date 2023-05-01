import jwt from 'jsonwebtoken'
import { UserDBModel } from "../models/users/UserDBModel";
import { ObjectId } from 'mongodb';
import { settings } from '../settings';

const JWT_SECRET = settings.JWT_SECRET

export const jwtService = {

    async createJWT(user:UserDBModel): Promise<string> {
        const token = jwt.sign({ UserId: user._id }, JWT_SECRET, { expiresIn: '1h' })
        return token 
    },

    async getUserIdByToken(token: string): Promise<string | undefined> {
        try {
            
            const result:any = jwt.verify(token, JWT_SECRET)
            return result.UserId
            
        } catch (error) {
            return undefined
        }
    }
}