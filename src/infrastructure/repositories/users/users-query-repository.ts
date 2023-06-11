import { ObjectId } from "mongodb";
import { validID } from "../db";
import { injectable } from "inversify";
import { QueryParamsUsersModel } from "../../../types/QueryParamsModels";
import { PaginatorUserViewModel } from "../../../types/PaginatorType";
import { UserDBModel, UserModel } from "../../../domain/users/UserModel";
import { UserViewModel } from "../../../domain/users/UserViewModel";
import { MeViewModel } from "../../../domain/auth/MeViewModel";


@injectable()
export class UsersQueryRepository {

    async getAllUsersView(queryParams: QueryParamsUsersModel): Promise<PaginatorUserViewModel> {

        const pageNumber = queryParams.pageNumber ? +queryParams.pageNumber : 1
        const pageSize = queryParams.pageSize ? +queryParams.pageSize : 10
        const sortBy = queryParams.sortBy ? queryParams.sortBy : 'createdAt'
        const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc'
        const searchLoginTerm = queryParams.searchLoginTerm ? queryParams.searchLoginTerm : null
        const searchEmailTerm = queryParams.searchEmailTerm ? queryParams.searchEmailTerm : null

        let filter: any = {}
        if (searchLoginTerm && searchEmailTerm) {
            filter = {
                $or: [
                    { "accountData.login": { $regex: searchLoginTerm, $options: 'i' } },
                    { "accountData.email": { $regex: searchEmailTerm, $options: 'i' } }
                ]
            }
        } else if (searchLoginTerm) {
            filter = { "accountData.login": { $regex: searchLoginTerm, $options: 'i' } }
        } else if (searchEmailTerm) {
            filter = { "accountData.email": { $regex: searchEmailTerm, $options: 'i' } }
        }

        const totalCount: number = await UserModel.countDocuments(filter)
        const skip = (pageNumber - 1) * pageSize

        const usersDB: UserDBModel[] = await UserModel.find(filter, null, {
            sort: { ["accountData." + sortBy]: sortDirection === 'asc' ? 1 : -1 },
            skip: skip,
            limit: pageSize
        }).exec()

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: usersDB.map(i => this.userDBToUserView(i))
        }
    }

    async getUserViewById(id: string | ObjectId): Promise<UserViewModel | null> {
        if (typeof id === 'string' && !validID(id)) return null
        
        const userDB = await UserModel.findById(id).exec()
        if (!userDB) return null

        return this.userDBToUserView(userDB)
    }

    async getMeView(id: string): Promise<MeViewModel | null> {
        if (!validID(id)) return null
        
        const userDB = await UserModel.findById(id)
        if (!userDB) return null

        return {
            email: userDB.accountData.email,
            login: userDB.accountData.login,
            userId: id
        }
    }

    userDBToUserView(user: UserDBModel): UserViewModel {
        return {
            id: user._id.toString(),
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt
        }
    }
}