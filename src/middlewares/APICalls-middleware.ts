import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { container } from "../composition-root";
import { ApiCallsRepository } from "../infrastructure/repositories/api-calls/api-calls-repository";


const apiCallsRepository = container.resolve(ApiCallsRepository)

export const APICallsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const result = await apiCallsRepository.addСallRecord(req.ip, req.originalUrl)
    if (!result) return res.sendStatus(StatusCodes.TOO_MANY_REQUESTS)

    const requestAllowed = await apiCallsRepository.requestAllowed(req.ip, req.originalUrl)
    if (!requestAllowed) return res.sendStatus(StatusCodes.TOO_MANY_REQUESTS)

    next()
}