import { Router } from "express";
import { UserValidate } from "../../middlewares/Users-validation-middleware";
import { ErrorsValidate } from "../../middlewares/Errors-middleware";
import { container} from "../../composition-root";
import { BasicAuthValidate } from "../../middlewares/BasicAuth-validation-middleware";
import { UsersController } from "./users-controller";


const usersController = container.resolve(UsersController)

export const routerUsers = Router({})

routerUsers.get('/', BasicAuthValidate, usersController.getUsers.bind(usersController))
routerUsers.post('/', BasicAuthValidate, UserValidate, ErrorsValidate,
    usersController.createUser.bind(usersController)
)
routerUsers.delete('/:id', BasicAuthValidate, usersController.deleteUserByID.bind(usersController))