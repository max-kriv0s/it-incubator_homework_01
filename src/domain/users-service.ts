import bcrypt from "bcrypt"
import { UserCreateModel } from "../models/users/UserCreateModel";
import { usersRepository } from "../repositories/users-repository";
import { PaginatorUserDBModel } from "../types/PaginatorType";
import { QueryParamsUsersModel } from "../types/QueryParamsModels";
import { UserDBModel } from "../models/users/UserDBModel";


export const usersService = {

    async getAllUsers(queryParams: QueryParamsUsersModel): Promise<PaginatorUserDBModel> {

        const pageNumber = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy = queryParams.sortBy ? queryParams.sortBy : 'createdAt'
        const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc'
        const searchLoginTerm = queryParams.searchLoginTerm ? queryParams.searchLoginTerm : null
        const searchEmailTerm = queryParams.searchEmailTerm ? queryParams.searchEmailTerm : null

        const users = await usersRepository.getAllUsers(
            searchLoginTerm,
            searchEmailTerm,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection
        )

        return users
    },

    async createUser(body: UserCreateModel): Promise<UserDBModel> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(body.password, passwordSalt)

        const createdUser = await usersRepository.createUser(body, passwordHash)

        return createdUser
    },

    async deleteUserById(id: string): Promise<boolean> {
        return await usersRepository.deleteBlogById(id)
    },

    async _generateHash(password: string, salt: string) {

        const hash = await bcrypt.hash(password, salt)
        return hash
    },

    async checkCredentials(loginOrEmail: string, password: string): Promise<UserDBModel | null> {

        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return null

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) return null

        return user
    },

    async findUserById(userId: string): Promise<UserDBModel | null> {
        const user = usersRepository.findUserById(userId)
        return user
    }
}