import { Request, Response, Router } from "express";
import { RequestsWithBody } from "../types.ts/types";
import { LoginInputModel } from "../models/auth/LoginInputModel";
import { LoginValidation } from "../middlewares/Login-validation-middleware";
import { StatusCodes } from "http-status-codes";
import { usersService } from "../domain/users-service";


export const routerAuth = Router()

routerAuth.post('/login', 
    LoginValidation,
    async (req: RequestsWithBody<LoginInputModel>, res: Response) => {
        const validPassword = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (validPassword) {
            res.sendStatus(StatusCodes.NO_CONTENT)
        } else {
            res.sendStatus(StatusCodes.UNAUTHORIZED)
        }
})