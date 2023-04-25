import request from "supertest"
import { app } from "../src/setting"
import { StatusCodes } from "http-status-codes"
import { client } from "../src/repositories/db"
import { UserCreateModel } from "../src/models/users/UserCreateModel"
import { randomString } from "../src/utils/utils"
import { UserViewModel } from "../src/models/users/UserViewModel"

const ADMIN_LOGIN = process.env.ADMIN_LOGIN ? process.env.ADMIN_LOGIN : ''

describe('/users', () => {

    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(StatusCodes.NO_CONTENT)
    })
    
    afterAll(async () => {
        client.close()
    })

    it ('- GET users authorization error', async () => {
        await request(app)
            .get('/users')
            .expect(StatusCodes.UNAUTHORIZED)
    })

    it ('- GET users = []', async () => {
        await request(app)
            .get('/users')
            .set('Authorization', ADMIN_LOGIN)
            .expect(StatusCodes.OK,
                    {
                        pagesCount: 0, 
                        page: 1, 
                        pageSize: 10, 
                        totalCount: 0, 
                        items: [] 
                    }
                )
    })

    it ('- POST create the user authorization error', async () => {
        const data: UserCreateModel = {
            login: randomString(5),
            password: randomString(10),
            email: 'user@user.com'
        }
        
        await request(app)
            .post('/users')
            .send(data)
            .expect(StatusCodes.UNAUTHORIZED)
    })


    it ('- POST create the user with incorrect login', async () => {
        const data: UserCreateModel = {
            login: randomString(15),
            password: randomString(10),
            email: 'user@user.com'
        }
        
        const res = await request(app)
            .post('/users')
            .set('Authorization', ADMIN_LOGIN)
            .send(data)
            .expect(StatusCodes.BAD_REQUEST)

        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    message: expect.any(String),
                    field: 'login'
                }
            ]
        })
    })
    
    it ('- POST create the user with incorrect password', async () => {
        const data: UserCreateModel = {
            login: randomString(7),
            password: randomString(25),
            email: 'user@user.com'
        }
        
        const res = await request(app)
            .post('/users')
            .set('Authorization', ADMIN_LOGIN)
            .send(data)
            .expect(StatusCodes.BAD_REQUEST)

        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    message: expect.any(String),
                    field: 'password'
                }
            ]
        })
    })   

    it ('- POST create the user with incorrect email', async () => {
        const data: UserCreateModel = {
            login: randomString(7),
            password: randomString(15),
            email: 'user'
        }
        
        const res = await request(app)
            .post('/users')
            .set('Authorization', ADMIN_LOGIN)
            .send(data)
            .expect(StatusCodes.BAD_REQUEST)

        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    message: expect.any(String),
                    field: 'email'
                }
            ]
        })
    })
    
    let newUser: UserViewModel

    it ('- POST create the user with correct data', async () => {
        const data: UserCreateModel = {
            login: randomString(7),
            password: randomString(15),
            email: 'user@user.com'
        }
        
        const res = await request(app)
            .post('/users')
            .set('Authorization', ADMIN_LOGIN)
            .send(data)
            .expect(StatusCodes.CREATED)

        newUser = res.body
        
        expect(newUser).toEqual({
            id: expect.any(String),
            login: data.login,
            email: data.email,
            createdAt: expect.any(String)
        })

    })   

    it ('- DELETE user authorization error', async () => {
        
        await request(app)
            .delete('/users/' + newUser.id)
            .expect(StatusCodes.UNAUTHORIZED)
    })

    it ('- DELETE user by ID with incorrect id', async () => {
        
        await request(app)
            .delete('/users/1')
            .set('Authorization', ADMIN_LOGIN)
            .expect(StatusCodes.NOT_FOUND)
    })

    it ('- DELETE blog by ID with correct id', async () => {      

        await request(app)
            .delete('/users/' + newUser.id)
            .set('Authorization', ADMIN_LOGIN)
            .expect(StatusCodes.NO_CONTENT)
    })        

    it ('- POST create new Users', async () => {
        for (let i = 0; i < 10; i++) {
            const data: UserCreateModel = {
                login: "user_" + i,
                password: "test_password",
                email: 'user_' + i + '@user.com'
            }
            
            const res = await request(app)
                .post('/users')
                .set('Authorization', ADMIN_LOGIN)
                .send(data)
                .expect(StatusCodes.CREATED)
        }
    })

    it ('- Pagination Users', async () => {

        const res = await request(app).get('/users?' + 
            'pageNumber=1&pageSize=2')
            .set('Authorization', ADMIN_LOGIN)
            .expect(StatusCodes.OK)
            
        expect(res.body).toEqual(
            {
                pagesCount: 5, 
                page: 1, 
                pageSize: 2, 
                totalCount: 10, 
                items: [
                    {
                        id: expect.any(String),
                        login: 'user_9',
                        email: 'user_9@user.com',
                        createdAt: expect.any(String)
                    },
                    {
                        id: expect.any(String),
                        login: 'user_8',
                        email: 'user_8@user.com',
                        createdAt: expect.any(String)
                    }
                ] 
            }
        )

        const res1 = await request(app).get('/users?' + 
            'pageNumber=2&pageSize=2')
            .set('Authorization', ADMIN_LOGIN)
            .expect(StatusCodes.OK)

        expect(res1.body).toEqual(
            {
                pagesCount: 5, 
                page: 2 , 
                pageSize: 2, 
                totalCount: 10, 
                items: [
                    {
                        id: expect.any(String),
                        login: 'user_7',
                        email: 'user_7@user.com',
                        createdAt: expect.any(String)
                    },
                    {
                        id: expect.any(String),
                        login: 'user_6',
                        email: 'user_6@user.com',
                        createdAt: expect.any(String)
                    }
                ] 
            }
        )

        const res2 = await request(app).get('/users?' + 
            'sortDirection=asc&pageNumber=1&pageSize=1')
            .set('Authorization', ADMIN_LOGIN)
            .expect(StatusCodes.OK)

        expect(res2.body).toEqual(
            {
                pagesCount: 10, 
                page: 1 , 
                pageSize: 1, 
                totalCount: 10, 
                items: [
                    {
                        id: expect.any(String),
                        login: 'user_0',
                        email: 'user_0@user.com',
                        createdAt: expect.any(String)
                    }
                ] 
            }
        )

        const res3 = await request(app).get('/users?' + 
            'sortDirection=asc&sortBy=login&pageNumber=1&pageSize=1')
            .set('Authorization', ADMIN_LOGIN)
            .expect(StatusCodes.OK)

        expect(res3.body).toEqual(
            {
                pagesCount: 10, 
                page: 1 , 
                pageSize: 1, 
                totalCount: 10, 
                items: [
                    {
                        id: expect.any(String),
                        login: 'user_0',
                        email: 'user_0@user.com',
                        createdAt: expect.any(String)
                    }
                ] 
            }
        )        

    })

    it ('- POST auth with incorrect loginOrEmail', async () => {

        const res = await request(app)
            .post('/auth/login')
            .send({
                password: '123456'
            })
            .expect(StatusCodes.BAD_REQUEST)

        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    message: expect.any(String),
                    field: 'loginOrEmail'
                }
            ]
        })    

    })

    it ('- POST auth with incorrect password', async () => {

        const res = await request(app)
            .post('/auth/login')
            .send({
                loginOrEmail: '123456'
            })
            .expect(StatusCodes.BAD_REQUEST)

        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    message: expect.any(String),
                    field: 'password'
                }
            ]
        })    

    })

    it ('- POST If the password or login is wrong', async () => {

        const data = {
            loginOrEmail: "user",
            password: "123456"
        }

        await request(app)
            .post('/auth/login')
            .send(data)
            .expect(StatusCodes.UNAUTHORIZED)
    })

    it ('- POST auth with correct data', async () => {

        await request(app)
            .post('/auth/login')
            .send({
                loginOrEmail: 'user_0',
                password: 'test_password'
            })
            .expect(StatusCodes.NO_CONTENT)

   

    })

})
