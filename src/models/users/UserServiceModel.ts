import { UserEmailConfirmationType, accountData } from "./UserModel"

export type UserServiceModel = {
    accountData: accountData
    emailConfirmation: UserEmailConfirmationType
}