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

export type UserPasswordRecovery = {
    recoveryCode: string
    expirationDate: Date
}

export type UserDBModel = WithId<{
    accountData: accountData
    emailConfirmation: UserEmailConfirmationType,
    refreshToken: string,
    passwordRecovery: UserPasswordRecovery
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

const UserPasswordRecoverySchema = new mongoose.Schema<UserPasswordRecovery>({
    recoveryCode: {type: String},
    expirationDate: {type: Date}
})

const UserSchema = new mongoose.Schema<UserDBModel>({
    accountData: {type: accountDataSchema, required: true},
    emailConfirmation: {type: UserEmailConfirmationSchema, required: true},
    refreshToken: {type: String},
    passwordRecovery: {
        type : UserPasswordRecoverySchema, 
        required: true}
})

export const UserModel = mongoose.model<UserDBModel>('users', UserSchema)