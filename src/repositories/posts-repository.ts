import { PostCreateModel } from "../models/posts/PostCreateModel"
import { PostUpdateModel } from "../models/posts/PostUpdateModel"
import { PostViewModel } from "../models/posts/PostViewModel"
import { deleteValueById, newStringId } from "../utils/utils"
import { blogsRepository } from "./blogs-repository"

const post: PostViewModel = {
   id: '1',
   title: "new post",
   shortDescription: "new post blog 1",
   content: 'courses',
   blogId: '1',
   blogName: 'it-incubator'
}

let posts: PostViewModel[] = [post]


export const postsRepository = {
    async getPosts(): Promise<PostViewModel[]> {
        return posts
    },
    async findPostById(id: string): Promise<PostViewModel | undefined> {
        return posts.find(p => p.id === id)
    },
    async createPost(body: PostCreateModel): Promise<PostViewModel> {
        const blog = blogsRepository.findBlogById(body.blogId)
 
        const newPost: PostViewModel = {
            id: newStringId(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blog ? blog.name : ""
        }
        posts.push(newPost)

        return newPost
    },
    async updatePost(id: string, body: PostUpdateModel): Promise<boolean> {
        const post = posts.find(p => p.id === id)
        if (!post) { return false }

        const blog = blogsRepository.findBlogById(body.blogId)

        post.title = body.title
        post.shortDescription = body.shortDescription
        post.content = body.content
        post.blogId = body.blogId
        post.blogName = blog ? blog.name : ""

        return true
    },
    async deletePostById(id: string): Promise<boolean> {
       return deleteValueById(posts, id)  
    },
    async deletePosts() {
        posts = []
    }
}