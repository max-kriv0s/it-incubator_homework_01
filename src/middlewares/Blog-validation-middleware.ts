import { body } from "express-validator"


export const BlogCreateValidate = [
    body('name')
            .exists({ checkFalsy: true }).bail()
            .isString().bail()
        .isLength({ max: 15 })
        .withMessage('must be no more than 15 chars'),
    body('description')
        .exists({ checkFalsy: true }).bail()
        .isString().bail()
        .isLength({ max: 500 })
        .withMessage('must be no more than 500 chars'),
    body('websiteUrl')
        .exists({ checkFalsy: true }).bail()
        .isString().bail()
        .isURL({protocols: ['https']}).bail()
        .isLength({ max: 100 })
        .withMessage('must be no more than 100 chars'),
]

