import { BlogCreateModel } from "../models/BlogCreateModel"
import { BlogViewModel } from "../models/BlogViewModel"
import { BlogUpdateModel } from "../models/BlogUpdateModel"
import { deleteValueById, newStringId } from "../utils/utils"


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
    findBlogById(id: string): BlogViewModel | undefined {
        return blogs.find(b => b.id === id)   
    },
    createBlog(body: BlogCreateModel): BlogViewModel {
        const newBlog: BlogViewModel = {
            id: newStringId(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        }

        blogs.push(newBlog)
        
        return newBlog
    },
    updateBlog(id: string, body: BlogUpdateModel): boolean {
        const blog = blogs.find(b => b.id === id)
        if (!blog) { return false }

        blog.name = body.name
        blog.description = body.description
        blog.websiteUrl = body.websiteUrl

        return true
    },
    deleteBlog(id: string): boolean{
        return deleteValueById(blogs, id)
    }, 
    deleteBlogs(): void {
        blogs = []
    }
}