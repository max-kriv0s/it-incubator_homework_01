import { ObjectId } from "mongodb"

export type UserDBModel = {
    _id: ObjectId
    login: string
    password: string
    email: string
    createdAt: string
    emailConfirmation: UserEmailConfirmationType
}

export type UserEmailConfirmationType = {
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}