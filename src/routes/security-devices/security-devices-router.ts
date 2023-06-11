import { Router } from "express";
import { RefreshTokenMiddleware } from "../../middlewares/RefreshToken-middleware";
import { container } from "../../composition-root";
import { SecurityDevicesController } from "./security-devices-controller";


const securityDevicesController = container.resolve(SecurityDevicesController)

export const SecurityDevicesRouter = Router({})

SecurityDevicesRouter.get('/', RefreshTokenMiddleware,
    securityDevicesController.getSecurityDevices.bind(securityDevicesController)
)
SecurityDevicesRouter.delete('/', RefreshTokenMiddleware,
    securityDevicesController.deleteSecurityDevices.bind(securityDevicesController)
)
SecurityDevicesRouter.delete('/:deviceId', RefreshTokenMiddleware,
    securityDevicesController.deleteSecurityDeviceByID.bind(securityDevicesController)
)