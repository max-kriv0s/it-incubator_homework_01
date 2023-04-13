import { body } from "express-validator";
import { blogsRepository } from "../repositories/blogs-repository";

export const PostValidate = [
    body('title')
        .trim()
        .exists({ checkFalsy: true }).bail()
        .isString().bail()
        .isLength({ max: 30 })
        .withMessage('must be no more than 30 chars'),    
    body('shortDescription')
        .trim()
        .exists({ checkFalsy: true }).bail()
        .isString().bail()
        .isLength({ max: 100 })
        .withMessage('must be no more than 100 chars'),  
    body('content')
        .trim()
        .exists({ checkFalsy: true }).bail()
        .isString().bail()
        .isLength({ max: 1000 })
        .withMessage('must be no more than 1000 chars'),
    body('blogId')
        .trim()    
        .exists({ checkFalsy: true }).bail()
        .isString().bail()
        .custom(async (value) => {
            const blog = await blogsRepository.findBlogById(value)
            if (!blog) {
                throw new Error('Blog not found')
            }
            return true
        })               
]