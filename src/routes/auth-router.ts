import { Response, Request, Router } from "express";
import { RequestsWithBody } from "../types/types";
import { LoginInputModel } from "../models/auth/LoginInputModel";
import { LoginValidation } from "../middlewares/Login-validation-middleware";
import { StatusCodes } from "http-status-codes";
import { usersService } from "../domain/users-service";
import { ErrorsValidate } from "../middlewares/Errors-middleware";
import { jwtService } from "../application/jwt-service";
import { MeViewModel } from "../models/auth/MeViewModel";
import { BearerAuthMiddleware } from "../middlewares/BearerAuth-middleware";
import { UserCreateModel } from "../models/users/UserCreateModel";
import { UserValidate } from "../middlewares/Users-validation-middleware";
import { RegistrationConfirmationCodeModel } from "../models/auth/RegistrationConfirmationCodeModel";
import { AuthRegistrationConfirmationCodeValidate, AuthRegistrationEmailResendingValodate } from "../middlewares/Auth-validation-middleware";
import { RegistrationEmailResendingModel } from "../models/auth/RegistrationEmailResendingModel";


export const routerAuth = Router({})

routerAuth
    .post('/login', 
        LoginValidation,
        ErrorsValidate,
        async (req: RequestsWithBody<LoginInputModel>, res: Response) => {
            const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
            if (user) {
                const token = await jwtService.createJWT(user)
                res.send({ accessToken: token })
            } else {
                res.sendStatus(StatusCodes.UNAUTHORIZED)
            }
    })
    
    .get('/me', 
        BearerAuthMiddleware,
        async (req: Request, res: Response<MeViewModel>) => {
            const userId = req.userId
            if (!userId) {
                res.sendStatus(StatusCodes.UNAUTHORIZED)    
            }
            
            const userDB = await usersService.findUserById(userId!)
            if (userDB) {     
                res.send({
                    email: userDB.email,
                    login: userDB.login,
                    userId: userId!
                })
            } else {
                res.sendStatus(StatusCodes.UNAUTHORIZED)
            }
    })

    .post('/registration',
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