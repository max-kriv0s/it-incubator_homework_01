import { Router } from "express";
import { UserValidate } from "../../middlewares/Users-validation-middleware";
import { ErrorsValidate } from "../../middlewares/Errors-middleware";
import { usersController } from "../../composition-root";
import { BasicAuthValidate } from "../../middlewares/BasicAuth-validation-middleware";


export const routerUsers = Router({})

routerUsers.get('/', BasicAuthValidate, usersController.getUsers.bind(usersController))
routerUsers.post('/', BasicAuthValidate, UserValidate, ErrorsValidate,
    usersController.createUser.bind(usersController)
)
routerUsers.delete('/:id', BasicAuthValidate, usersController.deleteUserByID.bind(usersController))