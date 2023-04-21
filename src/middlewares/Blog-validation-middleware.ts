import { body } from "express-validator"
import { blogsServise } from "../domain/blogs-service"

const reWebsiteUrl = new RegExp('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')

export const BlogValidate = [
    body('name')
        .trim()
        .exists({ checkFalsy: true }).bail()
        .isString().bail()
        .isLength({ max: 15 })
        .withMessage('must be no more than 15 chars'),
    body('description')
        .trim()    
        .exists({ checkFalsy: true }).bail()
        .isString().bail()
        .isLength({ max: 500 })
        .withMessage('must be no more than 500 chars'),
    body('websiteUrl')
        .trim()
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

export const BlogIdValidate = [
    body('blogId')
    .trim()    
    .exists({ checkFalsy: true }).bail()
    .isString().bail()
    .custom(async (value) => {
        const blog = await blogsServise.findBlogById(value)
        if (!blog) {
            throw new Error('Blog not found')
        }
        return true
    })  
]
