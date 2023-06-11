import { Router } from "express"
import { BasicAuthValidate } from "../../middlewares/BasicAuth-validation-middleware"
import { ErrorsValidate } from "../../middlewares/Errors-middleware"
import { BlogValidate } from "../../middlewares/Blog-validation-middleware"
import { PostValidate } from "../../middlewares/Post-validation-middleware"
import { container } from "../../composition-root"
import { BlogsController } from "./blogs-controller"


const blogsController = container.resolve(BlogsController)

export const routerBlogs = Router()

routerBlogs.get('/', blogsController.getBlogsView.bind(blogsController))
routerBlogs.post('/', BasicAuthValidate, BlogValidate, ErrorsValidate,
    blogsController.createBlog.bind(blogsController)
)
routerBlogs.post('/:id/posts', BasicAuthValidate, PostValidate, ErrorsValidate,
    blogsController.createPostByBlogId.bind(blogsController)
)
routerBlogs.get('/:id', blogsController.getBlogViewById.bind(blogsController))
routerBlogs.get('/:id/posts', blogsController.findPostsByBlogId.bind(blogsController))
routerBlogs.put('/:id', BasicAuthValidate, BlogValidate, ErrorsValidate,
    blogsController.updateBlog.bind(blogsController)
)
routerBlogs.delete('/:id', BasicAuthValidate, blogsController.deleteBlog.bind(blogsController))

