import { ObjectId } from "mongodb"
import { UserDBModel } from "../models/users/UserDBModel"
import { PaginatorUserViewModel } from "../types.ts/PaginatorType"
import { usersCollection } from "./db"
import { UserCreateModel } from "../models/users/UserCreateModel"


export const usersRepository = {

    async getAllUsers(                
        searchLoginTerm: string | null,
        searchEmailTerm: string | null,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string): Promise<PaginatorUserViewModel> {

            const filterLogin: any = {}
            if (searchLoginTerm) {
                filterLogin.login = { $regex: searchLoginTerm, $options: 'i' }
            }

            const filterEmail: any = {}
            if (searchEmailTerm) {
                filterEmail.email = { $regex: searchEmailTerm, $options: 'i' }
            }

            const filter = {$or: [filterLogin, filterEmail]}

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
                items: users.map(i => ({
                    id: i._id.toString(),
                    login: i.login,
                    password: i.password,
                    email: i.email,
                    createdAt: i.createdAt
                }))
            }
    },

    async createUser(body: UserCreateModel, passwordHash: string) {
        const newUser: UserDBModel = {
            _id: new ObjectId(),
            login: body.login,
            password: passwordHash,
            email: body.email,
            createdAt: new Date().toISOString()
        }
        
        const result = await usersCollection.insertOne(newUser)

        return {
            ...newUser,
            id: newUser._id.toString()
        }
    },

    async deleteBlogById(id: string): Promise<boolean> {
        
        if (!ObjectId.isValid(id)) return false
        
        const result = await usersCollection.deleteOne({ _id: new ObjectId(id) })
        return result.deletedCount === 1
    },

    async deleteUsers() {
        usersCollection.deleteMany({})
    }
}