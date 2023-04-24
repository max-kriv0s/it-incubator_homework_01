import { body } from "express-validator"


export const UserValidate = [
    body('login')
        .trim()
        .exists({ checkFalsy: true })
        .isString()
        .isLength({ min: 3, max: 10 })
        .withMessage('must be between 3 and 15 characters')
        .matches('^[a-zA-Z0-9_-]*$'),
    body('password')
        .trim()    
        .exists({ checkFalsy: true })
        .isString()
        .isLength({ min: 6, max: 20 })
        .withMessage('must be between 6 and 20 characters'),
    body('email')
        .trim()
        .exists({ checkFalsy: true })
        .isString()
        .isEmail()
]
// .matches('^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')