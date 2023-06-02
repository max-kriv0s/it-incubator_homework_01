import { UsersService } from "./domain/users-service";
import { UsersRepository } from "./repositories/users-repository";


const usersRepository = new UsersRepository()
const usersServices = new UsersService(usersRepository)