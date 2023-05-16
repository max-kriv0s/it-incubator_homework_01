import { Request, Response, Router } from "express";
import { RefreshTokenMiddleware } from "../middlewares/RefreshToken-middleware";
import { StatusCodes } from "http-status-codes";
import { securityDevicesService } from "../domain/security-devices-service";
import { SecurityDevicesViewModel } from "../models/devices/SecurityDevicesViewModel";
import { securityDevicesDBTosecurityDevicesView } from "../utils/utils";
import { URIParamsServiceDeviceIDModel } from "../types/URIParamsModel";
import { RequestsURIParams } from "../types/types";


export const SecurityDevicesRouter = Router({})

SecurityDevicesRouter
    .get('/', 
        RefreshTokenMiddleware,
        async (req: Request, res: Response<SecurityDevicesViewModel[]>) => {

            const devicesDB = await securityDevicesService.getAllUserDevices(req.userId!)
            if (!devicesDB) return res.sendStatus(StatusCodes.UNAUTHORIZED)
            
            return res.send(
                devicesDB.map(device => securityDevicesDBTosecurityDevicesView(device))
            )
        }
    )

    .delete('/', 
        RefreshTokenMiddleware,
        async (req: Request, res: Response) => {

            const isDeleted = await securityDevicesService.deleteAllUserDevices(req.userId!)
            if (!isDeleted) return res.sendStatus(StatusCodes.UNAUTHORIZED)

            res.sendStatus(StatusCodes.NO_CONTENT)
        }
    )

    .delete('/:deviceId',
        RefreshTokenMiddleware,
        async (req: RequestsURIParams<URIParamsServiceDeviceIDModel>, res: Response) => {

            const isDeleted = securityDevicesService.deleteUserDevice(req.params.deviceId, req.userId!)
            if (isDeleted === null) return res.sendStatus(StatusCodes.NOT_FOUND)
            if (!isDeleted) return res.sendStatus(StatusCodes.FORBIDDEN)

            res.sendStatus(StatusCodes.NO_CONTENT)
        }
    )