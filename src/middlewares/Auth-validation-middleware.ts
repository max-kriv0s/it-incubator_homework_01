import { body } from "express-validator";

export const AuthRegistrationConfirmationCodeValidate = [
    body('code')
        .trim()
        .exists({ checkFalsy: true })
        .isString()
]

export const AuthRegistrationEmailResendingValodate = [
    body('email')
        .trim()
        .exists({ checkFalsy: true })
        .isString()
        .isEmail()
]