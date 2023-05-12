import { ObjectId } from "mongodb"

export type accountData = {
    login: string
    password: string
    email: string
    createdAt: string
}

export type UserEmailConfirmationType = {
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}

export type UserDBModel = {
    _id: ObjectId
    accountData: accountData
    emailConfirmation: UserEmailConfirmationType,
    refreshToken: string
}