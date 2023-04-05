import { body } from "express-validator";
import { blogsRepository } from "../repositories/blogs-repository";

export const PostValidate = [
    body('title')
        .exists({ checkFalsy: true }).bail()
        .isString().bail()
        .isLength({ max: 30 })
        .withMessage('must be no more than 30 chars'),    
    body('shortDescription')
        .exists({ checkFalsy: true }).bail()
        .isString().bail()
        .isLength({ max: 100 })
        .withMessage('must be no more than 100 chars'),  
    body('content')
        .exists({ checkFalsy: true }).bail()
        .isString().bail()
        .isLength({ max: 1000 })
        .withMessage('must be no more than 1000 chars'),
    body('blogId')
        .exists({ checkFalsy: true }).bail()
        .isString().bail()
        .custom(value => {
            const blog = blogsRepository.findBlogById(value)
            if (!blog) {
                throw new Error('Blog not found')
            }
            return true
        })               
]