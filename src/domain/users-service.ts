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
import { APIErrorResult } from "../types/APIErrorModels";
import { GetDescriptionOfError, userAgentFromRequest } from "../utils/utils";
import { UpdateTokenModel } from "../models/auth/UpdateTokenModel";
import { jwtService } from "../application/jwt-service";
import { securityDevicesService } from "./security-devices-service";
import { SecurityDevicesDBModel } from "../models/security-devices/SecurityDevicesDBModel";
import { ObjectId } from "mongodb";
import { getIdDB } from "../repositories/db";


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
            accountData: {
                login: body.login,
                password: passwordHash,
                email: body.email,
                createdAt: new Date().toISOString()
            },
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

    async createUserForEmailConfirmation(body: UserCreateModel): Promise<APIErrorResult | null> {

        const userByLogin = await usersRepository.findByLoginOrEmail(body.login)
        if (userByLogin) {
            return GetDescriptionOfError("user already exists", "login")
        }    

        const userByEmail = await usersRepository.findByLoginOrEmail(body.email)
        if (userByEmail) {
            return GetDescriptionOfError("user already exists", "email")
        }

        const passwordHash = await this._generatePasswordHash(body.password)

        const newUser: UserServiceModel = {
            accountData: {
                login: body.login,
                password: passwordHash,
                email: body.email,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), CODE_LIFE_TIME),
                isConfirmed: false
            }
        }
        
        const createdUser = await usersRepository.createUser(newUser)
            
        try {
            await emailManager.sendEmailConfirmationMessage(createdUser.accountData.email, createdUser.emailConfirmation.confirmationCode)
        } catch (error) {
            console.error(error)

            return GetDescriptionOfError("Mail sending error", "email")
        }

        return null

    },

    async checkCredentials(loginOrEmail: string, password: string, ip: string, 
            reqUserAgent: string | undefined): Promise<UpdateTokenModel | null> {

        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return null

        if (!user.emailConfirmation.isConfirmed) return null

        const validPassword = await bcrypt.compare(password, user.accountData.password)
        if (!validPassword) return null

        return await securityDevicesService.createUserTokens(user, ip, reqUserAgent)
    },

    async findUserById(userId: string): Promise<UserDBModel | null> {
        const user = await usersRepository.findUserById(userId)
        return user
    },

    async confirmRegistration(code: string): Promise<APIErrorResult | null> {
        const isUpdated = await usersRepository.confirmRegistration(code)

        if (!isUpdated) return GetDescriptionOfError("User update error", "code")

        return null
    },

    async resendingConfirmationCodeToUser(email: string): Promise<APIErrorResult | null> {
        
        const user = await usersRepository.findByLoginOrEmail(email)
        if (!user) return GetDescriptionOfError("User not found", "email")

        if (user.emailConfirmation.isConfirmed) return GetDescriptionOfError("Email confirmed", "email")

        const emailConfirmation = {
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), CODE_LIFE_TIME),
            isConfirmed: false
        }

        const isUpdated = await usersRepository.updateDataEmailConfirmation(user, emailConfirmation)
        if (!isUpdated) return GetDescriptionOfError("User update error", "email")

        try {
            await emailManager.sendPasswordRecoveryMessage(user.accountData.email, emailConfirmation.confirmationCode)
        } catch (error) {
            console.error(error)
            return GetDescriptionOfError("Mail sending error", "email")
        }

        return null
        
    },

    async updateUserRefreshToken(userID: string, deviceId: string, ip: string, 
        reqUserAgent: string | undefined): Promise<UpdateTokenModel | null> {
    
        const user = await usersRepository.findUserById(userID)
        if (!user) return null

        return await securityDevicesService.updateUserTokens(user, deviceId, ip, reqUserAgent)
    }
}