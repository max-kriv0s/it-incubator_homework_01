import { ObjectId } from "mongodb"
import mongoose from "mongoose"


export class UserDBModel {
    constructor(
                public _id: ObjectId,
                public accountData: accountData,
                public emailConfirmation: UserEmailConfirmationType,
                public refreshToken: string,
                public passwordRecovery: UserPasswordRecovery
    ) {}
}

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



// interface IBaseEntity {
//     setEvent(event): void
//     getEvents(): Event[]
// }

// export class accountData {
//     constructor(dto: {login: string, email: string, password: string}) {
//         this.login = dto.login
//         this.email = dto.email
//         this.password = dto.password
//         this.createdAt = new Date().toString()
//     }

//     login: string
//     password: string
//     email: string
//     createdAt: string
// }

// UserSchema.methods = {
//     updateProfile(dto: Omit<accountData, 'createdAt'>) {
//         if(!this.isConfirmed) return false 

//         this.accountData = new accountData(dto)
//     }
// }

// class DomainUser implements IBaseEntity {
//     profile: Profile
//     confirmCode: string
//     constructor(data) {
//     this.profile = data.profile
//     }

//     events: string[]

//     setEvent(event: any): void {
//         this.events.push(event)
//     }

//     update(dto) {
//         this.confirmCode = dto.confirmCode
//         this.setEvent(new UserUpdatedEvent())
//     }
// }

//const user = repo.getUserById(id)
//user.canBlogUpdate(blog.id)
//const blog = blogRepo.get(id)
//blog.updateName()
//repo.save(user)
//blogrepo.save(blog)
//sendNotification()