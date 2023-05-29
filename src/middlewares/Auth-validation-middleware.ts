import { body } from "express-validator";

export const AuthRegistrationConfirmationCodeValidate = [
    body('code')
        .trim()
        .exists({ checkFalsy: true })
        .isString()
]

export const AuthRegistrationEmailResendingValidate = [
    body('email')
        .trim()
        .exists({ checkFalsy: true })
        .isString()
        .isEmail()
]

export const AuthNewPasswordRecoveryValidate = [
    body('newPassword')
        .trim()
        .exists({ checkFalsy: true })
        .isString()
        .isLength({ min: 6, max: 20 })
        .withMessage('must be between 6 and 20 characters'),
    body('recoveryCode')
        .trim()
        .exists({ checkFalsy: true })
        .isString()
]