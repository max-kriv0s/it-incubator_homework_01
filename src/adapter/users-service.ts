import bcrypt from "bcrypt"
import add from 'date-fns/add'
import { v4 as uuidv4 } from 'uuid'
import { UserCreateModel } from "../domain/users/UserCreateModel";
import { UserDBModel, UserPasswordRecovery } from "../domain/users/UserModel";
import { UserServiceModel } from "../domain/users/UserServiceModel";
import { emailManager } from "./email-managers";
import { APIErrorResult } from "../types/APIErrorModels";
import { GetDescriptionOfError } from "../utils/utils";
import { UpdateTokenModel } from "../domain/auth/UpdateTokenModel";
import { settings } from "../settings";
import { UsersRepository } from "../infrastructure/repositories/users/users-repository";
import { SecurityDevicesService } from "./security-devices-service";
import { inject, injectable } from "inversify";


const CODE_LIFE_TIME = settings.CODE_LIFE_TIME


@injectable()
export class UsersService {
    constructor(
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(SecurityDevicesService) protected securityDevicesService: SecurityDevicesService
    ) { }

    async createUser(body: UserCreateModel): Promise<UserDBModel | null> {

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

        return this.usersRepository.createUser(newUser)
    }

    async deleteUserById(id: string): Promise<boolean> {
        return this.usersRepository.deleteUserById(id)
    }

    async _generateHash(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt)
    }

    async _generatePasswordHash(password: string): Promise<string> {
        const passwordSalt = await bcrypt.genSalt(10)
        return this._generateHash(password, passwordSalt)
    }

    async createUserForEmailConfirmation(body: UserCreateModel): Promise<APIErrorResult | null> {

        const userByLogin = await this.usersRepository.findByLoginOrEmail(body.login)
        if (userByLogin) {
            return GetDescriptionOfError("user already exists", "login")
        }

        const userByEmail = await this.usersRepository.findByLoginOrEmail(body.email)
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

        const createdUser = await this.usersRepository.createUser(newUser)
        if (!createdUser) return null

        emailManager.sendEmailConfirmationMessage(createdUser.accountData.email, createdUser.emailConfirmation.confirmationCode)

        return null
    }

    async checkCredentials(loginOrEmail: string, password: string, ip: string,
        reqUserAgent: string | undefined): Promise<UpdateTokenModel | null> {

        const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return null

        if (!user.emailConfirmation.isConfirmed) return null

        const validPassword = await bcrypt.compare(password, user.accountData.password)
        if (!validPassword) return null

        return this.securityDevicesService.createUserTokens(user, ip, reqUserAgent)
    }

    async findUserById(userId: string): Promise<UserDBModel | null> {
        return this.usersRepository.findUserById(userId)
    }

    async confirmRegistration(code: string): Promise<APIErrorResult | null> {
        const isUpdated = await this.usersRepository.confirmRegistration(code)

        if (!isUpdated) return GetDescriptionOfError("User update error", "code")

        return null
    }

    async resendingConfirmationCodeToUser(email: string): Promise<APIErrorResult | null> {

        const user = await this.usersRepository.findByLoginOrEmail(email)
        if (!user) return GetDescriptionOfError("User not found", "email")

        if (user.emailConfirmation.isConfirmed) return GetDescriptionOfError("Email confirmed", "email")

        const emailConfirmation = {
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), CODE_LIFE_TIME),
            isConfirmed: false
        }

        const isUpdated = await this.usersRepository.updateDataEmailConfirmation(user, emailConfirmation)
        if (!isUpdated) return GetDescriptionOfError("User update error", "email")

        emailManager.sendPasswordRecoveryMessage(user.accountData.email, emailConfirmation.confirmationCode)

        return null
    }

    async updateUserRefreshToken(userID: string, deviceId: string, ip: string,
        reqUserAgent: string | undefined): Promise<UpdateTokenModel | null> {

        const user = await this.usersRepository.findUserById(userID)
        if (!user) return null

        return this.securityDevicesService.updateUserTokens(user, deviceId, ip, reqUserAgent)
    }

    async passwordRecovery(email: string) {

        const passwordRecovery: UserPasswordRecovery = {
            recoveryCode: uuidv4(),
            expirationDate: add(new Date(), CODE_LIFE_TIME),
        }

        const user = await this.usersRepository.findByLoginOrEmail(email)
        if (user) {
            await this.usersRepository.updatePasswordRecovery(user, passwordRecovery)
        }

        emailManager.sendPasswordRecovery(email, passwordRecovery.recoveryCode)
    }

    async newPassword(newPassword: string, recoveryCode: string): Promise<boolean> {
        const user = await this.usersRepository.findUserByRecoveryCode(recoveryCode)
        if (!user) return false
        if (user.passwordRecovery.expirationDate < new Date()) return false

        const passwordHash = await this._generatePasswordHash(newPassword)

        return this.usersRepository.updateUserPassword(user, passwordHash)
    }
}
