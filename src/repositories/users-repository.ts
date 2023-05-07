import { ObjectId } from "mongodb"
import { UserDBModel, UserEmailConfirmationType } from "../models/users/UserDBModel"
import { PaginatorUserDBModel } from "../types/PaginatorType"
import { usersCollection } from "./db"
import { UserServiceModel } from "../models/users/UserServiceModel"


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
                    { "login": { $regex: searchLoginTerm, $options: 'i' } },
                    { "email": { $regex: searchEmailTerm, $options: 'i' } }
                ]
            }
        } else if (searchLoginTerm) {
            filter.login = { $regex: searchLoginTerm, $options: 'i' }
        } else if (searchEmailTerm) {
            filter.email = { $regex: searchEmailTerm, $options: 'i' }
        }

        const totalCount: number = await usersCollection.countDocuments(filter)
        const skip = (pageNumber - 1) * pageSize

        const users: UserDBModel[] = await usersCollection.find(filter)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(pageSize).toArray()

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: users
        }
    },

    async createUser(user: UserServiceModel): Promise<UserDBModel> {
        const newUser: UserDBModel = {
            ...user,
            _id: new ObjectId(),
        }

        const result = await usersCollection.insertOne(newUser)
        return newUser
    },

    async deleteUserById(id: string): Promise<boolean> {

        if (!ObjectId.isValid(id)) return false

        const result = await usersCollection.deleteOne({ _id: new ObjectId(id) })
        return result.deletedCount === 1
    },

    async deleteUsers() {
        await usersCollection.deleteMany({})
    },

    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDBModel | null> {

        const user = await usersCollection.findOne({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] })
        return user
    },

    async findUserById(userId: string): Promise<UserDBModel | null> {
        if (!ObjectId.isValid(userId)) return null

        const user = await usersCollection.findOne({ _id: new ObjectId(userId) })
        return user
    },

    async confirmRegistration(code: string): Promise<boolean> {
        const user = await this.findUserByCodeConfirmation(code)
        if (!user) return false

        if (user.emailConfirmation.isConfirmed) return false

        const isUpdated = await usersCollection.updateOne({_id: user._id}, {$set: {"emailConfirmation.isConfirmed": true}})
        return isUpdated.matchedCount === 1
    },

    async findUserByCodeConfirmation(code: string): Promise<UserDBModel | null> {
        const user = await usersCollection.findOne({"emailConfirmation.confirmationCode": code})
        if (user && user.emailConfirmation.expirationDate > new Date()) {
            return user
        } else {
            return null
        }
    },

    async updateDataEmailConfirmation(user: UserDBModel, emailConfirmation: UserEmailConfirmationType): Promise<boolean> {
        const isUpdated = await usersCollection.updateOne({_id: user._id}, {$set: {emailConfirmation: emailConfirmation}})
        return isUpdated.matchedCount === 1
    }
}