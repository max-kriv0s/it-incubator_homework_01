import { body } from "express-validator";

import { APIErrorResult, FieldError } from "../types.ts/APIErrorModels";
import { CreateVideoModel } from "../models/videos/CreateVideoModel";
import { UpdateVideoModel } from "../models/videos/UpdateVideoModel";

const Resolutions: string[] = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'] 

const titleValidate = body('title')
    .exists({ checkFalsy: true }).bail()
    .isString().bail()
    .isLength({ max: 40 })
    .withMessage('must be no more than 40 chars')

const authorValidate = body('author')
    .exists({ checkFalsy: true }).bail()
    .isString().bail()
    .isLength({ max: 20 })
    .withMessage('must be no more than 20 chars')

const availableResolutionsValidate = body('availableResolutions')
    .exists({ checkFalsy: true }).bail()
    .isArray().bail()
    .isLength({ min: 1 }) 
    .custom(value => {
        for (let i = 0; i < value.length; i++) {
            if (!Resolutions.includes(value[i])) {
                throw new Error('incorrect value')
            }
        }
        return true
    })

const reDateTime = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/gm


export const VideoCreateValidate = [
    titleValidate,
    authorValidate,
    availableResolutionsValidate      
]

export const VideoUpdateValidate = [
    titleValidate,
    authorValidate,
    availableResolutionsValidate,
    body('canBeDownloaded')
        .if(body('canBeDownloaded').exists())
        .isBoolean(),
    body('minAgeRestriction')
        .if(body('minAgeRestriction').exists())
        .isLength({ min: 1, max: 18 }),
    body('publicationDate')
        .if(body('publicationDate').exists())
        .isString().bail()
        .custom(value => {
            if (!reDateTime.test(value)) {
                throw new Error('incorrect value')
            }
            return true
        })

]






export function validateTitle(bodyReques: CreateVideoModel | UpdateVideoModel, errors: APIErrorResult): void {
    if (!bodyReques.title || typeof bodyReques.title !== 'string' || bodyReques.title.length > 40) {
        errors.errorsMessages.push(getErrorMessage('not correct title', 'title'));
    }   
}

export function validateAuthor(bodyReques: CreateVideoModel | UpdateVideoModel, errors: APIErrorResult): void {
    if (!bodyReques.author || typeof bodyReques.author !== 'string' || bodyReques.author.length > 20) {
        errors.errorsMessages.push(getErrorMessage('not correct author', 'author'))    
    }
}

export function validateMinAgeRestriction(bodyReques: UpdateVideoModel, errors: APIErrorResult): void { 
    if (bodyReques.minAgeRestriction && typeof bodyReques.minAgeRestriction === 'number') {
        if (bodyReques.minAgeRestriction < 1 || bodyReques.minAgeRestriction > 18) {
            errors.errorsMessages.push(getErrorMessage('not correct minAgeRestriction', 'minAgeRestriction')) 
        }    
    }
}

export function validateCanBeDownloaded(bodyReques: UpdateVideoModel, errors: APIErrorResult): void {
    if (bodyReques.canBeDownloaded && typeof bodyReques.canBeDownloaded !== 'boolean') {
        errors.errorsMessages.push(getErrorMessage('not correct canBeDownloaded', 'canBeDownloaded')) 
    }
}

export function validatePublicationDate(bodyReques: UpdateVideoModel, errors: APIErrorResult): void {
    if (bodyReques.publicationDate && typeof bodyReques.publicationDate !== 'string') {
        errors.errorsMessages.push(getErrorMessage('not correct publicationDate', 'publicationDate')) 
    }
}

export function validateAvailableResolutions(bodyReques:CreateVideoModel | UpdateVideoModel, errors: APIErrorResult): void {
    if (!bodyReques.availableResolutions) {
        return
    }

    for (let elem of bodyReques.availableResolutions) {
        if (!Resolutions.includes(elem)) {
            errors.errorsMessages.push(getErrorMessage('not correct availableResolutions', 'availableResolutions'))
            return 
        }
    }
}

function getErrorMessage(message: string, field: string): FieldError {
    const errorMessage: FieldError = {
        message: message,
        field: field
    }

    return errorMessage;
}