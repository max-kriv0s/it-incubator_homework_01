import { BlogCreateModel } from "../models/blogs/BlogCreateModel"
import { BlogViewModel } from "../models/blogs/BlogViewModel"
import { BlogUpdateModel } from "../models/blogs/BlogUpdateModel"
import { deleteValueById, newStringId } from "../utils/utils"


const blog: BlogViewModel = {
    id: '1',
    name: 'it-incubator',
    description: 'Обучение Frontend и Backend',
    websiteUrl: 'https://it-incubator.io'
}

let blogs: BlogViewModel[] = [blog]

export const blogsRepository = {
    async getBlogs(): Promise<BlogViewModel[]> {
        return blogs
    },
    async findBlogById(id: string): Promise<BlogViewModel | undefined> {
        return blogs.find(b => b.id === id)   
    },
    async createBlog(body: BlogCreateModel): Promise<BlogViewModel> {
        const newBlog: BlogViewModel = {
            id: newStringId(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        }

        blogs.push(newBlog)
        
        return newBlog
    },
    async updateBlog(id: string, body: BlogUpdateModel): Promise<boolean> {
        const blog = blogs.find(b => b.id === id)
        if (!blog) { return false }

        blog.name = body.name
        blog.description = body.description
        blog.websiteUrl = body.websiteUrl

        return true
    },
    async deleteBlog(id: string): Promise<boolean> {
        return deleteValueById(blogs, id)
    }, 
    async deleteBlogs() {
        blogs = []
    }
}