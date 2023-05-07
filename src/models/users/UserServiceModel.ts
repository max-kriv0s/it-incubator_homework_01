import { UserEmailConfirmationType, accountData } from "./UserDBModel"

export type UserServiceModel = {
    accountData: accountData
    emailConfirmation: UserEmailConfirmationType
}