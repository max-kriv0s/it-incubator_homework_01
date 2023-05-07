import bcrypt from "bcrypt"
import add from 'date-fns/add'
import {v4 as uuidv4 } from 'uuid'
import { UserCreateModel } from "../models/users/UserCreateModel";
import { usersRepository } from "../repositories/users-repository";
import { PaginatorUserDBModel } from "../types/PaginatorType";
import { QueryParamsUsersModel } from "../types/QueryParamsModels";
import { UserDBModel } from "../models/users/UserDBModel";
import { UserServiceModel } from "../models/users/UserServiceModel";
import { emailManager } from "../managers/email-managers";


const CODE_LIFE_TIME = {
    hours: 1,
}

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

        const passwordHash = await this._generatePasswordHash(body.password)

        const newUser: UserServiceModel = {
            login: body.login,
            password: passwordHash,
            email: body.email,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: '',
                expirationDate: new Date(),
                isConfirmed: true
            }
        }

        const createdUser = await usersRepository.createUser(newUser)
        
        return createdUser
    },

    async deleteUserById(id: string): Promise<boolean> {
        return await usersRepository.deleteUserById(id)
    },

    async _generateHash(password: string, salt: string) {

        const hash = await bcrypt.hash(password, salt)
        return hash
    },

    async _generatePasswordHash(password: string): Promise<string> {
        
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        return passwordHash
    },

    async createUserForEmailConfirmation(body: UserCreateModel): Promise<string> {

        const userByLogin = await usersRepository.findByLoginOrEmail(body.login)
        const userByEmail = await usersRepository.findByLoginOrEmail(body.email)

        if (userByLogin || userByEmail) return "user already exists"

        const passwordHash = await this._generatePasswordHash(body.password)

        const newUser: UserServiceModel = {
            login: body.login,
            password: passwordHash,
            email: body.email,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), CODE_LIFE_TIME),
                isConfirmed: false
            }
        }
        
        const createdUser = await usersRepository.createUser(newUser)
            
        try {
            await emailManager.sendEmailConfirmationMessage(createdUser)
        } catch (error) {
            console.error(error)
            
            // нужно ли удалять пользователя в случае ошибки отправки email?
            // const isDeleded = await this.deleteUserById(createdUser._id.toString())

            return "Mail sending error"
        }

        return ""

    },

    async checkCredentials(loginOrEmail: string, password: string): Promise<UserDBModel | null> {

        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return null

        if (!user.emailConfirmation.isConfirmed) return null

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) return null

        return user
    },

    async findUserById(userId: string): Promise<UserDBModel | null> {
        const user = await usersRepository.findUserById(userId)
        return user
    },

    async confirmRegistration(code: string): Promise<string> {
        const isUpdated = await usersRepository.confirmRegistration(code)

        if (!isUpdated) return "User update error"

        return ""
    },

    async resendingConfirmationCodeToUser(email: string): Promise<string> {
        
        const user = await usersRepository.findByLoginOrEmail(email)
        if (!user) return "User not found"

        const emailConfirmation = {
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), CODE_LIFE_TIME),
            isConfirmed: false
        }

        const isUpdated = await usersRepository.updateDataEmailConfirmation(user, emailConfirmation)
        if (!isUpdated) return "User update error"

        try {
            await emailManager.sendPasswordRecoveryMessage(user)
        } catch (error) {
            console.error(error)
            return "Mail sending error"
        }

        return ""
        
    }
}