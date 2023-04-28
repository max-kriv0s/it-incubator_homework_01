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
            if (!userDB) {
                res.sendStatus(StatusCodes.UNAUTHORIZED)               
            }
            
            res.send({
                email: userDB!.email,
                login: userDB!.login,
                userId: userId!
            })
            
    })