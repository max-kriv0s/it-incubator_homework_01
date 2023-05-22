import { Response, Request, Router } from "express";
import { RequestsWithBody } from "../types/types";
import { LoginInputModel } from "../models/auth/LoginInputModel";
import { LoginValidation } from "../middlewares/Login-validation-middleware";
import { StatusCodes } from "http-status-codes";
import { usersService } from "../domain/users-service";
import { ErrorsValidate } from "../middlewares/Errors-middleware";
import { MeViewModel } from "../models/auth/MeViewModel";
import { BearerAuthMiddleware } from "../middlewares/BearerAuth-middleware";
import { UserCreateModel } from "../models/users/UserCreateModel";
import { UserValidate } from "../middlewares/Users-validation-middleware";
import { RegistrationConfirmationCodeModel } from "../models/auth/RegistrationConfirmationCodeModel";
import { AuthRegistrationConfirmationCodeValidate, AuthRegistrationEmailResendingValodate } from "../middlewares/Auth-validation-middleware";
import { RegistrationEmailResendingModel } from "../models/auth/RegistrationEmailResendingModel";
import { RefreshTokenMiddleware } from "../middlewares/RefreshToken-middleware";
import { securityDevicesService } from "../domain/security-devices-service";
import { APICallsMiddleware } from "../middlewares/APICalls-middleware";


export const routerAuth = Router({})

routerAuth
    .post('/login',
        APICallsMiddleware,
        LoginValidation,
        ErrorsValidate,
        async (req: RequestsWithBody<LoginInputModel>, res: Response) => {
            
            const reqUserAgent = req.headers["user-agent"]
            
            const tokens = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password, 
                    req.ip, reqUserAgent)
            if (tokens) {
                res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true,secure: true})
                res.send({ accessToken: tokens.accessToken })                
            } else {
                res.sendStatus(StatusCodes.UNAUTHORIZED)
            }
    })
    
    .get('/me', 
        BearerAuthMiddleware,
        async (req: Request, res: Response<MeViewModel>) => {
            const userId = req.userId
            if (!userId) res.sendStatus(StatusCodes.UNAUTHORIZED)
            
            const userDB = await usersService.findUserById(userId!)
            if (userDB) {     
                res.send({
                    email: userDB.accountData.email,
                    login: userDB.accountData.login,
                    userId: userId!
                })
            } else {
                res.sendStatus(StatusCodes.UNAUTHORIZED)
            }
    })

    .post('/registration',
        APICallsMiddleware,
        UserValidate,
        ErrorsValidate,
        async (req: RequestsWithBody<UserCreateModel>, res: Response) => {

            const error = await usersService.createUserForEmailConfirmation(req.body)
            if (!error) {
                res.sendStatus(StatusCodes.NO_CONTENT)
            } else {
                res.status(StatusCodes.BAD_REQUEST).send(error)
            }
    })

    .post('/registration-confirmation',
        APICallsMiddleware,
        AuthRegistrationConfirmationCodeValidate,
        ErrorsValidate,
        async (req: RequestsWithBody<RegistrationConfirmationCodeModel>, res: Response) => {
            
            const error = await usersService.confirmRegistration(req.body.code)
            if (!error) {
                res.sendStatus(StatusCodes.NO_CONTENT)
            } else {
                res.status(StatusCodes.BAD_REQUEST).send(error)
            }
        }
    )

    .post('/registration-email-resending',
        APICallsMiddleware,
        AuthRegistrationEmailResendingValodate,
        ErrorsValidate,
        async (req: RequestsWithBody<RegistrationEmailResendingModel>, res: Response) => {
            
            const error = await usersService.resendingConfirmationCodeToUser(req.body.email)
            if (!error) {
                res.sendStatus(StatusCodes.NO_CONTENT)
            } else {
                res.status(StatusCodes.BAD_REQUEST).send(error)
            }
        }
    )

    .post('/refresh-token',
        RefreshTokenMiddleware,
        async (req: Request, res: Response) => {

            const userId = req.userId
            const deviceId = req.deviceId
            if (!userId || !deviceId) return res.sendStatus(StatusCodes.UNAUTHORIZED)

            const reqUserAgent = req.headers["user-agent"]

            const tokens = await usersService.updateUserRefreshToken(userId, deviceId, req.ip, reqUserAgent)
            if (!tokens) return res.sendStatus(StatusCodes.UNAUTHORIZED)

            res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true,secure: true})
            res.send({ accessToken: tokens.accessToken })
        }
    )

    .post('/logout',
        RefreshTokenMiddleware,
        async (req: Request, res: Response) => {

            const userId = req.userId
            const deviceId = req.deviceId
            if (!userId || !deviceId) return res.sendStatus(StatusCodes.UNAUTHORIZED)

            const isDeleted = securityDevicesService.logoutUserSessionByDeviceID(deviceId, userId)
            if (!isDeleted) return res.sendStatus(StatusCodes.UNAUTHORIZED)

            res.clearCookie('refreshToken')
            res.sendStatus(StatusCodes.NO_CONTENT)
        }
    )