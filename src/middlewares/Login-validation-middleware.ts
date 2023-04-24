import { body } from "express-validator";

export const LoginValidation = [
    body('login')
        .trim()
        .exists({ checkFalsy: true })
        .isString(),
    body('password')
        .trim()
        .exists({ checkFalsy: true })
        .isString()
]