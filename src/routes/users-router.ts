import { Request, Response, Router } from "express";
import { BasicAuthValidate } from "../middlewares/BasicAuth-validation-middleware";
import { PaginatorUserViewModel } from "../types.ts/PaginatorType";
import { RequestsQuery, RequestsWithBody } from "../types.ts/types";
import { QueryParamsUsersModel } from "../types.ts/QueryParamsModels";
import { usersService } from "../domain/users-service";
import { URIParamsIdModel } from "../types.ts/URIParamsIdModel";
import { StatusCodes } from "http-status-codes";
import { UserCreateModel } from "../models/users/UserCreateModel";
import { UserViewModel } from "../models/users/UserViewModel";
import { UserValidate } from "../middlewares/Users-validation-middleware";
import { ErrorsValidate } from "../middlewares/Errors-middleware";


export const routerUsers = Router({})

routerUsers.get('/',
    BasicAuthValidate,
    async (req: RequestsQuery<QueryParamsUsersModel>, res: Response<PaginatorUserViewModel>) => {
        
        const users = await usersService.getAllUsers(req.query)
        return users
    })

routerUsers.post('/', 
    BasicAuthValidate, 
    UserValidate,
    ErrorsValidate,   
    async (req: RequestsWithBody<UserCreateModel>, res: Response<UserViewModel>) => {
        const newUser = await usersService.createUser(req.body)
        res.status(StatusCodes.CREATED).send(newUser)
    })

routerUsers.delete('/:id',
    BasicAuthValidate, 
    async (req: Request<URIParamsIdModel>, res: Response) => {

        const isDelete = await usersService.deleteUserById(req.params.id)
        if (isDelete) {            
            res.sendStatus(StatusCodes.NO_CONTENT)      
        } else {
            res.sendStatus(StatusCodes.NOT_FOUND)
        } 
    })