import { UserEmailConfirmationType } from "./UserDBModel"

export type UserServiceModel = {
    login: string
    password: string
    email: string
    createdAt: string
    emailConfirmation: UserEmailConfirmationType
}