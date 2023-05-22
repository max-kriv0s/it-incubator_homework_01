import { Request, Response, NextFunction } from "express";
import { apiCallsRepository } from "../repositories/api-calls-repository";
import { StatusCodes } from "http-status-codes";

export const APICallsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const result = await apiCallsRepository.addСallRecord(req.ip, req.originalUrl)
    if (!result) return res.sendStatus(StatusCodes.TOO_MANY_REQUESTS)

    const requestAllowed = await apiCallsRepository.requestAllowed(req.ip, req.originalUrl)
    if (!requestAllowed) return res.sendStatus(StatusCodes.TOO_MANY_REQUESTS)

    next()
}