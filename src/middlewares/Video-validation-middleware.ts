import { APIErrorResult, FieldError } from "../models/APIErrorModels";
import { CreateVideoModel } from "../models/CreateVideoModel";
import { UpdateVideoModel } from "../models/UpdateVideoModel";

const Resolutions: string[] = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'] 

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