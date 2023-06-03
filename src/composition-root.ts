import { BlogsService } from "./domain/blogs-service";
import { CommentsService } from "./domain/comments-service";
import { PostsService } from "./domain/posts-service";
import { SecurityDevicesService } from "./domain/security-devices-service";
import { UsersService } from "./domain/users-service";
import { ApiCallsRepository } from "./repositories/api-calls-repository/api-calls-repository";
import { BlogsQueryRepository } from "./repositories/blogs/blogs-query-repository";
import { BlogsRepository } from "./repositories/blogs/blogs-repository";
import { CommentsQueryRepository } from "./repositories/comments-repository/comments-query-repository";
import { CommentsRepository } from "./repositories/comments-repository/comments-repository";
import { PostsQueryRepository } from "./repositories/posts/posts-query-repository";
import { PostsRepository } from "./repositories/posts/posts-repository";
import { SecurityDevicesQueryRepository } from "./repositories/security-devices/security-devices-query-repository";
import { SecurityDevicesRepository } from "./repositories/security-devices/security-devices-repository";
import { UsersQueryRepository } from "./repositories/users/users-query-repository";
import { UsersRepository } from "./repositories/users/users-repository";
import { AuthController } from "./routes/auth-router/auth-controller";
import { BlogsController } from "./routes/blogs/blogs-controller";
import { CommetsController } from "./routes/comments-router/comments-controller";
import { PostsController } from "./routes/posts/posts-controller";
import { SecurityDevicesController } from "./routes/security-devices/security-devices-controller";
import { UsersController } from "./routes/users/users-controller";

// repository
export const blogsRepository = new BlogsRepository()
export const postsRepository = new PostsRepository()
export const usersRepository = new UsersRepository()
export const securityDevicesRepository = new SecurityDevicesRepository()
export const commentsRepository = new CommentsRepository()
export const apiCallsRepository = new ApiCallsRepository()

// query repository
const blogsQueryRepository = new BlogsQueryRepository()
const postsQueryRepository = new PostsQueryRepository()
const usersQueryRepository = new UsersQueryRepository()
const securityDevicesQueryRepository = new SecurityDevicesQueryRepository()
const commentsQueryRepository = new CommentsQueryRepository()

// service
export const blogsService = new BlogsService(blogsRepository, postsRepository)
const postsService = new PostsService(postsRepository, blogsRepository, usersRepository, commentsRepository)
export const securityDevicesService = new SecurityDevicesService(securityDevicesRepository)
export const usersService = new UsersService(usersRepository, securityDevicesService)
export const commentsService = new CommentsService(commentsRepository, usersRepository)

// controller
export const blogsController = new BlogsController(blogsService, blogsQueryRepository, postsQueryRepository)
export const postsController = new PostsController(postsService, postsQueryRepository, commentsQueryRepository)
export const securityDevicesController = new SecurityDevicesController(securityDevicesService, securityDevicesQueryRepository)
export const usersController = new UsersController(usersService, usersQueryRepository)
export const commetsController = new CommetsController(commentsService, commentsQueryRepository)
export const authController = new AuthController(usersService, securityDevicesService, usersQueryRepository)