import { BlogCreateModel } from "../models/BlogCreateModel"
import { BlogViewModel } from "../models/BlogViewModel"


const blog: BlogViewModel = {
    id: '1',
    name: 'it-incubator',
    description: 'Обучение Frontend и Backend',
    websiteUrl: 'https://it-incubator.io'
}

let blogs: BlogViewModel[] = [blog]

export const blogsRepository = {
    getBlogs(): BlogViewModel[] {
        return blogs
    },
    createBlog(body: BlogCreateModel): BlogViewModel {
        const id = (new Date()).getTime().toString()
        const newBlog: BlogViewModel = {
            id: id,
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        }

        blogs.push(newBlog)
        
        return newBlog
    },
    deleteBlogs(): void {
        blogs = []
    }
}