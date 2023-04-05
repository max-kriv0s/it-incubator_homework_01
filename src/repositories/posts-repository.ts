import { PostCreateModel } from "../models/PostCreateModel"
import { PostUpdateModel } from "../models/PostUpdateModel"
import { PostViewModel } from "../models/PostViewModel"
import { newStringId } from "../utils/utils"
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
    getPosts(): PostViewModel[] {
        return posts
    },
    findPostById(id: string): PostViewModel | undefined {
        return posts.find(p => p.id === id)
    },
    createPost(body: PostCreateModel): PostViewModel {
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
    updatePost(id: string, body: PostUpdateModel): boolean {
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
    deletePostById(id: string): boolean {
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].id === id) {
                posts.splice(i, 1)
                return true
            }
        }
        return false   
    },
    deletePosts(): void {
        posts = []
    }
}