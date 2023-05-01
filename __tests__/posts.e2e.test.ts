import request from "supertest";
import { app } from "../src/app";
import { StatusCodes } from "http-status-codes";
import { PostViewModel } from "../src/models/posts/PostViewModel";
import { PostCreateModel } from "../src/models/posts/PostCreateModel";
import { randomString } from "../src/utils/utils";
import { BlogCreateModel } from "../src/models/blogs/BlogCreateModel";
import { BlogViewModel } from "../src/models/blogs/BlogViewModel";
import { PostUpdateModel } from "../src/models/posts/PostUpdateModel";
import { client } from "../src/repositories/db";


describe('/blogs', () => {

    const ADMIN_LOGIN = process.env.ADMIN_LOGIN ? process.env.ADMIN_LOGIN : ''
    let blog: BlogViewModel;

    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(StatusCodes.NO_CONTENT)

        const dataBlog:BlogCreateModel = {
           name: randomString(10),
           description: randomString(30),
           websiteUrl: 'https://www.google.com/'
        }

        const res = await request(app)
                        .post('/blogs')
                        .set('Authorization', ADMIN_LOGIN)
                        .send(dataBlog)
                        .expect(StatusCodes.CREATED)

        blog = res.body
    })

    afterAll(async () => {
        client.close()
    })

    it ('- GET posts = []', async () => {
        await request(app)
            .get('/posts')
            .expect(StatusCodes.OK, 
                { 
                    pagesCount: 0, 
                    page: 1, 
                    pageSize: 10, 
                    totalCount: 0, 
                    items: [] 
                })
    })

    it('- GET post by ID with incorrect id', async () => {
        await request(app)
            .get('/posts/-1')
            .expect(StatusCodes.NOT_FOUND)
    })

    it ('- POST create the post authorization error', async () => {
        const data: PostCreateModel = {
            "title": randomString(10),
            "shortDescription": randomString(30),
            "content": randomString(100),
            "blogId": blog.id
        }
        
        await request(app)
            .post('/blogs')
            .expect(StatusCodes.UNAUTHORIZED)
    })

    it ('- POST create the post with incorrect title', async () => {
        const data: PostCreateModel = {
            "title": randomString(40),
            "shortDescription": randomString(30),
            "content": randomString(100),
            "blogId": blog.id
        }
        
        const res = await request(app)
                        .post('/posts')
                        .set('Authorization', ADMIN_LOGIN)
                        .send(data)
                        .expect(StatusCodes.BAD_REQUEST)

        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    message: expect.any(String),
                    field: 'title'
                }
            ]
        })
    })

    it ('- POST create the post with incorrect shortDescription', async () => {
        const data: PostCreateModel = {
            "title": randomString(10),
            "shortDescription": randomString(300),
            "content": randomString(100),
            "blogId": blog.id
        }
        
        const res = await request(app)
                        .post('/posts')
                        .set('Authorization', ADMIN_LOGIN)
                        .send(data)
                        .expect(StatusCodes.BAD_REQUEST)

        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    message: expect.any(String),
                    field: 'shortDescription'
                }
            ]
        })
    })

    it ('- POST create the post with incorrect content', async () => {
        const data: PostCreateModel = {
            "title": randomString(10),
            "shortDescription": randomString(50),
            "content": randomString(1100),
            "blogId": blog.id
        }
        
        const res = await request(app)
                        .post('/posts')
                        .set('Authorization', ADMIN_LOGIN)
                        .send(data)
                        .expect(StatusCodes.BAD_REQUEST)

        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    message: expect.any(String),
                    field: 'content'
                }
            ]
        })
    })

    it ('- POST create the post with incorrect blogId', async () => {
        const data: PostCreateModel = {
            "title": randomString(10),
            "shortDescription": randomString(50),
            "content": randomString(100),
            "blogId": '-1'
        }
        
        const res = await request(app)
                        .post('/posts')
                        .set('Authorization', ADMIN_LOGIN)
                        .send(data)
                        .expect(StatusCodes.BAD_REQUEST)

        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    message: expect.any(String),
                    field: 'blogId'
                }
            ]
        })
    })

    let newPost: PostViewModel;
    it('- POST create the post with correct data', async () => {
        const data: PostCreateModel = {
            "title": randomString(10),
            "shortDescription": randomString(50),
            "content": randomString(100),
            "blogId": blog.id
        }
        
        const res = await request(app)
                        .post('/posts')
                        .set('Authorization', ADMIN_LOGIN)
                        .send(data)
                        .expect(StatusCodes.CREATED)

        newPost = res.body

        expect(newPost).toEqual({
            id: expect.any(String),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: blog.id,
            blogName: blog.name,
            createdAt: expect.any(String)
        })

        await request(app)
            .get('/posts')
            .expect(StatusCodes.OK, 
                { 
                    pagesCount: 1, 
                    page: 1, 
                    pageSize: 10, 
                    totalCount: 1, 
                    items: [newPost] 
                })
    })

    it ('- GET post by ID with correct id', async () => {
        await request(app)
            .get('/posts/' + newPost.id)
            .expect(StatusCodes.OK, newPost)
    })

    it ('- PUT update the post authorization error', async () => {
        const data: PostUpdateModel = {
            "title": randomString(10),
            "shortDescription": randomString(50),
            "content": randomString(100),
            "blogId": blog.id
        }
        
        await request(app)
            .put('/posts/' + newPost.id)
            .expect(StatusCodes.UNAUTHORIZED)
    })

    it ('- PUT update by ID with incorrect id', async () => {
        const data: PostUpdateModel = {
            "title": randomString(10),
            "shortDescription": randomString(50),
            "content": randomString(100),
            "blogId": blog.id
        }

        const res = await request(app)
                .put('/posts/-1')
                .set('Authorization', ADMIN_LOGIN)
                .send(data)
                .expect(StatusCodes.NOT_FOUND)
    }) 

    it ('- PUT update the post with incorrect title', async () => {
        const data: PostUpdateModel = {
            "title": randomString(40),
            "shortDescription": randomString(50),
            "content": randomString(100),
            "blogId": blog.id
        }

        const res = await request(app)
                .put('/posts/' + newPost.id)
                .set('Authorization', ADMIN_LOGIN)
                .send(data)
                .expect(StatusCodes.BAD_REQUEST)

        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    message: expect.any(String),
                    field: 'title'
                }
            ]
        })
    })

    it ('- PUT update the post with incorrect shortDescription', async () => {
        const data: PostUpdateModel = {
            "title": randomString(10),
            "shortDescription": randomString(500),
            "content": randomString(100),
            "blogId": blog.id
        }

        const res = await request(app)
                .put('/posts/' + newPost.id)
                .set('Authorization', ADMIN_LOGIN)
                .send(data)
                .expect(StatusCodes.BAD_REQUEST)

        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    message: expect.any(String),
                    field: 'shortDescription'
                }
            ]
        })
    })

    it ('- PUT update the post with incorrect content', async () => {
        const data: PostUpdateModel = {
            "title": randomString(10),
            "shortDescription": randomString(50),
            "content": randomString(1100),
            "blogId": blog.id
        }

        const res = await request(app)
                .put('/posts/' + newPost.id)
                .set('Authorization', ADMIN_LOGIN)
                .send(data)
                .expect(StatusCodes.BAD_REQUEST)

        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    message: expect.any(String),
                    field: 'content'
                }
            ]
        })
    })

    it ('- PUT update the post with incorrect blogId', async () => {
        const data: PostUpdateModel = {
            "title": randomString(10),
            "shortDescription": randomString(50),
            "content": randomString(100),
            "blogId": '-1'
        }

        const res = await request(app)
                .put('/posts/' + newPost.id)
                .set('Authorization', ADMIN_LOGIN)
                .send(data)
                .expect(StatusCodes.BAD_REQUEST)

        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    message: expect.any(String),
                    field: 'blogId'
                }
            ]
        })
    })

    it('- PUT update the post with correct data', async () => {
        const data: PostUpdateModel = {
            "title": randomString(10),
            "shortDescription": randomString(50),
            "content": randomString(100),
            "blogId": blog.id
        }

        await request(app)
                .put('/posts/' + newPost.id)
                .set('Authorization', ADMIN_LOGIN)
                .send(data)
                .expect(StatusCodes.NO_CONTENT)

        const res = await request(app)
                        .get('/posts/' + newPost.id)

        const updatePost: PostViewModel = {
            ...newPost,
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId
        }
        
        expect(res.body).toEqual(updatePost)

        newPost = updatePost
    })

    it ('- DELETE post authorization error', async () => {      
        await request(app)
            .delete('/posts/' + newPost.id)
            .expect(StatusCodes.UNAUTHORIZED)
    })

    it ('- DELETE post by ID with incorrect id', async () => {      
        await request(app)
            .delete('/posts/-1')
            .set('Authorization', ADMIN_LOGIN)
            .expect(StatusCodes.NOT_FOUND)
    })

    it ('- DELETE post by ID with correct id', async () => {      
        await request(app)
            .delete('/posts/' + newPost.id)
            .set('Authorization', ADMIN_LOGIN)
            .expect(StatusCodes.NO_CONTENT)
    })

})