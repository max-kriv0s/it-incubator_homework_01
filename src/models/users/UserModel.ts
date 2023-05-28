import { WithId } from "mongodb"
import mongoose from "mongoose"

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

export type UserDBModel = WithId<{
    accountData: accountData
    emailConfirmation: UserEmailConfirmationType,
    refreshToken: string
}>

const accountDataSchema = new mongoose.Schema<accountData>({
    login: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: {type: String, required: true}
})

const UserEmailConfirmationSchema = new mongoose.Schema<UserEmailConfirmationType>({
    confirmationCode: {type: String},
    expirationDate: {type: Date, required: true},
    isConfirmed: {type: Boolean, required: true}
})

const UserSchema = new mongoose.Schema<UserDBModel>({
    accountData: {type: accountDataSchema, required: true},
    emailConfirmation: {type: UserEmailConfirmationSchema, required: true},
    refreshToken: {type: String}
})

export const UserModel = mongoose.model<UserDBModel>('users', UserSchema)