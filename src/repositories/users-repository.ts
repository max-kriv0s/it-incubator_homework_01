import { ObjectId } from "mongodb"
import { UserDBModel, UserEmailConfirmationType, UserModel, UserPasswordRecovery } from "../models/users/UserModel"
import { PaginatorUserDBModel } from "../types/PaginatorType"
import { UserServiceModel } from "../models/users/UserServiceModel"
import { validID } from "./db"


export const usersRepository = {

    async getAllUsers(
        searchLoginTerm: string | null,
        searchEmailTerm: string | null,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string): Promise<PaginatorUserDBModel> {

        let filter: any = {}
        if (searchLoginTerm && searchEmailTerm) {
            filter = {
                $or: [
                    { "accountData.login": { $regex: searchLoginTerm, $options: 'i' } },
                    { "accountData.email": { $regex: searchEmailTerm, $options: 'i' } }
                ]
            }
        } else if (searchLoginTerm) {
            filter = { "accountData.login": {$regex: searchLoginTerm, $options: 'i' } }
        } else if (searchEmailTerm) {
            filter = { "accountData.email": {$regex: searchEmailTerm, $options: 'i' } }
        }

        const totalCount: number = await UserModel.countDocuments(filter)
        const skip = (pageNumber - 1) * pageSize

        const users: UserDBModel[] = await UserModel.find(filter, null,{
            sort: { ["accountData." + sortBy]: sortDirection === 'asc' ? 1 : -1 },
            skip: skip,
            limit: pageSize
        }).exec()

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: users
        }
    },

    async createUser(user: UserServiceModel): Promise<UserDBModel | null> {
        try {
            const newUser: UserDBModel = {
                ...user,
                _id: new ObjectId(),
                refreshToken: '',
                passwordRecovery: {
                    recoveryCode: '',
                    expirationDate: new Date(0)
                }
            }
    
            const result = await UserModel.create(newUser)
            return result
            
        } catch (error) {
            return null
        }
    },

    async deleteUserById(id: string): Promise<boolean> {
        if (!validID(id)) return false
        
        try {
            const result = await UserModel.deleteOne({ _id: id })
            return result.deletedCount === 1
            
        } catch (error) {
            return false
        }
    },

    async deleteUsers() {
        await UserModel.deleteMany({})
    },

    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDBModel | null> {
        try {
            const user = await UserModel.findOne({ 
                $or: [
                    { "accountData.login": loginOrEmail }, 
                    { "accountData.email": loginOrEmail }
                ] 
            }).exec()
            return user
            
        } catch (error) {
            return null
        }
    },

    async findUserById(userId: string): Promise<UserDBModel | null> {
        try {
            const user = await UserModel.findById(userId).exec()
            return user
            
        } catch (error) {
            return null
        }
    },

    async confirmRegistration(code: string): Promise<boolean> {
        try {
            const user = await this.findUserByCodeConfirmation(code)
            if (!user) return false
    
            if (user.emailConfirmation.isConfirmed) return false
    
            const isUpdated = await UserModel.updateOne({_id: user._id}, {"emailConfirmation.isConfirmed": true})
            return isUpdated.matchedCount === 1
            
        } catch (error) {
            return false
        }
    },

    async findUserByCodeConfirmation(code: string): Promise<UserDBModel | null> {
        try {
            const user = await UserModel.findOne({"emailConfirmation.confirmationCode": code}).exec()
            if (user && user.emailConfirmation.expirationDate > new Date()) {
                return user
            } else {
                return null
            }
            
        } catch (error) {
            return null
        }
    },

    async updateDataEmailConfirmation(user: UserDBModel, emailConfirmation: UserEmailConfirmationType): Promise<boolean> {
        try {
            const isUpdated = await UserModel.updateOne({_id: user._id}, {emailConfirmation: emailConfirmation})
            return isUpdated.matchedCount === 1

        } catch (error) {
            return false
        }
    },

    async updatePasswordRecovery(user: UserDBModel, passwordRecovery: UserPasswordRecovery) {
        try {
            await UserModel.updateOne({ _id: user._id }, {passwordRecovery: passwordRecovery})
        } catch (error) {
            console.error(error)
        }
    },

    async findUserByRecoveryCode(recoveryCode: string): Promise<UserDBModel | null> {
        try {
            const user = await UserModel.findOne({'passwordRecovery.recoveryCode': recoveryCode}).exec()
            return user

        } catch (error) {
            return null
        }
    },

    async updateUserPassword(user: UserDBModel, passwordHash: string): Promise<boolean> {
        try {
            const result = await UserModel.updateOne({ _id: user._id }, {'accountData.password': passwordHash})
            return result.acknowledged

        } catch (error) {
            return false
        }
    }
}