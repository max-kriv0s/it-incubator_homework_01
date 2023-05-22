import {Response, Request, NextFunction} from "express"
import { ValidationError, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { APIErrorResult, FieldError } from "../types/APIErrorModels";


export function ErrorsValidate(req: Request, res: Response<APIErrorResult>, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {

      const errors: ValidationError[] = result.array({ onlyFirstError: true })
    //   const messages: FieldError[] = errors.map(err => ({message: err.msg, field: err.param}))
    
    //   return res.status(StatusCodes.BAD_REQUEST).json({ "errorsMessages": messages });
      
      const messages: FieldError[] = [{
        message: errors[0].msg, field: errors[0].param
      }]

      return res.status(StatusCodes.BAD_REQUEST).json({ "errorsMessages": messages });

    } else {
      next()
    }
}