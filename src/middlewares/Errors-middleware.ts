import {Response, Request, NextFunction} from "express"
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { APIErrorResult, FieldError } from "../models/APIErrorModels";


export function ErrorsValidate(req: Request, res: Response<APIErrorResult>, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      const messages: FieldError[] = []
      for (let elem of errors.array()) {
        messages.push({message: elem.msg, field: elem.param})
      }

      return res.status(StatusCodes.BAD_REQUEST).json({ "errorsMessages": messages });
    } else {
      next()
    }
}