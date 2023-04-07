import { body } from "express-validator"

const reWebsiteUrl = new RegExp('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')

export const BlogValidate = [
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
        .isLength({ max: 100 })
        .withMessage('must be no more than 100 chars')
        .custom(value => {
            if (!reWebsiteUrl.test(value)) {
                throw new Error('incorrect value')
            }
            return true
        })
]
