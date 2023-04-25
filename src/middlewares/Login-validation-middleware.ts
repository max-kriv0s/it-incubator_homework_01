import { body } from "express-validator";

export const LoginValidation = [
    body('loginOrEmail')
        .trim()
        .exists({ checkFalsy: true })
        .isString(),
    body('password')
        .trim()
        .exists({ checkFalsy: true })
        .isString()
]