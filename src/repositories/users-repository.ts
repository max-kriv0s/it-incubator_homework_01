import { ObjectId } from "mongodb"
import { UserDBModel } from "../models/users/UserDBModel"
import { PaginatorUserDBModel } from "../types/PaginatorType"
import { usersCollection } from "./db"
import { UserCreateModel } from "../models/users/UserCreateModel"


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
                    { login: { $regex: searchLoginTerm, $options: 'i' } },
                    { email: { $regex: searchEmailTerm, $options: 'i' } }
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

    async createUser(body: UserCreateModel, passwordHash: string): Promise<UserDBModel> {
        const newUser: UserDBModel = {
            _id: new ObjectId(),
            login: body.login,
            password: passwordHash,
            email: body.email,
            createdAt: new Date().toISOString()
        }

        const result = await usersCollection.insertOne(newUser)
        return newUser
    },

    async deleteBlogById(id: string): Promise<boolean> {

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
    }
}