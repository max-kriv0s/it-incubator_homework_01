import { body } from "express-validator";
import { LikeStatus } from "../models/likes/LikeModel";

export const LikeValidate = [
    body('likeStatus')
        .trim()
        .exists({ checkFalsy: true })
        .isString()
        .custom(value=> {
            if (!Object.values(LikeStatus).includes(value)) {
                throw new Error('incorrect value')
            }
            return true
        })
]