import jwt from 'jsonwebtoken'
import { UserDBModel } from "../models/users/UserDBModel";
import { settings } from '../settings';
import { ObjectId } from 'mongodb';

export const jwtService = {

    async createJWT(user:UserDBModel): Promise<string> {
        const token = jwt.sign(user._id, settings.JWT_SECRET, { expiresIn: '10m' })
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