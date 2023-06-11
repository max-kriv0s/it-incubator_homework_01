import { Request, Response } from 'express'
import { StatusCodes } from "http-status-codes";
import { SecurityDevicesService } from "../../adapter/security-devices-service";
import { SecurityDevicesViewModel } from '../../domain/security-devices/SecurityDevicesViewModel';
import { URIParamsServiceDeviceIDModel } from '../../types/URIParamsModel';
import { RequestsURIParams } from '../../types/types';
import { SecurityDevicesQueryRepository } from '../../infrastructure/repositories/security-devices/security-devices-query-repository';
import { inject, injectable } from 'inversify';


@injectable()
export class SecurityDevicesController {
    constructor(
        @inject(SecurityDevicesService) protected securityDevicesService: SecurityDevicesService,
        @inject(SecurityDevicesQueryRepository) protected securityDevicesQueryRepository: SecurityDevicesQueryRepository
    ) { }

    async getSecurityDevices(req: Request, res: Response<SecurityDevicesViewModel[]>) {
        try {
            const devices = await this.securityDevicesQueryRepository.getAllDevicesSessionsByUserID(req.userId!)
            if (!devices) return res.sendStatus(StatusCodes.UNAUTHORIZED)

            return res.send(devices)
        } catch (error) {
            console.error(error)
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async deleteSecurityDevices(req: Request, res: Response) {
        try {
            const isDeleted = await this.securityDevicesService.deleteAllDevicesSessionsByUserID(req.userId!, req.deviceId!)
            if (!isDeleted) return res.sendStatus(StatusCodes.UNAUTHORIZED)

            res.sendStatus(StatusCodes.NO_CONTENT)
        } catch (error) {
            console.error(error)
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

    async deleteSecurityDeviceByID(req: RequestsURIParams<URIParamsServiceDeviceIDModel>, res: Response) {
        try {
            const isDeleted = await this.securityDevicesService.deleteUserSessionByDeviceID(req.params.deviceId, req.userId!)
            if (isDeleted === null) return res.sendStatus(StatusCodes.FORBIDDEN)
            if (!isDeleted) return res.sendStatus(StatusCodes.NOT_FOUND)

            res.sendStatus(StatusCodes.NO_CONTENT)
        } catch (error) {
            console.error(error)
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }

}