import { Router } from "express";
import { LoginValidation } from "../../middlewares/Login-validation-middleware";
import { ErrorsValidate } from "../../middlewares/Errors-middleware";
import { BearerAuthMiddleware } from "../../middlewares/BearerAuth-middleware";
import { UserValidate } from "../../middlewares/Users-validation-middleware";
import { AuthNewPasswordRecoveryValidate, AuthRegistrationConfirmationCodeValidate, AuthRegistrationEmailResendingValidate } from "../../middlewares/Auth-validation-middleware";
import { RefreshTokenMiddleware } from "../../middlewares/RefreshToken-middleware";
import { APICallsMiddleware } from "../../middlewares/APICalls-middleware";
import { authController } from "../../composition-root";


export const routerAuth = Router({})

routerAuth.post('/login', APICallsMiddleware, LoginValidation, ErrorsValidate,
    authController.loginUser.bind(authController)
)
routerAuth.get('/me', BearerAuthMiddleware, authController.getMeView.bind(authController))
routerAuth.post('/registration', APICallsMiddleware, UserValidate, ErrorsValidate,
    authController.createUserForEmailConfirmation.bind(authController)
)
routerAuth.post('/registration-confirmation', APICallsMiddleware, AuthRegistrationConfirmationCodeValidate, ErrorsValidate,
    authController.confirmRegistration.bind(authController)
)
routerAuth.post('/registration-email-resending', APICallsMiddleware, AuthRegistrationEmailResendingValidate, ErrorsValidate,
    authController.resendingConfirmationCodeToUser.bind(authController)
)
routerAuth.post('/refresh-token', RefreshTokenMiddleware, authController.updateUserRefreshToken.bind(authController))
routerAuth.post('/logout', RefreshTokenMiddleware, authController.logoutUserSessionByDeviceID.bind(authController))
routerAuth.post('/password-recovery', APICallsMiddleware, AuthRegistrationEmailResendingValidate, ErrorsValidate,
    authController.passwordRecovery.bind(authController)
)
routerAuth.post('/new-password', APICallsMiddleware, AuthNewPasswordRecoveryValidate, ErrorsValidate,
    authController.newPassword.bind(authController)
)