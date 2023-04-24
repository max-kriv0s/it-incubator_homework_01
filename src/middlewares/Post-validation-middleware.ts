import { body } from "express-validator";


export const PostValidate = [
    body('title')
        .trim()
        .exists({ checkFalsy: true })
        .isString()
        .isLength({ max: 30 })
        .withMessage('must be no more than 30 chars'),    
    body('shortDescription')
        .trim()
        .exists({ checkFalsy: true })
        .isString()
        .isLength({ max: 100 })
        .withMessage('must be no more than 100 chars'),  
    body('content')
        .trim()
        .exists({ checkFalsy: true })
        .isString()
        .isLength({ max: 1000 })
        .withMessage('must be no more than 1000 chars'),             
]