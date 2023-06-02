import {Request, Response} from 'express'
import { UsersService } from "../../domain/users-service";
import { PaginatorUserViewModel } from "../../types/PaginatorType";
import { QueryParamsUsersModel } from "../../types/QueryParamsModels";
import { RequestsQuery, RequestsWithBody } from "../../types/types";
import { userDBToUserView } from '../../utils/utils';
import { UserViewModel } from '../../models/users/UserViewModel';
import { UserCreateModel } from '../../models/users/UserCreateModel';
import { StatusCodes } from 'http-status-codes';
import { URIParamsIdModel } from '../../types/URIParamsModel';

export class UsersController {
    constructor(protected usersService: UsersService) {}

    async getUsers(req: RequestsQuery<QueryParamsUsersModel>, res: Response<PaginatorUserViewModel>) {
        const usersDB = await this.usersService.getAllUsers(req.query)
        const users = {
            pagesCount: usersDB.pagesCount,
            page: usersDB.page,
            pageSize: usersDB.pageSize,
            totalCount: usersDB.totalCount,
            items: usersDB.items.map(i => userDBToUserView(i))
        }
        res.send(users)
    }

    async createUser(req: RequestsWithBody<UserCreateModel>, res: Response<UserViewModel>) {
        const newUserDB = await this.usersService.createUser(req.body)
        if (!newUserDB) return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)

        const newUser = userDBToUserView(newUserDB)
        
        res.status(StatusCodes.CREATED).send(newUser)
    }

    async deleteUser(req: Request<URIParamsIdModel>, res: Response) {
        const isDelete = await this.usersService.deleteUserById(req.params.id)
        if (!isDelete) return res.sendStatus(StatusCodes.NOT_FOUND)

        res.sendStatus(StatusCodes.NO_CONTENT)
    }
}