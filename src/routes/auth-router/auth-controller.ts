import { Request, Response } from 'express'
import { SecurityDevicesService } from "../../domain/security-devices-service";
import { UsersService } from "../../domain/users-service";
import { LoginInputModel } from "../../models/auth/LoginInputModel";
import { RequestsWithBody } from "../../types/types";
import { StatusCodes } from 'http-status-codes';
import { MeViewModel } from '../../models/auth/MeViewModel';
import { UsersQueryRepository } from '../../repositories/users/users-query-repository';
import { UserCreateModel } from '../../models/users/UserCreateModel';
import { RegistrationConfirmationCodeModel } from '../../models/auth/RegistrationConfirmationCodeModel';
import { RegistrationEmailResendingModel } from '../../models/auth/RegistrationEmailResendingModel';
import { NewPasswordRecoveryInputModel } from '../../models/auth/NewPasswordRecoveryInputModel';
import { GetDescriptionOfError } from '../../utils/utils';

export class AuthController {
    constructor(
        protected usersService: UsersService,
        protected securityDevicesService: SecurityDevicesService,
        protected usersQueryRepository: UsersQueryRepository
    ) { }

    async loginUser(req: RequestsWithBody<LoginInputModel>, res: Response) {
        try {
            const reqUserAgent = req.headers["user-agent"]

            const tokens = await this.usersService.checkCredentials(req.body.loginOrEmail, req.body.password,
                req.ip, reqUserAgent)

            if (!tokens) return res.sendStatus(StatusCodes.UNAUTHORIZED)

            res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true })
            return res.send({ accessToken: tokens.accessToken })
        } catch (error) {
            console.error(error)
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async getMeView(req: Request, res: Response<MeViewModel>) {
        try {
            const userId = req.userId
            if (!userId) res.sendStatus(StatusCodes.UNAUTHORIZED)

            const user = await this.usersQueryRepository.getMeView(userId!)
            if (!user) return res.sendStatus(StatusCodes.UNAUTHORIZED)

            return res.send(user)
        } catch (error) {
            console.error(error)
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async createUserForEmailConfirmation(req: RequestsWithBody<UserCreateModel>, res: Response) {
        try {
            const error = await this.usersService.createUserForEmailConfirmation(req.body)
            if (error) return res.status(StatusCodes.BAD_REQUEST).send(error)

            return res.sendStatus(StatusCodes.NO_CONTENT)
        } catch (error) {
            console.error(error)
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async confirmRegistration(req: RequestsWithBody<RegistrationConfirmationCodeModel>, res: Response) {
        try {
            const error = await this.usersService.confirmRegistration(req.body.code)
            if (error) return res.status(StatusCodes.BAD_REQUEST).send(error)

            return res.sendStatus(StatusCodes.NO_CONTENT)
        } catch (error) {
            console.error(error)
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async resendingConfirmationCodeToUser(req: RequestsWithBody<RegistrationEmailResendingModel>, res: Response) {
        try {
            const error = await this.usersService.resendingConfirmationCodeToUser(req.body.email)
            if (error) return res.status(StatusCodes.BAD_REQUEST).send(error)

            return res.sendStatus(StatusCodes.NO_CONTENT)
        } catch (error) {
            console.error(error)
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async updateUserRefreshToken(req: Request, res: Response) {
        try {
            if (!req.userId || !req.deviceId) return res.sendStatus(StatusCodes.UNAUTHORIZED)

            const reqUserAgent = req.headers["user-agent"]

            const tokens = await this.usersService.updateUserRefreshToken(req.userId, req.deviceId, req.ip, reqUserAgent)
            if (!tokens) return res.sendStatus(StatusCodes.UNAUTHORIZED)

            res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true })
            return res.send({ accessToken: tokens.accessToken })
        } catch (error) {
            console.error(error)
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async logoutUserSessionByDeviceID(req: Request, res: Response) {
        try {
            if (!req.userId || !req.deviceId) return res.sendStatus(StatusCodes.UNAUTHORIZED)

            const isDeleted = this.securityDevicesService.logoutUserSessionByDeviceID(req.deviceId, req.userId)
            if (!isDeleted) return res.sendStatus(StatusCodes.UNAUTHORIZED)

            res.clearCookie('refreshToken')
            return res.sendStatus(StatusCodes.NO_CONTENT)
        } catch (error) {
            console.error(error)
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async passwordRecovery(req: RequestsWithBody<RegistrationEmailResendingModel>, res: Response) {
        try {
            await this.usersService.passwordRecovery(req.body.email)
            return res.sendStatus(StatusCodes.NO_CONTENT)
        } catch (error) {
            console.error(error)
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async newPassword(req: RequestsWithBody<NewPasswordRecoveryInputModel>, res: Response) {
        try {
            const isUpdate = await this.usersService.newPassword(req.body.newPassword, req.body.recoveryCode)
            if (!isUpdate) {
                const error = GetDescriptionOfError('incorrect recovery code', 'recoveryCode')
                return res.status(StatusCodes.BAD_REQUEST).send(error)
            }

            return res.sendStatus(StatusCodes.NO_CONTENT)
        } catch (error) {
            console.error(error)
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }
}