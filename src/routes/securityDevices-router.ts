import { Request, Response, Router } from "express";
import { RefreshTokenMiddleware } from "../middlewares/RefreshToken-middleware";
import { StatusCodes } from "http-status-codes";
import { devicesService } from "../domain/devices-service";


export const SecurityDevicesRouter = Router({})

SecurityDevicesRouter
    .get('/', 
        RefreshTokenMiddleware,
        async (req: Request, res: Response) => {
            const userId = req.userId
            if (!userId) {
                return res.sendStatus(StatusCodes.UNAUTHORIZED)    
            }

            const devices = await devicesService.getAllUserDevices(userId)
            return res.send(devices)
        }
    )

    .delete('/', 
        async (req: Request, res: Response) => {

        }
    )

    .delete('/:deviceId',
        async (req: Request, res: Response) => {

        }
    )