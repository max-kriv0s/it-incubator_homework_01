import { APIErrorResult, FieldError } from "./models/APIErrorModels";
import { CreateVideoModel } from "./models/CreateVideoModel";
import { UpdateVideoModel } from "./models/UpdateVideoModel";

export function validateTitle(bodyReques: CreateVideoModel | UpdateVideoModel, errorsMessages: APIErrorResult): void {
    if (!bodyReques.title || typeof bodyReques.title !== 'string' || bodyReques.title.length > 40) {
        errorsMessages.push(getErrorMessage('not correct title', 'title'));
    }   
}

export function validateAuthor(bodyReques: CreateVideoModel | UpdateVideoModel, errorsMessages: APIErrorResult): void {
    if (!bodyReques.author || typeof bodyReques.author !== 'string' || bodyReques.author.length > 20) {
        errorsMessages.push(getErrorMessage('not correct author', 'author'))    
    }
}

export function validateMinAgeRestriction(bodyReques: UpdateVideoModel, errorsMessages: APIErrorResult): void { 
    if (bodyReques.minAgeRestriction && typeof bodyReques.minAgeRestriction === 'number') {
        if (bodyReques.minAgeRestriction < 1 || bodyReques.minAgeRestriction > 18) {
            errorsMessages.push(getErrorMessage('not correct minAgeRestriction', 'minAgeRestriction')) 
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