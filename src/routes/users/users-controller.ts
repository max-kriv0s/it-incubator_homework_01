import { Request, Response } from 'express'
import { UsersService } from "../../adapter/users-service";
import { PaginatorUserViewModel } from "../../types/PaginatorType";
import { QueryParamsUsersModel } from "../../types/QueryParamsModels";
import { RequestsQuery, RequestsWithBody } from "../../types/types";
import { UserViewModel } from '../../domain/users/UserViewModel';
import { UserCreateModel } from '../../domain/users/UserCreateModel';
import { StatusCodes } from 'http-status-codes';
import { URIParamsIdModel } from '../../types/URIParamsModel';
import { inject, injectable } from 'inversify';
import { UsersQueryRepository } from '../../infrastructure/repositories/users/users-query-repository';


@injectable()
export class UsersController {
    constructor(
        @inject(UsersService) protected usersService: UsersService,
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository
    ) { }

    async getUsers(req: RequestsQuery<QueryParamsUsersModel>, res: Response<PaginatorUserViewModel>) {
        try {
            const users = await this.usersQueryRepository.getAllUsersView(req.query)
            res.send(users)
        } catch (error) {
            console.error(error)
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async createUser(req: RequestsWithBody<UserCreateModel>, res: Response<UserViewModel>) {
        try {
            const userDB = await this.usersService.createUser(req.body)
            if (!userDB) return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)

            const newUser = await this.usersQueryRepository.getUserViewById(userDB._id)
            if (!newUser) return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)

            res.status(StatusCodes.CREATED).send(newUser)

        } catch (error) {
            console.error(error)
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async deleteUserByID(req: Request<URIParamsIdModel>, res: Response) {
        try {
            const isDelete = await this.usersService.deleteUserById(req.params.id)
            if (!isDelete) return res.sendStatus(StatusCodes.NOT_FOUND)

            res.sendStatus(StatusCodes.NO_CONTENT)
        } catch (error) {
            console.error(error)
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }
}