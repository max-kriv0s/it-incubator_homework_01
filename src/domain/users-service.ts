import bcrypt from "bcrypt"
import { UserCreateModel } from "../models/users/UserCreateModel";
import { UserViewModel } from "../models/users/UserViewModel";
import { usersRepository } from "../repositories/users-repository";
import { PaginatorUserViewModel } from "../types/PaginatorType";
import { QueryParamsUsersModel } from "../types/QueryParamsModels";


export const usersService = {
    
    async getAllUsers(queryParams: QueryParamsUsersModel): Promise<PaginatorUserViewModel> {
        
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

        return {
            pagesCount: users.pagesCount,
            page: users.page,
            pageSize: users.pageSize,
            totalCount: users.totalCount,
            items: users.items.map(u => ({
                id: u.id,
                login: u.login,
                email: u.email,
                createdAt: u.createdAt
            }))
        }
    },

    async createUser(body: UserCreateModel): Promise<UserViewModel> {
        
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(body.password, passwordSalt)

        const createdUser = await usersRepository.createUser(body, passwordHash)

        return {
            id: createdUser.id,
            login: createdUser.login,
            email: createdUser.email,
            createdAt: createdUser.createdAt
        }
    },

    async deleteUserById(id: string): Promise<boolean> {
        return await usersRepository.deleteBlogById(id)    
    },

    async _generateHash(password: string, salt: string) {

        const hash = await bcrypt.hash(password, salt)
        return hash
    },

    async checkCredentials(loginOrEmail: string, password: string): Promise<boolean> {
        
        const passwodHash = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!passwodHash) return false

        const validPassword = await bcrypt.compare(password, passwodHash)
        return validPassword
    }
}