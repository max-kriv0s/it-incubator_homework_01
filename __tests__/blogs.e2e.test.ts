import request from "supertest";
import { app } from "../src/app";
import { StatusCodes } from "http-status-codes";
import { BlogViewModel } from "../src/models/blogs/BlogViewModel";
import { BlogCreateModel } from "../src/models/blogs/BlogCreateModel";
import { randomString } from "../src/utils/utils";
import { BlogUpdateModel } from "../src/models/blogs/BlogUpdateModel";
import { settings } from "../src/settings";
import mongoose from "mongoose";


describe('/blogs', () => {

    const MONGO_URI = settings.MONGO_URI
    const DB_NAME = settings.DB_NAME
    
    const ADMIN_LOGIN = process.env.ADMIN_LOGIN ? process.env.ADMIN_LOGIN : ''

    beforeAll(async () => {
        await mongoose.connect(MONGO_URI, {dbName: DB_NAME})
        await request(app).delete('/testing/all-data').expect(StatusCodes.NO_CONTENT)
    })
    
    afterAll(async () => {
        await mongoose.connection.close()
    })

    it ('- GET blogs = []', async () => {
        await request(app)
            .get('/blogs')
            .expect(StatusCodes.OK, 
                { 
                    pagesCount: 0, 
                    page: 1, 
                    pageSize: 10, 
                    totalCount: 0, 
                    items: [] 
                })
    })

    it('- GET blog by ID with incorrect id', async () => {
        await request(app)
            .get('/blogs/1')
            .expect(StatusCodes.NOT_FOUND)
    })

    let newBlog: BlogViewModel;

    it ('- POST create the blog authorization error', async () => {
        const data: BlogCreateModel = {
            name: randomString(10),
            description: randomString(20),
            websiteUrl: 'https://www.google.com/'
        }
        
        await request(app)
            .post('/blogs')
            .send(data)
            .expect(StatusCodes.UNAUTHORIZED)
    })

    it ('- POST create the blog with incorrect name', async () => {
        const data: BlogCreateModel = {
            name: randomString(20),
            description: randomString(20),
            websiteUrl: 'https://www.google.com/'
        }
        
        const res = await request(app)
                        .post('/blogs')
                        .set('Authorization', ADMIN_LOGIN)
                        .send(data)
                        .expect(StatusCodes.BAD_REQUEST)
        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    message: expect.any(String),
                    field: 'name'
                }
            ]
        })
    })

    it ('- POST create the blog with incorrect description', async () => {
        const data: BlogCreateModel = {
            name: randomString(10),
            description: randomString(600),
            websiteUrl: 'https://www.google.com/'
        }
        
        const res = await request(app)
                        .post('/blogs')
                        .set('Authorization', ADMIN_LOGIN)
                        .send(data)
                        .expect(StatusCodes.BAD_REQUEST)
        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    message: expect.any(String),
                    field: 'description'
                }
            ]
        })
    })

    it ('- POST create the blog with incorrect websiteUrl', async () => {
        const data: BlogCreateModel = {
            name: randomString(10),
            description: randomString(30),
            websiteUrl: 'www.google.com/'
        }
        
        const res = await request(app)
                        .post('/blogs')
                        .set('Authorization', ADMIN_LOGIN)
                        .send(data)
                        .expect(StatusCodes.BAD_REQUEST)
        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    message: expect.any(String),
                    field: 'websiteUrl'
                }
            ]
        })
    })

    it('- POST create the blog with correct data', async () => {
        const data: BlogCreateModel = {
            name: randomString(10),
            description: randomString(30),
            websiteUrl: 'https://www.google.com'
        }   

        const res = await request(app)
                        .post('/blogs')
                        .set('Authorization', ADMIN_LOGIN)
                        .send(data)
                        .expect(StatusCodes.CREATED)

        newBlog = res.body

        expect(newBlog).toEqual({
            id: expect.any(String),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            isMembership: false,
            createdAt: expect.any(String)
        })

        await request(app)
            .get('/blogs')
            .expect(StatusCodes.OK, 
                { 
                    pagesCount: 1, 
                    page: 1, 
                    pageSize: 10, 
                    totalCount: 1, 
                    items: [newBlog] 
                })
    })

    it ('- GET blog by ID with correct id', async () => {
        await request(app)
            .get('/blogs/' + newBlog.id)
            .expect(StatusCodes.OK, newBlog)
    })

    it ('- PUT update the blog authorization error', async () => {
        const data: BlogCreateModel = {
            name: randomString(10),
            description: randomString(20),
            websiteUrl: 'https://www.google.com/'
        }
        
        await request(app)
            .put('/blogs/' + newBlog.id)
            .expect(StatusCodes.UNAUTHORIZED)
    })

    it ('- PUT update  by ID with incorrect id', async () => {
        const data: BlogUpdateModel = {
            name: randomString(10),
            description: randomString(20),
            websiteUrl: 'https://www.google.com/'   
        }

        const res = await request(app)
                .put('/blogs/-1')
                .set('Authorization', ADMIN_LOGIN)
                .send(data)
                .expect(StatusCodes.NOT_FOUND)
    }) 

    it ('- PUT update the blog with incorrect name', async () => {
        const data: BlogUpdateModel = {
            name: randomString(20),
            description: randomString(20),
            websiteUrl: 'https://www.google.com/'   
        }

        const res = await request(app)
                .put('/blogs/' + newBlog.id)
                .set('Authorization', ADMIN_LOGIN)
                .send(data)
                .expect(StatusCodes.BAD_REQUEST)

        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    message: expect.any(String),
                    field: 'name'
                }
            ]
        })
    })

    it ('- PUT update the blog with incorrect description', async () => {
        const data: BlogUpdateModel = {
            name: randomString(10),
            description: randomString(600),
            websiteUrl: 'https://www.google.com/'   
        }

        const res = await request(app)
                .put('/blogs/' + newBlog.id)
                .set('Authorization', ADMIN_LOGIN)
                .send(data)
                .expect(StatusCodes.BAD_REQUEST)

        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    message: expect.any(String),
                    field: 'description'
                }
            ]
        })
    })

    it ('- PUT update the blog with incorrect websiteUrl', async () => {
        const data: BlogUpdateModel = {
            name: randomString(10),
            description: randomString(100),
            websiteUrl: 'google.com'   
        }

        const res = await request(app)
                .put('/blogs/' + newBlog.id)
                .set('Authorization', ADMIN_LOGIN)
                .send(data)
                .expect(StatusCodes.BAD_REQUEST)

        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    message: expect.any(String),
                    field: 'websiteUrl'
                }
            ]
        })
    })

    it('- PUT update the blog with correct data', async () => {
        const data: BlogCreateModel = {
            name: randomString(10),
            description: randomString(30),
            websiteUrl: 'https://www.google.com'
        }   

        await request(app)
            .put('/blogs/' + newBlog.id)
            .set('Authorization', ADMIN_LOGIN)
            .send(data)
            .expect(StatusCodes.NO_CONTENT)

        const res = await request(app)
                        .get('/blogs/' + newBlog.id)
                        
        const updateBlog: BlogViewModel = {
            ...newBlog,
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl
        }
        
        expect(res.body).toEqual(updateBlog)

        newBlog = updateBlog
    })

    it ('- DELETE blog authorization error', async () => {      
        await request(app)
            .delete('/blogs/' + newBlog.id)
            .expect(StatusCodes.UNAUTHORIZED)
    })

    it ('- DELETE blog by ID with incorrect id', async () => {      
        await request(app)
            .delete('/blogs/-1')
            .set('Authorization', ADMIN_LOGIN)
            .expect(StatusCodes.NOT_FOUND)
    })

    it ('- DELETE blog by ID with correct id', async () => {      
        await request(app)
            .delete('/blogs/' + newBlog.id)
            .set('Authorization', ADMIN_LOGIN)
            .expect(StatusCodes.NO_CONTENT)
    })

})