import "reflect-metadata"
import { Container } from "inversify";
import { BlogsService } from "./adapter/blogs-service";
import { CommentsService } from "./adapter/comments-service";
import { PostsService } from "./adapter/posts-service";
import { SecurityDevicesService } from "./adapter/security-devices-service";
import { UsersService } from "./adapter/users-service";
import { ApiCallsRepository } from "./infrastructure/repositories/api-calls/api-calls-repository";
import { BlogsQueryRepository } from "./infrastructure/repositories/blogs/blogs-query-repository";
import { BlogsRepository } from "./infrastructure/repositories/blogs/blogs-repository";
import { CommentsQueryRepository } from "./infrastructure/repositories/comments/comments-query-repository";
import { CommentsRepository } from "./infrastructure/repositories/comments/comments-repository";
import { LikeRepository } from "./infrastructure/repositories/likes/likes-repository";
import { PostsQueryRepository } from "./infrastructure/repositories/posts/posts-query-repository";
import { PostsRepository } from "./infrastructure/repositories/posts/posts-repository";
import { SecurityDevicesQueryRepository } from "./infrastructure/repositories/security-devices/security-devices-query-repository";
import { SecurityDevicesRepository } from "./infrastructure/repositories/security-devices/security-devices-repository";
import { UsersQueryRepository } from "./infrastructure/repositories/users/users-query-repository";
import { UsersRepository } from "./infrastructure/repositories/users/users-repository";
import { AuthController } from "./routes/auth-router/auth-controller";
import { BlogsController } from "./routes/blogs/blogs-controller";
import { CommetsController } from "./routes/comments-router/comments-controller";
import { PostsController } from "./routes/posts/posts-controller";
import { SecurityDevicesController } from "./routes/security-devices/security-devices-controller";
import { UsersController } from "./routes/users/users-controller";
import { LikePostRepository } from "./infrastructure/repositories/likes/likes-posts-repository";


export const container = new Container()

// blogs
container.bind(BlogsRepository).to(BlogsRepository)
container.bind(BlogsQueryRepository).to(BlogsQueryRepository)
container.bind(BlogsService).to(BlogsService)
container.bind(BlogsController).to(BlogsController)

// posts
container.bind(PostsRepository).to(PostsRepository)
container.bind(PostsQueryRepository).to(PostsQueryRepository)
container.bind(PostsService).to(PostsService)
container.bind(PostsController).to(PostsController)

// users
container.bind(UsersRepository).to(UsersRepository)
container.bind(UsersQueryRepository).to(UsersQueryRepository)
container.bind(UsersService).to(UsersService)
container.bind(UsersController).to(UsersController)

// auth
container.bind(AuthController).to(AuthController)

// security devices
container.bind(SecurityDevicesRepository).to(SecurityDevicesRepository)
container.bind(SecurityDevicesQueryRepository).to(SecurityDevicesQueryRepository)
container.bind(SecurityDevicesService).to(SecurityDevicesService)
container.bind(SecurityDevicesController).to(SecurityDevicesController)

// comments
container.bind(CommentsRepository).to(CommentsRepository)
container.bind(CommentsQueryRepository).to(CommentsQueryRepository)
container.bind(CommentsService).to(CommentsService)
container.bind(CommetsController).to(CommetsController)

// api calls
container.bind(ApiCallsRepository).to(ApiCallsRepository)

// likes
container.bind(LikeRepository).to(LikeRepository) // comments like
container.bind(LikePostRepository).to(LikePostRepository)

// // repository
// export const blogsRepository = new BlogsRepository()
// export const postsRepository = new PostsRepository()
// export const usersRepository = new UsersRepository()
// export const securityDevicesRepository = new SecurityDevicesRepository()
// export const commentsRepository = new CommentsRepository()
// export const apiCallsRepository = new ApiCallsRepository()
// const likeRepository = new LikeRepository()

// // query repository
// const blogsQueryRepository = new BlogsQueryRepository()
// const postsQueryRepository = new PostsQueryRepository()
// const usersQueryRepository = new UsersQueryRepository()
// const securityDevicesQueryRepository = new SecurityDevicesQueryRepository()
// const commentsQueryRepository = new CommentsQueryRepository()

// // service
// export const blogsService = new BlogsService(blogsRepository, postsRepository)
// const postsService = new PostsService(postsRepository, blogsRepository, usersRepository, commentsRepository)
// export const securityDevicesService = new SecurityDevicesService(securityDevicesRepository)
// export const usersService = new UsersService(usersRepository, securityDevicesService)
// export const commentsService = new CommentsService(commentsRepository, usersRepository, likeRepository)

// // controller
// export const blogsController = new BlogsController(blogsService, blogsQueryRepository, postsQueryRepository)
// export const postsController = new PostsController(postsService, postsQueryRepository, commentsQueryRepository)
// export const securityDevicesController = new SecurityDevicesController(securityDevicesService, securityDevicesQueryRepository)
// export const usersController = new UsersController(usersService, usersQueryRepository)
// export const commetsController = new CommetsController(commentsService, commentsQueryRepository)
// export const authController = new AuthController(usersService, securityDevicesService, usersQueryRepository)